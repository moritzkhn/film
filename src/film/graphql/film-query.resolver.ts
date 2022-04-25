import { Args, Query, Resolver } from '@nestjs/graphql';
import { type Film, type FilmDocument } from '../entity/index.js';
import { ResponseTimeInterceptor, getLogger } from '../../logger/index.js';
import { FilmReadService } from '../service/index.js';
import { UseInterceptors } from '@nestjs/common';
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
@UseInterceptors(ResponseTimeInterceptor)
export class FilmQueryResolver {
    readonly #service: FilmReadService;

    readonly #logger = getLogger(FilmQueryResolver.name);

    constructor(service: FilmReadService) {
        this.#service = service;
    }

    @Query('film')
    async findById(@Args() id: Id) {
        const idStr = id.id;
        this.#logger.debug('findById: id=%s', idStr);

        const film = await this.#service.findById(idStr);
        if (film === undefined) {
            // UserInputError liefert Statuscode 200
            // Weitere Error-Klasse in apollo-server-errors:
            // SyntaxError, ValidationError, AuthenticationError, ForbiddenError,
            // PersistedQuery, PersistedQuery
            // https://www.apollographql.com/blog/graphql/error-handling/full-stack-error-handling-with-graphql-apollo
            throw new UserInputError(
                `Es wurde kein Film mit der ID ${idStr} gefunden.`,
            );
        }
        const filmDTO = this.#toFilmDTO(film);
        this.#logger.debug('findById: filmDTO=%o', filmDTO);
        return filmDTO;
    }

    @Query('filme')
    async find(@Args() name: { name: string } | undefined) {
        const nameStr = name?.name;
        this.#logger.debug('find: name=%s', nameStr);
        const suchkriterium = nameStr === undefined ? {} : { name: nameStr };
        const filme = await this.#service.find(suchkriterium);
        if (filme.length === 0) {
            // UserInputError liefert Statuscode 200
            throw new UserInputError('Es wurden keine Filme gefunden.');
        }

        const filmeDTO = filme.map((film) => this.#toFilmDTO(film));
        this.#logger.debug('find: filmeDTO=%o', filmeDTO);
        return filmeDTO;
    }

    // Resultat mit id (statt _id) und version (statt __v)
    // __ ist bei GraphQL fuer interne Zwecke reserviert
    #toFilmDTO(film: FilmDocument) {
        const filmDTO: FilmDTO = {
            id: film._id.toString(),
            version: film.__v as number,
            name: film.name,
            produzent: film.produzent,
            isan: film.isan,
            preis: film.preis,
            bewertung: film.bewertung,
        };
        return filmDTO;
    }
}
