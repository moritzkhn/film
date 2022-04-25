/**
 * Das Modul besteht aus der Klasse {@linkcode AuthService} für die Authentifizierung.
 * @packageDocumentation
 */

import {
    type CreateError,
    type FilmNotExists,
    type NameExists,
    type UpdateError,
    type VersionInvalid,
    type VersionOutdated,
} from './errors';
import { type Film, type FilmDocument, modelName } from '../entity/index.js';
import { FilmValidationService } from './film-validation.service.js';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { MailService } from '../../mail/mail.service.js';
import { ObjectID } from 'bson';
import RE2 from 're2';
import { getLogger } from '../../logger/index.js';
import mongoose from 'mongoose';

// API-Dokumentation zu Mongoose:
// http://mongoosejs.com/docs/api.html
// https://github.com/Automattic/mongoose/issues/3949

/**
 * Die Klasse `FilmWriteService` implementiert den Anwendungskern für das
 * Schreiben von Filmen und greift mit _Mongoose_ auf MongoDB zu.
 */
@Injectable()
export class FilmWriteService {
    private static readonly UPDATE_OPTIONS: mongoose.QueryOptions = {
        new: true,
    };

    private static readonly VERSION_PATTERN = new RE2('^"\\d*"');

    readonly #filmModel: mongoose.Model<FilmDocument>;

    readonly #validationService: FilmValidationService;

    readonly #mailService: MailService;

    readonly #logger = getLogger(FilmWriteService.name);

    constructor(
        @InjectModel(modelName) filmModel: mongoose.Model<FilmDocument>,
        validationService: FilmValidationService,
        mailService: MailService,
    ) {
        this.#filmModel = filmModel;
        this.#validationService = validationService;
        this.#mailService = mailService;
    }

    /**
     * Einer neuer Film soll angelegt werden.
     * @param film Das neu abzulegende Film
     * @returns Die ID des neu angelegten Filmes oder im Fehlerfall
     * {@linkcode CreateError}
     */
    async create(film: Film): Promise<CreateError | ObjectID> {
        this.#logger.debug('create: film=%o', film);
        const validateResult = await this.#validateCreate(film);
        if (validateResult !== undefined) {
            return validateResult;
        }

        const filmDocument = new this.#filmModel(film);
        const saved = await filmDocument.save();
        const id = saved._id;

        await this.#sendmail(saved);

        this.#logger.debug('create: id=%s', id);
        return id;
    }

    /**
     * Ein vorhandener Film soll aktualisiert werden.
     * @param film Der zu aktualisierende Film
     * @param id ID des zu aktualisierenden Films
     * @param version Die Versionsnummer für optimistische Synchronisation
     * @returns Die neue Versionsnummer gemäß optimistischer Synchronisation
     *  oder im Fehlerfall {@linkcode UpdateError}
     */
    async update(
        id: string,
        film: Film,
        version: string,
    ): Promise<UpdateError | number> {
        this.#logger.debug(
            'update: id=%s,  film=%o, version=%s',
            id,
            film,
            version,
        );
        if (!ObjectID.isValid(id)) {
            this.#logger.debug('update: Keine gueltige ObjectID');
            return { type: 'FilmNotExists', id };
        }

        const validateResult = await this.#validateUpdate(film, id, version);
        if (validateResult !== undefined) {
            return validateResult;
        }

        // findByIdAndReplace ersetzt ein Document mit ggf. weniger Properties
        // Weitere Methoden zum Aktualisieren:
        //    Document.findOneAndUpdate(update)
        //    document.updateOne(bedingung)
        const options = FilmWriteService.UPDATE_OPTIONS;
        // eslint-disable-next-line prettier/prettier
        const updated = await this.#filmModel.findByIdAndUpdate( //NOSONAR
            new ObjectID(id),
            film,
            options,
        );
        if (updated === null) {
            this.#logger.debug('update: Kein Film mit id=%s', id);
            return { type: 'FilmNotExists', id };
        }

        const versionUpdated = updated.__v as number;
        this.#logger.debug('update: versionUpdated=%s', versionUpdated);

        return versionUpdated;
    }

    /**
     * Ein Film wird asynchron anhand seiner ID gelöscht.
     *
     * @param idStr ID des zu löschenden Film
     * @returns true, falls das Film vorhanden war und gelöscht wurde. Sonst false.
     */
    async delete(idStr: string) {
        this.#logger.debug('delete: idStr=%s', idStr);
        if (!ObjectID.isValid(idStr)) {
            this.#logger.debug('delete: Keine gueltige ObjectID');
            return false;
        }

        // Das Film zur gegebenen ID asynchron loeschen
        const deleted = await this.#filmModel //NOSONAR
            .findByIdAndDelete(new ObjectID(idStr))
            .lean<Film | null>();
        this.#logger.debug('delete: deleted=%o', deleted);
        return deleted !== null;

        // Weitere Methoden von mongoose, um zu loeschen:
        //  Film.findByIdAndRemove(id)
        //  Film.findOneAndRemove(bedingung)
    }

    async #validateCreate(film: Film): Promise<CreateError | undefined> {
        const messages = this.#validationService.validate(film);
        if (messages.length > 0) {
            this.#logger.debug('#validateCreate: messages=%o', messages);
            return { type: 'ConstraintViolations', messages };
        }

        // statt 2 sequentiellen DB-Zugriffen waere 1 DB-Zugriff mit OR besser

        const { name } = film;
        // eslint-disable-next-line security/detect-non-literal-fs-filename, prettier/prettier
        if (await this.#filmModel.exists({ name })) { //NOSONAR
            return { type: 'NameExists', name };
        }

        const { isan } = film;
        // eslint-disable-next-line security/detect-non-literal-fs-filename, prettier/prettier
        if (await this.#filmModel.exists({ isan })) { //NOSONAR
            return { type: 'IsanExists', isan };
        }

        this.#logger.debug('#validateCreate: ok');
        return undefined;
    }

    async #sendmail(film: FilmDocument) {
        const subject = `Neuer Film ${film.id as string}`;
        const body = `Der Film mit dem Namen <strong>${film.name}</strong> ist angelegt`;
        await this.#mailService.sendmail(subject, body);
    }

    async #validateUpdate(
        film: Film,
        id: string,
        versionStr: string,
    ): Promise<UpdateError | undefined> {
        const result = this.#validateVersion(versionStr);
        if (typeof result !== 'number') {
            return result;
        }

        const version = result;
        this.#logger.debug(
            '#validateUpdate: film=%o, version=%s',
            film,
            version,
        );

        const messages = this.#validationService.validate(film);
        if (messages.length > 0) {
            return { type: 'ConstraintViolations', messages };
        }

        const resultName = await this.#checkNameExists(film);
        if (resultName !== undefined && resultName.id !== id) {
            return resultName;
        }

        const resultIdAndVersion = await this.#checkIdAndVersion(id, version);
        if (resultIdAndVersion !== undefined) {
            return resultIdAndVersion;
        }

        this.#logger.debug('#validateUpdate: ok');
        return undefined;
    }

    #validateVersion(version: string | undefined): VersionInvalid | number {
        if (
            version === undefined ||
            !FilmWriteService.VERSION_PATTERN.test(version)
        ) {
            const error: VersionInvalid = { type: 'VersionInvalid', version };
            this.#logger.debug('#validateVersion: VersionInvalid=%o', error);
            return error;
        }

        return Number.parseInt(version.slice(1, -1), 10);
    }

    async #checkNameExists(film: Film): Promise<NameExists | undefined> {
        const { name } = film;

        const result = await this.#filmModel.findOne({ name }, { _id: true }); //NOSONAR
        if (result !== null) {
            const id = result._id.toString();
            this.#logger.debug('#checkNameExists: id=%s', id);
            return { type: 'NameExists', name, id };
        }

        this.#logger.debug('#checkNameExists: ok');
        return undefined;
    }

    async #checkIdAndVersion(
        id: string,
        version: number,
    ): Promise<FilmNotExists | VersionOutdated | undefined> {
        const filmDb = await this.#filmModel.findById(id); //NOSONAR
        if (filmDb === null) {
            const result: FilmNotExists = { type: 'FilmNotExists', id };
            this.#logger.debug('#checkIdAndVersion: FilmNotExists=%o', result);
            return result;
        }

        // nullish coalescing
        const versionDb = (filmDb.__v ?? 0) as number;
        if (version < versionDb) {
            const result: VersionOutdated = {
                type: 'VersionOutdated',
                id,
                version,
            };
            this.#logger.debug(
                '#checkIdAndVersion: VersionOutdated=%o',
                result,
            );
            return result;
        }

        return undefined;
    }
}
