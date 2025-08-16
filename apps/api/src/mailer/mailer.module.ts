import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TemplateModule } from 'src/template/template.module.ts';
import { SendingProfileModule } from './sending-profile/sending-profile.module';

@Module({
  imports: [
    SendingProfileModule,
    TemplateModule
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
