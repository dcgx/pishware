import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracking } from './entities/tracking.entity';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { TrackingEmail } from './entities/tracking-email.entity';
import { TrackingEmailService } from './tracking-email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tracking, TrackingEmail])],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingEmailService],
  exports: [TrackingService, TrackingEmailService],
})
export class TrackingModule {}
