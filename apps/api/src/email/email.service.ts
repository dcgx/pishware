import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmailService {
    private transporter;

    constructor(

    ) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 25,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendTestEmail() {
        // const profile = await this.smtpRepo.findOne({ where: { id: profileId } });
        // if (!profile) throw new NotFoundException('SMTP profile not found');

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 25,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        const info = await this.transporter.sendMail({
            from: `Pishware <test>`,
            to: 'diegocastillo.dev@gmail.com',
            subject: 'Test Email from Pishware',
            html: '<h1>This is a test email</h1><p>If you received this, the SMTP settings are correct!</p>',
        });

        return { messageId: info.messageId, accepted: info.accepted };
    }
}
