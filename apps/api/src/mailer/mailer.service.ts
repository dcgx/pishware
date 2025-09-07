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
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'diegocastillo.dev@gmail.com',
        pass: 'bgjq gosn asra knhx'
      },
    });
  }

  async sendEmail(dto: SendEmailDto) {
    const info = (await this.transporter.sendMail({
      from: `Pishware <${process.env.SMTP_USER}>`,
      to: dto.to,
      subject: dto.subject,
      html: dto.html,
    })) as { messageId: string; accepted: string[] };

    // Guardar log de correo enviado
    await this.trackingEmailService.logEmail({
      landingId: dto.landing_id ?? null,
      userId: dto.user_id,
      profileId: dto.profile_id,
      email: dto.to,
      subject: dto.subject,
      messageId: info.messageId,
    });

    return { messageId: info.messageId, accepted: info.accepted };
  }


  async sendUserCredentialsEmail(to: string, password: string) {
    try {
      const html = `<p>Su usuario ha sido creado correctamente.</p><p>Contraseña temporal: <b>${password}</b></p>`;

      const info = await this.transporter.sendMail({
        from: `Pishware <${process.env.SMTP_USER}>`,
        to,
        subject: 'Credenciales de acceso',
        html,
      });

      return { messageId: info.messageId, accepted: info.accepted };
    } catch (error) {
      console.error('Error sending user credentials email:', error);
      throw error;
    }
  }

  async sendTestEmail() {
    const template = await this.templateService.findOne(23);
    return this.sendEmail({
      to: 'diegocastillo.dev@gmail.com',
      subject: template?.subject ?? '',
      html: template?.body_content ?? '',
      user_id: '0',
      profile_id: '0',
      landing_id: null,
    });
  }
}
