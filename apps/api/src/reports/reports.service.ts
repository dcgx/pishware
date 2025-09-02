import { Injectable } from '@nestjs/common';
import { TrackingService } from 'src/tracking/tracking.service';

const PDFDocument = require('pdfkit');
const QuickChart: any = require('quickchart-js');

@Injectable()
export class ReportsService {
  constructor(private readonly trackingService: TrackingService) {}

  async getPdf(slug: string): Promise<Buffer> {
    if (slug === 'emails-opened') {
      const { emailsSent: sent, emailsOpened: opened } =
        await this.trackingService.getMetrics();

      const chart = new QuickChart();
      chart.setWidth(500).setHeight(300);
      chart.setConfig({
        type: 'bar',
        data: {
          labels: ['Enviados', 'Abiertos'],
          datasets: [
            {
              label: 'Correos',
              data: [sent, opened],
              backgroundColor: ['#3498db', '#2ecc71'],
            },
          ],
        },
      });

      const image: Buffer = await chart.toBinary();

      const doc = new PDFDocument();
      const buffers: Buffer[] = [];
      doc.on('data', (data) => buffers.push(data));
      const finished = new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
      });

      doc.fontSize(20).text('Correos enviados vs abiertos', {
        align: 'center',
      });
      doc.moveDown();
      doc.image(image, {
        fit: [500, 300],
        align: 'center',
        valign: 'center',
      });
      doc.end();

      return finished;
    }

    return Buffer.from('...', 'base64');
  }
}
