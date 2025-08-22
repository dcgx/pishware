import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { TemplateService } from 'src/template/template.service';
import { TrackingService } from 'src/tracking/tracking.service';
import { TrackingEmailService } from 'src/tracking/tracking-email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly templateService: TemplateService,
    private readonly trackingService: TrackingService,
    private readonly trackingEmailService: TrackingEmailService,
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

  async sendEmail(dto: SendEmailDto) {
    const info = (await this.transporter.sendMail({
      from: `Pishware <test>`,
      to: dto.to,
      subject: dto.subject,
      html: dto.html,
    })) as { messageId: string; accepted: string[] };

    await this.trackingEmailService.logEmail({
      landingId: dto.landing_id ?? null,
      userId: dto.user_id,
      profileId: dto.profile_id,
      email: dto.to,
      subject: dto.subject,
      messageId: info.messageId,
    });

    await this.trackingService.logEvent(
      'email_sent',
      { to: dto.to, subject: dto.subject },
      { messageId: info.messageId },
      dto.user_id,
    );
    for (const recipient of info.accepted) {
      await this.trackingService.logEvent(
        'email_delivered',
        { to: recipient },
        { messageId: info.messageId },
        dto.user_id,
      );
    }
    return { messageId: info.messageId, accepted: info.accepted };
  }


  async sendUserCredentialsEmail(to: string, password: string) {
    const html = `<p>Su usuario ha sido creado correctamente.</p><p>Contraseña temporal: <b>${password}</b></p>`;

    const info = await this.transporter.sendMail({
      from: `Pishware <${process.env.SMTP_USER}>`,
      to,
      subject: 'Credenciales de acceso',
      html,
    });

    await this.trackingService.logEvent(
      'email_sent',
      { to, subject: 'Credenciales de acceso' },
      { messageId: info.messageId },
    );
    for (const recipient of info.accepted) {
      await this.trackingService.logEvent(
        'email_delivered',
        { to: recipient },
        { messageId: info.messageId },
      );
    }

    return { messageId: info.messageId, accepted: info.accepted };
  }

  async sendTestEmail() {
    const template = await this.templateService.findOne(23);
    return this.sendEmail({
      to: 'diegocastillo.dev@gmail.com',
      subject: template?.subject ?? '',
      html: template?.body_content ?? '',
      user_id: 0,
      profile_id: 0,
      landing_id: null,
    });
  }
}
