import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import { User } from 'src/iam/user-management/entities/user.entity';
import PDFDocument from 'pdfkit';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async logEvent(
    eventType: string,
    payload: any,
    metadata: Record<string, any>,
    userId?: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.log('Logging event:', { eventType, payload, metadata, userId });

    const tracking = this.trackingRepository.create({
      event_type: eventType,
      payload: JSON.stringify(payload ?? {}),
      metadata,
      submitted_at: new Date(),
      user: {
        id: userId,
      },
    });
    return this.trackingRepository.save(tracking);
  }

  async findAll() {
    return this.trackingRepository.find();
  }

  async getMetrics() {
    return this.getReport();
  }

  async getReport() {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
    const events = await this.trackingRepository.find({ relations: ['user'] });

    const counts = {
      email_sent: 0,
      email_opened: 0,
      link_clicked: 0,
      data_sent: 0,
    };

    const campaigns: Record<string, { sent: number; opened: number }> = {};
    const departments: Record<
      string,
      {
        email_sent: number;
        email_opened: number;
        link_clicked: number;
        data_sent: number;
      }
    > = {};
    const geolocation: Record<string, number> = {};

    const details = events.map((e) => {
      if (e.event_type === 'email_sent') counts.email_sent++;
      if (e.event_type === 'email_opened') counts.email_opened++;
      if (e.event_type === 'link_clicked') counts.link_clicked++;
      if (e.event_type === 'data_sent') counts.data_sent++;

      const meta = e.metadata || {};
      const campaign = meta.campaign || meta.campaignId;
      const dept = meta.department;
      const location = meta.location?.country || meta.location;

      if (campaign) {
        if (!campaigns[campaign]) campaigns[campaign] = { sent: 0, opened: 0 };
        if (e.event_type === 'email_sent') campaigns[campaign].sent++;
        if (e.event_type === 'email_opened') campaigns[campaign].opened++;
      }

      if (dept) {
        if (!departments[dept]) {
          departments[dept] = {
            email_sent: 0,
            email_opened: 0,
            link_clicked: 0,
            data_sent: 0,
          };
        }
        if (e.event_type === 'email_sent') departments[dept].email_sent++;
        if (e.event_type === 'email_opened') departments[dept].email_opened++;
        if (e.event_type === 'link_clicked') departments[dept].link_clicked++;
        if (e.event_type === 'data_sent') departments[dept].data_sent++;
      }

      if (location && e.event_type === 'link_clicked') {
        geolocation[location] = (geolocation[location] || 0) + 1;
      }

      return {
        firstName: e.user?.first_name ?? '',
        lastName: e.user?.last_name ?? '',
        email: e.user?.email ?? '',
        position: '',
        submittedAt: e.submitted_at,
        payload: e.payload ? JSON.parse(e.payload) : {},
        event_type: e.event_type,
      };
    });

    const riskIndex = Math.min(
      100,
      counts.email_sent +
        counts.email_opened +
        counts.link_clicked * 2 +
        counts.data_sent * 3,
    );

    const campaignOverview = Object.entries(campaigns).map(([name, stats]) => ({
      campaign: name,
      emailsSent: stats.sent,
      emailsOpened: stats.opened,
      openRate: stats.sent ? Math.round((stats.opened / stats.sent) * 100) : 0,
    }));

    const departmentRisk = Object.entries(departments).map(([dept, stat]) => ({
      department: dept,
      riskIndex: Math.min(
        100,
        stat.email_sent +
          stat.email_opened +
          stat.link_clicked * 2 +
          stat.data_sent * 3,
      ),
    }));

    const geoLocation = Object.entries(geolocation).map(([loc, count]) => ({
      location: loc,
      count,
    }));

    const result = {
      riskIndex,
      emailsSent: counts.email_sent,
      emailsOpened: counts.email_opened,
      linksClicked: counts.link_clicked,
      dataSent: counts.data_sent,
      details,
      campaignOverview,
      departmentRisk,
      geoLocation,
    };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
    return result;
  }

  async generateReportPdf() {
    const report = await this.getReport();
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', (data) => buffers.push(data));

    doc.fontSize(20).text('Reporte de Métricas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('Resumen general');
    doc.fontSize(12).text(`Correos enviados: ${report.emailsSent}`);
    doc.text(`Correos abiertos: ${report.emailsOpened}`);
    doc.text(`Clicks en enlaces: ${report.linksClicked}`);
    doc.text(`Capturas de credenciales: ${report.dataSent}`);

    doc.addPage();
    doc.fontSize(14).text('Visión general de las campañas');
    report.campaignOverview.forEach((c) => {
      doc
        .fontSize(12)
        .text(
          `${c.campaign} - Enviados: ${c.emailsSent}, Abiertos: ${c.emailsOpened}, Tasa: ${c.openRate}%`,
        );
    });

    doc.addPage();
    doc.fontSize(14).text('Índice de riesgo por departamento');
    report.departmentRisk.forEach((d) => {
      doc.fontSize(12).text(`${d.department}: ${d.riskIndex}`);
    });

    doc.addPage();
    doc.fontSize(14).text('Geolocalización de clics');
    report.geoLocation.forEach((g) => {
      doc.fontSize(12).text(`${g.location}: ${g.count}`);
    });

    doc.end();

    return new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(buffers)));
    });
    /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
  }
}
