import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from 'src/tracking/entities/tracking.entity';

const PLACEHOLDER_PDF_BASE64 =
  'JVBERi0xLjMKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMQogNSAwIFI+PiA+PiA+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggNDU+PnN0cmVhbQpCVCAvRjEgMTIgVGYgMTAwIDcwMCBUZCAoSGVsbG8gV29ybGQpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNTMgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjIxIDAwMDAwIG4gCjAwMDAwMDAyNzEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoxMzQ3CiUlRU9G';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
  ) {}

  async getPdf(slug: string): Promise<Buffer> {
    if (slug === 'credential-submission') {
      return this.generateCredentialSubmissionReport();
    }
    return Buffer.from(PLACEHOLDER_PDF_BASE64, 'base64');
  }

  private async generateCredentialSubmissionReport(): Promise<Buffer> {
    const events = await this.trackingRepository.find({
      where: { event_type: 'landing_submitted' },
      relations: ['user'],
      order: { submitted_at: 'DESC' },
    });

    const pad = (text: string, length: number) =>
      (text ?? '').padEnd(length).slice(0, length);

    const lines = [
      'Captura de credenciales',
      '',
      `${pad('Nombre', 15)} ${pad('Apellido', 15)} ${pad('Email', 30)} ${pad('Fecha', 20)}`,
      ...events.map((e) => {
        const first = pad(e.user?.first_name ?? '', 15);
        const last = pad(e.user?.last_name ?? '', 15);
        const email = pad(e.user?.email ?? '', 30);
        const date = pad(e.submitted_at.toISOString().split('T')[0], 20);
        return `${first} ${last} ${email} ${date}`;
      }),
    ];

    return this.buildPdf(lines);
  }

  private buildPdf(lines: string[]): Buffer {
    const escape = (s: string) =>
      s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

    const textLines = lines.map((line, idx) =>
      idx === 0 ? `(${escape(line)}) Tj` : `T* (${escape(line)}) Tj`,
    );

    const contentStream = [
      'BT',
      '/F1 12 Tf',
      '14 TL',
      '50 750 Td',
      ...textLines,
      'ET',
    ].join('\n');

    const contentLength = Buffer.byteLength(contentStream, 'utf8');

    const objects = [
      '',
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      `<< /Length ${contentLength} >>\nstream\n${contentStream}\nendstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
    ];

    let pdf = '%PDF-1.3\n';
    const offsets: number[] = [0];
    for (let i = 1; i <= 5; i++) {
      offsets[i] = pdf.length;
      pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
    }

    const xrefOffset = pdf.length;
    pdf += 'xref\n0 6\n';
    pdf += '0000000000 65535 f \n';
    for (let i = 1; i <= 5; i++) {
      pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    }
    pdf += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n';
    pdf += `${xrefOffset}\n%%EOF`;
    return Buffer.from(pdf);
  }
}

