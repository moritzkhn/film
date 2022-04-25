/**
 * Das Modul besteht aus den Klassen {@linkcode FilmReadService},
 * {@linkcode FilmReadService} und {@linkcode FilmFileService}, um Filme und
 * ihre zugehörige Binärdateien in MongoDB abzuspeichern, auszulesen, zu ändern
 * und zu löschen einschließlich der Klassen für die Fehlerbehandlung.
 * @packageDocumentation
 */
export { FilmFileService } from './film-file.service.js';
export { FilmValidationService } from './film-validation.service.js';
export { FilmReadService } from './film-read.service.js';
export { FilmWriteService } from './film-write.service.js';
export {
    type FilmNotExists,
    type ConstraintViolations,
    type CreateError,
    type FileFindError,
    type FileNotFound,
    type InvalidContentType,
    type IsanExists,
    type MultipleFiles,
    type NameExists,
    type UpdateError,
    type VersionInvalid,
    type VersionOutdated,
} from './errors.js';
export { MAX_BEWERTUNG, jsonSchema } from './jsonSchema.js';
