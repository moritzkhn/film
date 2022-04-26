/* eslint-disable no-underscore-dangle, @typescript-eslint/no-non-null-assertion */
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
    type FilmeDTO,
    apiPath,
    createTestserver,
    host,
    httpsAgent,
    port,
    shutdownTestserver,
} from '../index.js';
import { afterAll, beforeAll, describe, test } from '@jest/globals';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { HttpStatus } from '@nestjs/common';
import each from 'jest-each';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const nameVorhanden = ['a', 'p', 's'];
const nameNichtVorhanden = ['xx', 'yy'];
const produzentVorhanden = ['Lucas Arts', 'Warner Brothers'];
const produzentNichtVorhanden = ['Disney', 'UniversalStudios'];

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
// eslint-disable-next-line max-lines-per-function
describe('GET /api', () => {
    let client: AxiosInstance;

    beforeAll(async () => {
        await createTestserver();
        const baseURL = `https://${host}:${port}/`;
        client = axios.create({
            baseURL,
            httpsAgent,
            validateStatus: () => true,
        });
    });

    afterAll(async () => {
        await shutdownTestserver();
    });

    test('Alle Filme', async () => {
        // given

        // when
        const response: AxiosResponse<FilmeDTO> = await client.get(apiPath);

        // then
        const { status, headers, data } = response;

        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data).toBeDefined();

        const { filme } = data._embedded;

        filme
            .map((film) => film._links.self.href)
            .forEach((selfLink) => {
                expect(selfLink).toEqual(
                    expect.stringContaining(`/${apiPath}`),
                );
            });
    });

    each(nameVorhanden).test(
        'Filme mit einem Namen, der "%s" enthaelt',
        async (teilName: string) => {
            // given
            const params = { name: teilName };

            // when
            const response: AxiosResponse<FilmeDTO> = await client.get(
                apiPath,
                { params },
            );

            // then
            const { status, headers, data } = response;

            expect(status).toBe(HttpStatus.OK);
            expect(headers['content-type']).toMatch(/json/iu);
            expect(data).toBeDefined();

            const { filme } = data._embedded;

            // Jeder Film hat einen Namen mit dem Teilstring 'a'
            filme
                .map((film) => film.name!)
                .forEach((name: string) =>
                    expect(name.toLowerCase()).toEqual(
                        expect.stringContaining(teilName),
                    ),
                );
        },
    );

    each(nameNichtVorhanden).test(
        'Keine Filme mit einem Namen, der "%s" enthaelt',
        async (teilName: string) => {
            // given
            const params = { name: teilName };

            // when
            const response: AxiosResponse<string> = await client.get(apiPath, {
                params,
            });

            // then
            const { status, data } = response;

            expect(status).toBe(HttpStatus.NOT_FOUND);
            expect(data).toMatch(/^not found$/iu);
        },
    );

    each(produzentVorhanden).test(
        'Filme mit einem Produzenten, der "%s" enthaelt',
        async (teilProduzent: string) => {
            // given
            const params = { produzent: teilProduzent };

            // when
            const response: AxiosResponse<FilmeDTO> = await client.get(
                apiPath,
                { params },
            );

            // then
            const { status, headers, data } = response;

            expect(status).toBe(HttpStatus.OK);
            expect(headers['content-type']).toMatch(/json/iu);
            expect(data).toBeDefined();

            const { filme } = data._embedded;

            // Jeder Film hat einen Produzenten mit dem Teilstring 'a'
            filme
                .map((film) => film.produzent!)
                .forEach((produzent: string) =>
                    expect(produzent.toLowerCase()).toEqual(
                        expect.stringContaining(teilProduzent),
                    ),
                );
        },
    );

    each(produzentNichtVorhanden).test(
        'Keine Filme mit einem Produzenten, der "%s" enthaelt',
        async (teilProduzent: string) => {
            // given
            const params = { produzent: teilProduzent };

            // when
            const response: AxiosResponse<string> = await client.get(apiPath, {
                params,
            });

            // then
            const { status, data } = response;

            expect(status).toBe(HttpStatus.NOT_FOUND);
            expect(data).toMatch(/^not found$/iu);
        },
    );

    test('Keine Filme zu einer nicht-vorhandenen Property', async () => {
        // given
        const params = { foo: 'bar' };

        // when
        const response: AxiosResponse<string> = await client.get(apiPath, {
            params,
        });

        // then
        const { status, data } = response;

        expect(status).toBe(HttpStatus.NOT_FOUND);
        expect(data).toMatch(/^not found$/iu);
    });
});
/* eslint-enable no-underscore-dangle, @typescript-eslint/no-non-null-assertion */
