/**
 * Das Modul besteht aus der Klasse {@linkcode AuthService} für die
 * Authentifizierung.
 * @packageDocumentation
 */
import {
    type FilmDocument,
    exactFilterProperties,
    modelName,
} from '../entity/index.js';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ObjectID } from 'bson';
import { getLogger } from '../../logger/index.js';
import mongoose from 'mongoose';

/* eslint-disable unicorn/no-useless-undefined */

/**
 * Die Klasse `FilmReadService` implementiert das Lesen für Filme und greift
 * mit _Mongoose_ auf MongoDB zu.
 */
@Injectable()
export class FilmReadService {
    readonly #filmModel: mongoose.Model<FilmDocument>;

    readonly #logger = getLogger(FilmReadService.name);

    constructor(
        @InjectModel(modelName) filmModel: mongoose.Model<FilmDocument>,
    ) {
        this.#filmModel = filmModel;
    }

    /**
     * Ein Film asynchron anhand seiner ID suchen
     * @param id ID des gesuchten Filmes
     * @returns Der gefundene Film vom Typ {@linkcode Film} oder undefined
     *          in einem Promise
     */
    async findById(idStr: string) {
        this.#logger.debug('findById: idStr=%s', idStr);

        // ein Film zur gegebenen ID asynchron mit Mongoose suchen
        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        // Das Resultat ist null, falls nicht gefunden.
        // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document,
        // so dass u.a. der virtuelle getter "id" auch nicht mehr vorhanden ist.
        // ObjectID: 12-Byte Binaerwert, d.h. 24-stellinger HEX-String
        if (!ObjectID.isValid(idStr)) {
            this.#logger.debug('findById: Ungueltige ObjectID');
            return undefined;
        }

        const id = new ObjectID(idStr);
        const film = await this.#filmModel.findById(id); //NOSONAR
        this.#logger.debug('findById: film=%o', film);

        return film || undefined;
    }

    /**
     * Filme asynchron suchen.
     * @param filter Die DB-Query als JSON-Objekt
     * @returns Ein JSON-Array mit den gefundenen Filmen. Ggf. ist das Array leer.
     */
    // eslint-disable-next-line max-lines-per-function
    async find(filter?: mongoose.FilterQuery<FilmDocument> | undefined) {
        this.#logger.debug('find: filter=%o', filter);

        // alle Buecher asynchron suchen u. aufsteigend nach titel sortieren
        // https://docs.mongodb.org/manual/reference/object-id
        // entries(): { titel: 'a', rating: 5 } => [{ titel: 'x'}, {rating: 5}]
        if (filter === undefined || Object.entries(filter).length === 0) {
            return this.#findAll();
        }

        // { titel: 'a', rating: 5, javascript: true }
        // Rest Properties
        const { titel, javascript, typescript, ...dbFilter } = filter;
        if (this.#checkInvalidProperty(dbFilter)) {
            return [];
        }

        // Buecher zur Query (= JSON-Objekt durch Express) asynchron suchen
        // Titel in der Query: Teilstring des Titels,
        // d.h. "LIKE" als regulaerer Ausdruck
        // 'i': keine Unterscheidung zw. Gross- u. Kleinschreibung
        // NICHT /.../, weil das Muster variabel sein muss
        // CAVEAT: KEINE SEHR LANGEN Strings wg. regulaerem Ausdruck
        // RegExp statt RE2 wegen Mongoose
        if (
            titel !== undefined &&
            titel !== null &&
            typeof titel === 'string'
        ) {
            dbFilter.titel =
                // TODO Komplexitaet des regulaeren Ausrucks analysieren
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                titel.length < 10
                    ? new RegExp(titel, 'iu') // eslint-disable-line security/detect-non-literal-regexp, security-node/non-literal-reg-expr
                    : titel;
        }

        // z.B. {javascript: true, typescript: true}
        const schlagwoerter = [];
        if (javascript === 'true') {
            schlagwoerter.push('JAVASCRIPT');
        }
        if (typescript === 'true') {
            schlagwoerter.push('TYPESCRIPT');
        }
        if (schlagwoerter.length === 0) {
            if (Array.isArray(dbFilter.schlagwoerter)) {
                dbFilter.schlagwoerter.splice(0);
            }
        } else {
            dbFilter.schlagwoerter = schlagwoerter;
        }

        // Pattern "Active Record" (urspruengl. von Ruby-on-Rails)
        // leeres Array, falls nichts gefunden wird
        // Model<Document>.findOne(query), falls das Suchkriterium eindeutig ist
        // bei findOne(query) wird null zurueckgeliefert, falls nichts gefunden
        // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
        // eslint-disable-next-line prettier/prettier
        const filme = await this.#filmModel.find( //NOSONAR
            dbFilter as mongoose.FilterQuery<FilmDocument>,
        );
        this.#logger.debug('find: filme=%o', filme);

        return filme;
    }

    async #findAll() {
        this.#logger.debug('#findAll');
        // lean() liefert ein "Plain JavaScript Object" statt ein Mongoose Document
        const filme = await this.#filmModel.find().sort('titel'); //NOSONAR
        this.#logger.debug('#findAll: filme=%o', filme);
        return filme;
    }

    #checkInvalidProperty(dbFilter: Record<string, string>) {
        const filterKeys = Object.keys(dbFilter);
        const result = filterKeys.some(
            (key) => !exactFilterProperties.includes(key),
        );
        this.#logger.debug('#checkInvalidProperty: result=%o', result);
        return result;
    }
}

/* eslint-enable unicorn/no-useless-undefined */
