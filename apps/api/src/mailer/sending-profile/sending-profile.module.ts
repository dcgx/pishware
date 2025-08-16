import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendingProfileEntity } from './entities/sending-profile.entity';
import { SendingProfileService } from './sending-profile.service';
import { SendingProfileController } from './sending-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SendingProfileEntity])],
  controllers: [SendingProfileController],
  providers: [SendingProfileService],
})
export class SendingProfileModule {}
