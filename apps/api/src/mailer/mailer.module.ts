import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TemplateModule } from 'src/template/template.module.ts';
import { SmtpProfileModule } from './smtp-profile/smtp-profile.module';
import { TrackingModule } from 'src/tracking/tracking.module';

@Module({
  imports: [
    SmtpProfileModule,
    TemplateModule,
    TrackingModule,
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
