import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { type ObjectID } from 'bson';
import { dbConfig } from '../../config/index.js';
import mongoose from 'mongoose';

mongoose.SchemaType.set('debug', true);

const MONGOOSE_OPTIONS: mongoose.SchemaOptions = {
    timestamps: true,

    optimisticConcurrency: true,

    autoIndex: dbConfig.autoIndex,
};

@Schema(MONGOOSE_OPTIONS)
export class Film {
    @Prop({ type: String, required: true, unique: true })
    @ApiProperty({ example: 'Der Name', type: String })
    readonly name: string | null | undefined;

    @Prop({ type: String, required: true, unique: true })
    @ApiProperty({ example: 'Der Produzent', type: String })
    readonly produzent: string | null | undefined;

    @Prop({ type: String, required: true, unique: true, immutable: true })
    @ApiProperty({ example: '0000-0000-16FF-0000-Y', type: String })
    readonly isan: string | null | undefined;

    @Prop({ type: Number, required: true })
    @ApiProperty({ example: 1, type: Number })
    readonly preis: number | undefined;

    @Prop({ type: Number, min: 0, max: 5 })
    @ApiProperty({ example: 5, type: Number })
    readonly bewertung: number | null | undefined;
}
const optimistic = (schema: mongoose.Schema<mongoose.Document<Film>>) => {
    schema.pre<
        mongoose.Query<mongoose.Document<Film>, mongoose.Document<Film>>
    >('findOneAndUpdate', function () {
        const update = this.getUpdate(); // eslint-disable-line @typescript-eslint/no-invalid-this
        if (update === null) {
            return;
        }

        const updateDoc = update as mongoose.Document<Film>;
        if (updateDoc.__v !== null) {
            delete updateDoc.__v;
        }

        for (const key of ['$set', '$setOnInsert']) {
            /* eslint-disable security/detect-object-injection */
            // @ts-expect-error siehe https://mongoosejs.com/docs/guide.html#versionKey
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const updateKey = update[key];
            if (updateKey?.__v !== null) {
                delete updateKey.__v;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                if (Object.entries(updateKey).length === 0) {
                    // @ts-expect-error UpdateQuery laesst nur Lesevorgaenge zu: abgeleitet von ReadonlyPartial<...>
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete update[key];
                }
            }
            /* eslint-enable security/detect-object-injection */
        }
        // @ts-expect-error $inc ist in _UpdateQuery<TSchema> enthalten
        update.$inc = update.$inc || {}; // eslint-disable-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unsafe-assignment
        // @ts-expect-error UpdateQuery laesst nur Lesevorgaenge zu: abgeleitet von ReadonlyPartial<...>
        update.$inc.__v = 1;
    });
};

// Schema passend zur Entity-Klasse erzeugen
export const filmSchema = SchemaFactory.createForClass(Film);

// Indexe anlegen (max. 3 bei Atlas)
// hier: aufsteigend (1) sowie "unique" oder "sparse"
filmSchema.index({ name: 1 }, { unique: true, name: 'name' });
filmSchema.index({ produzent: 1 }, { name: 'produzent' });

// Document: _id? (vom Type ObjectID) und __v? als Properties
export type FilmDocument = Film &
    mongoose.Document<ObjectID, any, Film> & { _id: ObjectID; __v: number }; // eslint-disable-line @typescript-eslint/naming-convention

filmSchema.plugin(optimistic);

export const modelName = 'Film';
export const collectionName = modelName;

export const exactFilterProperties = [
    'name',
    'produzent',
    'preis',
    'bewertung',
    'isan',
];
