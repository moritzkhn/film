import {
    FilmFileController,
    FilmGetController,
    FilmWriteController,
} from './rest/index.js';
import {
    FilmFileService,
    FilmReadService,
    FilmValidationService,
    FilmWriteService,
} from './service/index.js';
import { FilmMutationResolver, FilmQueryResolver } from './graphql/index.js';
import { collectionName, filmSchema } from './entity/index.js';

import { AuthModule } from '../security/auth/auth.module.js';
import { DbModule } from '../db/db.module.js';
import { MailModule } from '../mail/mail.module.js';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Das Modul besteht aus Controller- und Service-Klassen für die Verwaltung von
 * Bücher.
 * @packageDocumentation
 */

/**
 * Die dekorierte Modul-Klasse mit Controller- und Service-Klassen sowie der
 * Funktionalität für Mongoose.
 */
@Module({
    imports: [
        MailModule,
        MongooseModule.forFeature([
            {
                name: collectionName,
                schema: filmSchema,
                collection: collectionName,
            },
        ]),
        AuthModule,
        DbModule,
    ],
    controllers: [FilmGetController, FilmWriteController, FilmFileController],
    // Provider sind z.B. Service-Klassen fuer DI
    providers: [
        FilmReadService,
        FilmWriteService,
        FilmFileService,
        FilmValidationService,
        FilmQueryResolver,
        FilmMutationResolver,
    ],
    // Export der Provider fuer DI in anderen Modulen
    exports: [
        FilmReadService,
        FilmWriteService,
        FilmValidationService,
        FilmFileService,
    ],
})
export class FilmModule {}
