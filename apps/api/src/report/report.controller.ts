import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(':type')
  getReport(@Param('type') type: string) {
    return this.reportService.getReport(type);
  }

  @Get(':type/pdf')
  async getReportPdf(@Param('type') type: string, @Res() res: Response) {
    const pdf = await this.reportService.getReportPdf(type);
    res.setHeader('Content-Type', 'application/pdf');
    pdf.pipe(res);
  }
}
