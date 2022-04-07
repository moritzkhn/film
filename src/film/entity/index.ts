/**
 * Das Modul besteht aus Interfaces, Klassen und Funktionen für Bücher als
 * _Entity_ gemäß _Domain Driven Design_. Dazu gehört auch die Validierung.
 * @packageDocumentation
 */
export {
    type FilmDocument,
    Film,
    filmSchema,
    collectionName,
    exactFilterProperties,
    modelName,
} from './film.js';
