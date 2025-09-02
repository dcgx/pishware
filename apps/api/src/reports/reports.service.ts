import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import QuickChart from 'quickchart-js';
import { TrackingService } from 'src/tracking/tracking.service';

const PLACEHOLDER_PDF_BASE64 =
  'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1IDAgUj4+ID4+ID4+CmVuZG9iagp0IDAgb2JqCjw8L0xlbmd0aCA0NT4+c3RyZWFtCkJUIEF1RjEgMTIgVGYgMTAwIDcwMCBUZCAoSGVsbG8gV29ybGQpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNTMgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjIxIDAwMDAwIG4gCjAwMDAwMDAyNzEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxMzQ3CiUlRU9G';

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

      const image = await chart.toBuffer();

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

    return Buffer.from(PLACEHOLDER_PDF_BASE64, 'base64');
  }
}

