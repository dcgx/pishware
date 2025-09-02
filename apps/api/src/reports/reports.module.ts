import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TrackingModule } from 'src/tracking/tracking.module';
import { Tracking } from 'src/tracking/entities/tracking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tracking]), TrackingModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
