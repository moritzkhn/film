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
    type Buch,
    MAX_RATING,
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

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const geaendertesBuch: Omit<Buch, 'isbn'> = {
    // isbn wird nicht geaendet
    titel: 'Geaendert',
    rating: 1,
    art: 'DRUCKAUSGABE',
    verlag: 'BAR_VERLAG',
    preis: 44.4,
    rabatt: 0.044,
    lieferbar: true,
    datum: '2022-02-03',
    homepage: 'https://test.te',
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
};
const idVorhanden = '000000000000000000000040';

const geaendertesBuchIdNichtVorhanden: Omit<Buch, 'homepage' | 'isbn'> = {
    titel: 'Nichtvorhanden',
    rating: 1,
    art: 'DRUCKAUSGABE',
    verlag: 'BAR_VERLAG',
    preis: 44.4,
    rabatt: 0.044,
    lieferbar: true,
    datum: '2022-02-04',
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
};
const idNichtVorhanden = '999999999999999999999999';

const geaendertesBuchInvalid: Record<string, unknown> = {
    titel: '?!$',
    rating: -1,
    art: 'UNSICHTBAR',
    verlag: 'NO_VERLAG',
    preis: 0.01,
    rabatt: 2,
    lieferbar: true,
    datum: '12345-123-123',
    isbn: 'falsche-ISBN',
    schlagwoerter: [],
};

// isbn wird nicht geaendet
const veraltesBuch: Omit<Buch, 'isbn'> = {
    titel: 'Veraltet',
    rating: 1,
    art: 'DRUCKAUSGABE',
    verlag: 'BAR_VERLAG',
    preis: 44.4,
    rabatt: 0.044,
    lieferbar: true,
    datum: '2022-02-03',
    homepage: 'https://test.te',
    schlagwoerter: ['JAVASCRIPT', 'TYPESCRIPT'],
};

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
// eslint-disable-next-line max-lines-per-function
describe('PUT /api/:id', () => {
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
            headers,
            httpsAgent,
            validateStatus: (status) => status < 500, // eslint-disable-line @typescript-eslint/no-magic-numbers
        });
    });

    afterAll(async () => {
        await shutdownTestserver();
    });

    test('Vorhandenes Buch aendern', async () => {
        // given
        const url = `${apiPath}/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"0"';

        // when
        const response: AxiosResponse<string> = await client.put(
            url,
            geaendertesBuch,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.NO_CONTENT);
        expect(data).toBe('');
    });

    test('Nicht-vorhandenes Buch aendern', async () => {
        // given
        const url = `${apiPath}/${idNichtVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"0"';

        // when
        const response: AxiosResponse<string> = await client.put(
            url,
            geaendertesBuchIdNichtVorhanden,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.PRECONDITION_FAILED);
        expect(data).toBe(
            `Es gibt kein Buch mit der ID "${idNichtVorhanden}".`,
        );
    });

    test('Vorhandenes Buch aendern, aber mit ungueltigen Daten', async () => {
        // given
        const url = `${apiPath}/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"0"';

        // when
        const response: AxiosResponse<string> = await client.put(
            url,
            geaendertesBuchInvalid,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(data).toEqual(
            expect.arrayContaining([
                'Ein Buchtitel muss mit einem Buchstaben, einer Ziffer oder _ beginnen.',
                `Eine Bewertung muss zwischen 0 und ${MAX_RATING} liegen.`,
                'Die Art eines Buches muss KINDLE oder DRUCKAUSGABE sein.',
                'Der Verlag eines Buches muss FOO_VERLAG oder BAR_VERLAG sein.',
                'Der Rabatt muss ein Wert zwischen 0 und 1 sein.',
                'Das Datum muss im Format yyyy-MM-dd sein.',
                'Die ISBN-Nummer ist nicht korrekt.',
            ]),
        );
    });

    test('Vorhandenes Buch aendern, aber ohne Versionsnummer', async () => {
        // given
        const url = `${apiPath}/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        delete headers['If-Match'];

        // when
        const response: AxiosResponse<string> = await client.put(
            url,
            geaendertesBuch,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.PRECONDITION_REQUIRED);
        expect(data).toBe('Header "If-Match" fehlt');
    });

    test('Vorhandenes Buch aendern, aber mit alter Versionsnummer', async () => {
        // given
        const url = `${apiPath}/${idVorhanden}`;
        const token = await loginRest(client);
        headers.Authorization = `Bearer ${token}`;
        headers['If-Match'] = '"-1"';

        // when
        const response: AxiosResponse<string> = await client.put(
            url,
            veraltesBuch,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.PRECONDITION_FAILED);
        expect(data).toEqual(expect.stringContaining('Die Versionsnummer'));
    });

    test('Vorhandenes Buch aendern, aber ohne Token', async () => {
        // given
        const url = `${apiPath}/${idVorhanden}`;
        delete headers.Authorization;
        headers['If-Match'] = '"0"';

        // when
        const response: AxiosResponse<Record<string, any>> = await client.put(
            url,
            geaendertesBuch,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.FORBIDDEN);
        expect(data.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    test('Vorhandenes Buch aendern, aber mit falschem Token', async () => {
        // given
        const url = `${apiPath}/${idVorhanden}`;
        const token = 'FALSCH';
        headers.Authorization = `Bearer ${token}`;

        // when
        const response: AxiosResponse<Record<string, any>> = await client.put(
            url,
            geaendertesBuch,
            { headers },
        );

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.FORBIDDEN);
        expect(data.statusCode).toBe(HttpStatus.FORBIDDEN);
    });
});
