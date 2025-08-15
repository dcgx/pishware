import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TemplateModule } from 'src/template/template.module.ts';
import { SmtpProfileModule } from './smtp-profile/smtp-profile.module';

@Module({
  imports: [
    SmtpProfileModule,
    TemplateModule
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
