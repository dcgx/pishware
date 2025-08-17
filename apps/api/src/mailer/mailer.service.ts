import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TemplateService } from 'src/template/template.service';
import { TrackingService } from 'src/tracking/tracking.service';

@Injectable()
export class MailerService {
    private transporter;

    constructor(
        private readonly templateService: TemplateService,
        private readonly trackingService: TrackingService,
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

        await this.trackingService.logEvent('email_sent', { to: 'diegocastillo.dev@gmail.com', subject: template?.subject }, { messageId: info.messageId });
        for (const recipient of info.accepted) {
            await this.trackingService.logEvent('email_delivered', { to: recipient }, { messageId: info.messageId });
        }

        return { messageId: info.messageId, accepted: info.accepted };
    }
}
