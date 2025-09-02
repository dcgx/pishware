import { Injectable } from '@nestjs/common';
import { TrackingService } from 'src/tracking/tracking.service';

const PLACEHOLDER_PDF_BASE64 =
  'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMQogNSAwIFI+PiA+PiA+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNDU+PnN0cmVhbQpCVCAvRjEgMTIgVGYgMTAwIDcwMCBUZCAoSGVsbG8gV29ybGQpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNTMgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjIxIDAwMDAwIG4gCjAwMDAwMDAyNzEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxMzQ3CiUlRU9G';

@Injectable()
export class ReportsService {
  constructor(private readonly trackingService: TrackingService) {}

  async getPdf(slug: string): Promise<Buffer> {
    if (slug === 'link-clicks') {
      return this.generateLinkClicksPdf();
    }
    return Buffer.from(PLACEHOLDER_PDF_BASE64, 'base64');
  }

  private async generateLinkClicksPdf(): Promise<Buffer> {
    const metrics = await this.trackingService.getMetrics();
    const details = metrics.details.filter(
      (d) => d.event_type === 'link_clicked',
    );

    const rows = details.map((d) => [
      d.email,
      new Date(d.submittedAt).toLocaleString('es-ES'),
    ]);

    return this.createTablePdf(
      'Reporte de clics en enlaces',
      ['Email', 'Fecha'],
      rows,
      `Total de clics: ${metrics.linksClicked}`,
    );
  }

  private createTablePdf(
    title: string,
    headers: string[],
    rows: string[][],
    summary?: string,
  ): Buffer {
    const escapePdf = (text: string) =>
      text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

    let textStream = `BT\n/F1 12 Tf\n50 780 Td\n(${escapePdf(title)}) Tj\n0 -20 Td\n`;
    if (summary) {
      textStream += `(${escapePdf(summary)}) Tj\n0 -20 Td\n`;
    }

    // headers
    textStream += `(${escapePdf(headers[0])}) Tj\n200 0 Td\n(${escapePdf(
      headers[1],
    )}) Tj\n-200 -20 Td\n`;

    // rows
    for (const row of rows) {
      textStream += `(${escapePdf(row[0])}) Tj\n200 0 Td\n(${escapePdf(
        row[1],
      )}) Tj\n-200 -15 Td\n`;
    }
    textStream += 'ET';

    const objects = [
      '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n',
      '2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n',
      '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n',
      `4 0 obj<</Length ${textStream.length}>>\nstream\n${textStream}\nendstream\nendobj\n`,
      '5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n',
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    for (const obj of objects) {
      offsets.push(pdf.length);
      pdf += obj;
    }

    const xrefOffset = pdf.length;
    pdf += 'xref\n0 6\n';
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i <= 5; i++) {
      const off = offsets[i];
      pdf += off.toString().padStart(10, '0') + ' 00000 n \n';
    }
    pdf += 'trailer<</Size 6/Root 1 0 R>>\nstartxref\n';
    pdf += xrefOffset + '\n%%EOF';
    return Buffer.from(pdf);
  }
}
