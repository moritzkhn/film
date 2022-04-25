/*
 * Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { type Film } from '../../film/entity/index.js';
import { ObjectID } from 'bson';

// eslint-disable-next-line @typescript-eslint/naming-convention
type FilmIdVersion = Film & { _id: ObjectID; __v: number };

/* eslint-disable @typescript-eslint/naming-convention */
export const testdaten: FilmIdVersion[] = [
    // -------------------------------------------------------------------------
    // L e s e n
    // -------------------------------------------------------------------------
    {
        _id: new ObjectID('000000000000000000000001'),
        name: 'Star Wars Teil 1',
        produzent: 'Lucas Arts',
        isan: '000000000000000000000001',
        preis: 19.99,
        bewertung: 4,
        __v: 0,
    },
    {
        _id: new ObjectID('000000000000000000000002'),
        name: 'Harry Potter Teil 2',
        produzent: 'Warner Brothers',
        isan: '000000000000000000000002',
        preis: 19.99,
        bewertung: 3,
        __v: 0,
    },
    {
        _id: new ObjectID('000000000000000000000003'),
        name: 'Harry Potter Teil 3',
        produzent: 'Warner Brothers',
        isan: '000000000000000000000003',
        preis: 25.99,
        bewertung: 5,
        __v: 0,
    },
    // -------------------------------------------------------------------------
    // A e n d e r n
    // -------------------------------------------------------------------------
    {
        _id: new ObjectID('000000000000000000000004'),
        name: 'Harry Potter Teil 4',
        produzent: 'Netflix',
        isan: '000000000000000000000004',
        preis: 17.99,
        bewertung: 4,
        __v: 0,
    },
    // -------------------------------------------------------------------------
    // L o e s c h e n
    // -------------------------------------------------------------------------
    {
        _id: new ObjectID('000000000000000000000005'),
        name: 'Harry Potter Teil 5',
        produzent: 'Lucas Arts',
        isan: '000000000000000000000005',
        preis: 43.66,
        bewertung: 2,
        __v: 0,
    },
    // -------------------------------------------------------------------------
    // z u r   f r e i e n   V e r f u e g u n g
    // -------------------------------------------------------------------------
    {
        _id: new ObjectID('000000000000000000000006'),
        name: 'Harry Potter Teil 6',
        produzent: 'Lucas Arts',
        isan: '000000000000000000000006',
        preis: 10.99,
        bewertung: 4,
        __v: 0,
    },
];
/* eslint-enable @typescript-eslint/naming-convention */
