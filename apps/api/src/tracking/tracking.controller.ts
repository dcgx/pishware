import { Controller, Get } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  findAll() {
    return this.trackingService.findAll();
  }

  @Get('metrics')
  getMetrics() {
    return this.trackingService.getMetrics();
  }
}
