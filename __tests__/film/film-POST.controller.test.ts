/*
 * Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
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

import {
    type Film,
    MAX_BEWERTUNG,
    apiPath,
    createTestserver,
    host,
    httpsAgent,
    loginRest,
    port,
    shutdownTestserver,
} from '../index.js';
import { afterAll, beforeAll, describe, test } from '@jest/globals';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';
import RE2 from 're2';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const neuerFilm: Film = {
    name: 'Neu',
    produzent: 'ProduzentNeu',
    preis: 25.6,
    bewertung: 4,
    isan: '9780007006441',
};
const neuerFilmInvalid: Record<string, unknown> = {
    name: '!?$',
    produzent: '!?$',
    preis: -25.6,
    bewertung: -1,
    isan: 'falsche-ISAN',
};
const neuerFilmNameExistiert: Film = {
    name: 'Harry Potter Teil 1',
    produzent: 'Netflix',
    preis: 25.6,
    bewertung: 1,
    isan: '9780007006441',
};

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
// eslint-disable-next-line max-lines-per-function
describe('POST /api', () => {
    let client: AxiosInstance;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json', // eslint-disable-line @typescript-eslint/naming-convention
    };

    // Testserver starten und dabei mit der DB verbinden
    beforeAll(async () => {
        await createTestserver();
        const baseURL = `https://${host}:${port}/`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    // (done?: DoneFn) => Promise<void | undefined | unknown> | void | undefined
    // close(callback?: (err?: Error) => void): this
    afterAll(async () => {
        await shutdownTestserver();
    });

    test('Neuer Film', async () => {
        // given
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        const objectIdRegexp = new RE2('[\\dA-Fa-f]{24}', 'u');

        // when
        const response: AxiosResponse<string> = await client.post(
            apiPath,
            neuerFilm,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.CREATED);

        const { location } = response.headers as { location: string };

        expect(location).toBeDefined();

        // ObjectID: Muster von HEX-Ziffern
        const indexLastSlash: number = location.lastIndexOf('/');
        const idStr = location.slice(indexLastSlash + 1);

        expect(idStr).toBeDefined();
        expect(objectIdRegexp.test(idStr)).toBe(true);

        expect(data).toBe('');
    });

    test('Neuer Film mit ungueltigen Daten', async () => {
        // given
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;

        // when
        const response: AxiosResponse<string> = await client.post(
            apiPath,
            neuerFilmInvalid,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(data).toEqual(
            expect.arrayContaining([
                'Ein Filmname muss mit einem Buchstaben, einer Ziffer oder _ beginnen.',
                `Eine Bewertung muss zwischen 0 und ${MAX_BEWERTUNG} liegen.`,
                'Die ISAN-Nummer ist nicht korrekt.',
            ]),
        );
    });

    test('Neuer Film, aber der Name existiert bereits', async () => {
        // given
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;

        // when
        const response: AxiosResponse<string> = await client.post(
            apiPath,
            neuerFilmNameExistiert,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(data).toEqual(expect.stringContaining('Titel'));
    });

    test('Neuer Film, aber ohne Token', async () => {
        // when
        const response: AxiosResponse<Record<string, any>> = await client.post(
            apiPath,
            neuerFilm,
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.FORBIDDEN);
        expect(data.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    test('Neuer Film, aber mit falschem Token', async () => {
        // given
        const token = 'FALSCH';
        headers.Authorization = `Bearer ${token}`;

        // when
        const response: AxiosResponse<Record<string, any>> = await client.post(
            apiPath,
            neuerFilm,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.FORBIDDEN);
        expect(data.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    test.todo('Test mit abgelaufenem Token');
});
