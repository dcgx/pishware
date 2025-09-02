import { Controller, Get, Res } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { Response } from 'express';

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

  @Get('report')
  getReport() {
    return this.trackingService.getReport();
  }

  @Get('report/pdf')
  async getReportPdf(@Res() res: Response) {
    const buffer = await this.trackingService.generateReportPdf();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="report.pdf"',
    });
    res.send(buffer);
  }
}
