import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TemplateModule } from 'src/template/template.module.ts';
import { SendingProfileModule } from './sending-profile/sending-profile.module';
import { TrackingModule } from 'src/tracking/tracking.module';

@Module({
  imports: [
    SendingProfileModule,
    TemplateModule,
    TrackingModule
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
