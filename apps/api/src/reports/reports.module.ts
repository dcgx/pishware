import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TrackingModule } from 'src/tracking/tracking.module';

@Module({
  imports: [TrackingModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
