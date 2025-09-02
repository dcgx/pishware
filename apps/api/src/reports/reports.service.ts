import { Injectable } from '@nestjs/common';
import { TrackingService } from 'src/tracking/tracking.service';

const PLACEHOLDER_PDF_BASE64 =
  'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSPC9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+PiA+PiA+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNDU+PnN0cmVhbQpCVCAvRjEgMTIgVGYgMTAwIDcwMCBUZCAoSGVsbG8gV29ybGQpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNTMgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjIxIDAwMDAwIG4gCjAwMDAwMDAyNzEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxMzQ3CiUlRU9G';

@Injectable()
export class ReportsService {
  constructor(private readonly trackingService: TrackingService) {}

  async getPdf(slug: string): Promise<Buffer> {
    if (slug === 'overview') {
      const metrics = await this.trackingService.getMetrics();
      return this.buildOverviewPdf(metrics);
    }
    return Buffer.from(PLACEHOLDER_PDF_BASE64, 'base64');
  }

  private buildOverviewPdf(metrics: any): Buffer {
    const lines: string[] = [
      'Resumen general',
      '',
      `Indice de riesgo: ${metrics.riskIndex}`,
      `Correos enviados: ${metrics.emailsSent}`,
      `Correos abiertos: ${metrics.emailsOpened}`,
      `Enlaces clickeados: ${metrics.linksClicked}`,
      `Datos enviados: ${metrics.dataSent}`,
      '',
      'Nombre       Apellido     Email                        Evento           Fecha',
    ];

    const pad = (str: string, len: number) =>
      (str ?? '').length > len
        ? (str ?? '').slice(0, len - 1) + '…'
        : (str ?? '').padEnd(len);

    for (const d of metrics.details) {
      const row =
        pad(d.firstName, 12) +
        pad(d.lastName, 12) +
        pad(d.email, 28) +
        pad(d.event_type, 15) +
        new Date(d.submittedAt).toISOString().slice(0, 10);
      lines.push(row);
    }

    return this.simplePdf(lines);
  }

  private simplePdf(lines: string[]): Buffer {
    const escape = (text: string) =>
      text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

    let content = 'BT\n/F1 12 Tf\n50 780 Td\n';
    lines.forEach((line, i) => {
      content += `(${escape(line)}) Tj\n`;
      if (i !== lines.length - 1) content += '0 -14 Td\n';
    });
    content += 'ET';

    const contentLength = Buffer.byteLength(content, 'utf8');
    let pdf = '%PDF-1.3\n';
    const offsets: number[] = [];
    const addObject = (obj: string) => {
      offsets.push(Buffer.byteLength(pdf, 'utf8'));
      pdf += obj + '\n';
    };

    addObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
    addObject('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
    addObject(
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    );
    addObject(
      `4 0 obj\n<< /Length ${contentLength} >>\nstream\n${content}\nendstream\nendobj`,
    );
    addObject('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj');

    const startXref = Buffer.byteLength(pdf, 'utf8');
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    offsets.forEach((o) => {
      pdf += o.toString().padStart(10, '0') + ' 00000 n \n';
    });
    pdf +=
      'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' +
      startXref +
      '\n%%EOF';

    return Buffer.from(pdf, 'utf8');
  }
}

