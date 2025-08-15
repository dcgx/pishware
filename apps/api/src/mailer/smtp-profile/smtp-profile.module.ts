import { Module } from '@nestjs/common';
import { SmtpProfileService } from './smtp-profile.service';
import { SmtpProfileController } from './smtp-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmtpProfileEntity } from './entities/smtp-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmtpProfileEntity])
  ],
  controllers: [SmtpProfileController],
  providers: [SmtpProfileService],
})
export class SmtpProfileModule {}
