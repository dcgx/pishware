import { Injectable } from '@nestjs/common';
import { TrackingService } from '../tracking/tracking.service';

const PDFDocument = require('pdfkit');

@Injectable()
export class ReportService {
  constructor(private readonly trackingService: TrackingService) {}

  async getReport(type: string) {
    const metrics = await this.trackingService.getMetrics();
    switch (type) {
      case 'overview':
        return metrics;
      case 'emails-opened': {
        const openRate = metrics.emailsSent
          ? metrics.emailsOpened / metrics.emailsSent
          : 0;
        return {
          emailsSent: metrics.emailsSent,
          emailsOpened: metrics.emailsOpened,
          openRate,
        };
      }
      case 'link-clicks':
        return {
          linksClicked: metrics.linksClicked,
          details: metrics.details.filter(
            (d) => d.event_type === 'link_clicked',
          ),
        };
      case 'credential-submission':
        return {
          dataSent: metrics.dataSent,
          details: metrics.details.filter((d) => d.event_type === 'data_sent'),
        };
      case 'risk-department':
        // TODO: implement department risk aggregation
        return { message: 'Risk by department report not implemented yet' };
      case 'geolocation':
        // TODO: implement geolocation aggregation
        return { message: 'Geolocation report not implemented yet' };
      default:
        throw new Error('Unknown report type');
    }
  }

  async getReportPdf(type: string): Promise<NodeJS.ReadableStream> {
    const data = await this.getReport(type);
    const doc = new PDFDocument();
    doc.text(`Report: ${type}`);
    doc.moveDown();
    doc.text(JSON.stringify(data, null, 2));
    doc.end();
    return doc;
  }
}
