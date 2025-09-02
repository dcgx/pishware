import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get(':slug/pdf')
  async getReport(@Param('slug') slug: string, @Res() res: Response) {
    const pdf = await this.reportsService.getPdf(slug);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${slug}.pdf"`,
    });
    res.send(pdf);
  }
}
