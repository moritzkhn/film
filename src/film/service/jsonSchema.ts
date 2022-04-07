import { type GenericJsonSchema } from './GenericJsonSchema.js';

export const MAX_BEWERTUNG = 10;

export const jsonSchema: GenericJsonSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://acme.com/film.json#',
    name: 'Film',
    description: 'Eigenschaften eines Filmes: Typen und Constraints',
    type: 'object',
    properties: {
        /* eslint-enable @typescript-eslint/naming-convention */
        _id: { type: 'object' },
        __v: {
             type: 'number',
              minimum: 0,
        },
        /* eslint-enable @typescript-eslint/naming-convention */
        version: {
            type: 'number',
            minimum: 0,
        },
        name: {
            type: 'string',
            pattern: '^\\w.*',
        },
        produzent: {
            type: 'string',
            pattern: '^\\w.*',
        },
        bewertung: {
            type: 'number',
            minimum: 0,
            maximum: MAX_BEWERTUNG,
        },
        preis: {
            type: 'number',
            minimum: 0,
        },
        isan: { type: 'string', format: 'ISAN' },
        },
    },
    // isan ist NUR beim Neuanlegen ein Pflichtfeld
    required: ['name', 'produzent', 'isan'],
    additionalProperties: false,
    errorMessage: {
        properties: {
            version: 'Die Versionsnummer muss mindestens 0 sein.',
            name: 'Ein Filmname muss mit einem Buchstaben, einer Ziffer oder _ beginnen.',
            produzent: 'Ein Produzent muss mit einem Buchstaben, einer Ziffer oder _ beginnen.',
            bewertung: 'Eine Bewertung muss zwischen 0 und 10 liegen.',
            preis: 'Der Preis darf nicht negativ sein.',
            isan: 'Die ISAN-Nummer ist nicht korrekt.',
        },
    },
};