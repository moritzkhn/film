import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
    type CreateError,
    FilmWriteService,
    type UpdateError,
} from '../service/index.js';
import {
    JwtAuthGraphQlGuard,
    Roles,
    RolesGraphQlGuard,
} from '../../security/index.js';
import { ResponseTimeInterceptor, getLogger } from '../../logger/index.js';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Film } from '../entity/index.js';
import { type ObjectId } from 'bson';
import { UserInputError } from 'apollo-server-express';

export type FilmDTO = Film & {
    id: string;
    version: number;
};

export interface FilmUpdateInput {
    id?: string;
    version?: number;
    film: Film;
}

interface Id {
    id: string;
}

@Resolver()
// alternativ: globale Aktivierung der Guards https://docs.nestjs.com/security/authorization#basic-rbac-implementation
@UseGuards(JwtAuthGraphQlGuard, RolesGraphQlGuard)
@UseInterceptors(ResponseTimeInterceptor)
export class FilmMutationResolver {
    readonly #service: FilmWriteService;

    readonly #logger = getLogger(FilmMutationResolver.name);

    constructor(service: FilmWriteService) {
        this.#service = service;
    }

    @Mutation()
    @Roles('admin', 'mitarbeiter')
    async create(@Args() input: Film) {
        this.#logger.debug('createFilm: input=%o', input);
        const result = await this.#service.create(input);
        this.#logger.debug('createFilm: result=%o', result);
        if (Object.prototype.hasOwnProperty.call(result, 'type')) {
            // UserInputError liefert Statuscode 200
            throw new UserInputError(
                this.#errorMsgCreateFilm(result as CreateError),
            );
        }
        return (result as ObjectId).toString();
    }

    @Mutation()
    @Roles('admin', 'mitarbeiter')
    async update(@Args() filmDTO: FilmUpdateInput) {
        this.#logger.debug('updateFilm: filmDTO=%o', filmDTO);
        // nullish coalescing
        const { id, version, film } = filmDTO;
        const versionStr = `"${(version ?? 0).toString()}"`;

        const result = await this.#service.update(id!, film, versionStr); // eslint-disable-line @typescript-eslint/no-non-null-assertion
        if (typeof result === 'object') {
            throw new UserInputError(this.#errorMsgUpdateFilm(result));
        }
        this.#logger.debug('updateFilm: result=%d', result);
        return result;
    }

    @Mutation()
    @Roles('admin')
    async delete(@Args() id: Id) {
        const idStr = id.id;
        this.#logger.debug('deleteFilm: id=%s', idStr);
        const result = await this.#service.delete(idStr);
        this.#logger.debug('deleteFilm: result=%s', result);
        return result;
    }

    #errorMsgCreateFilm(err: CreateError) {
        switch (err.type) {
            case 'ConstraintViolations':
                return err.messages.join(' ');
            case 'NameExists':
                return `Der Name "${err.name}" existiert bereits`;
            case 'IsanExists':
                return `Die ISAN ${err.isan} existiert bereits`;
            default:
                return 'Unbekannter Fehler';
        }
    }

    #errorMsgUpdateFilm(err: UpdateError) {
        switch (err.type) {
            case 'ConstraintViolations':
                return err.messages.join(' ');
            case 'NameExists':
                return `Der Name "${err.name}" existiert bereits`;
            case 'FilmNotExists':
                return `Es gibt kein Film mit der ID ${err.id}`;
            case 'VersionInvalid':
                return `"${err.version}" ist keine gueltige Versionsnummer`;
            case 'VersionOutdated':
                return `Die Versionsnummer "${err.version}" ist nicht mehr aktuell`;
            default:
                return 'Unbekannter Fehler';
        }
    }
}
