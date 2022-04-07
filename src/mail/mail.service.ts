/**
 * Das Modul besteht aus der Klasse {@linkcode MailService} für das
 * Verschicken von Emails.
 * @packageDocumentation
 */

import { cloud, mailConfig } from '../config/index.js';
import { Injectable } from '@nestjs/common';
import { type SendMailOptions } from 'nodemailer';
import { getLogger } from '../logger/index.js';

@Injectable()
export class MailService {
    readonly #logger = getLogger(MailService.name);

    async sendmail(subject: string, body: string) {
        if (cloud !== undefined || mailConfig.host === 'skip') {
            // In der Cloud kann man z.B. "@sendgrid/mail" statt
            // "nodemailer" mit lokalem Mailserver verwenden
            return;
        }

        const from = '"Joe Doe" <Joe.Doe@acme.com>';
        const to = '"Foo Bar" <Foo.Bar@acme.com>';

        const data: SendMailOptions = { from, to, subject, html: body };
        this.#logger.debug('#sendMail: data=%o', data);

        try {
            const nodemailer = await import('nodemailer');
            await nodemailer.createTransport(mailConfig).sendMail(data);
        } catch (err) {
            this.#logger.warn('#sendmail: Fehler %o', err);
        }
    }
}
