import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateService } from 'src/template/template.service';

@Injectable()
export class MailerService {
    private transporter;

    constructor(
        private readonly templateService: TemplateService,

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
        // const profile = await this.sendingRepo.findOne({ where: { id: profileId } });
        // if (!profile) throw new NotFoundException('Sending profile not found');
        const template = await this.templateService.findOne(23);
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
            subject: template?.subject,
            html: template?.body_content
        });

        return { messageId: info.messageId, accepted: info.accepted };
    }
}
