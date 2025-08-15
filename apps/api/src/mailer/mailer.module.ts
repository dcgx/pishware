import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TemplateModule } from 'src/template/template.module.ts';

@Module({
  imports: [
    TemplateModule
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
