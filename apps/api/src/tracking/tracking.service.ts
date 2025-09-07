import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import { User } from 'src/iam/user-management/entities/user.entity';

type Counts = {
  email_sent: number;
  email_opened: number;
  link_clicked: number;
  data_sent: number;
};

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ mejora: respeta el userId si viene, y no hardcodea un id
  async logEvent(
    eventType: string,
    payload: any,
    metadata: Record<string, any> = {},
    userId?: string,
  ) {
    const user = userId
      ? await this.userRepository.findOne({ where: { id: userId } })
      : undefined;

    const tracking = this.trackingRepository.create({
      event_type: eventType,
      payload: JSON.stringify(payload ?? {}),
      metadata,
      submitted_at: new Date(),
      user, // puede ser undefined si es evento anónimo (ej: vista pública)
    });

    return this.trackingRepository.save(tracking);
  }

  async findAll() {
    return this.trackingRepository.find();
  }

  // ---------- Helpers de métrica y riesgo ----------

  private normalizeEventType(t: string): 'email_sent'|'email_opened'|'link_clicked'|'data_sent'|undefined {
    if (!t) return undefined;
    switch (t) {
      case 'email_sent': return 'email_sent';
      case 'email_opened': return 'email_opened';
      case 'link_clicked': return 'link_clicked';
      case 'data_sent': return 'data_sent';
      // equivalencias desde tu flujo:
      case 'landing_viewed': return 'link_clicked';
      case 'landing_submitted': return 'data_sent';
      default: return undefined;
    }
  }

  private calculateRiskIndex(counts: Counts) {
    const sent = Math.max(counts.email_sent, 0);
    if (sent === 0) {
      return {
        riskIndex: 0,
        pOpen: 0,
        pClick: 0,
        pData: 0,
      };
    }

    // porcentajes sobre ENVIADOS (cap a 100 por sanidad)
    const pOpen = Math.min((counts.email_opened / sent) * 100, 100);
    const pClick = Math.min((counts.link_clicked / sent) * 100, 100);
    const pData = Math.min((counts.data_sent / sent) * 100, 100);

    // ponderaciones progresivas por severidad
    const risk = (pOpen * 0.10) + (pClick * 0.30) + (pData * 0.60);
    const riskIndex = Math.round(Math.min(risk, 100));

    return { riskIndex, pOpen, pClick, pData };
  }

  private riskBand(score: number) {
    if (score >= 76) return 'Crítico';
    if (score >= 51) return 'Alto';
    if (score >= 26) return 'Moderado';
    return 'Bajo';
  }

  async getMetrics() {
    const events = await this.trackingRepository.find({ relations: ['user'] });

    const counts: Counts = {
      email_sent: 0,
      email_opened: 0,
      link_clicked: 0,
      data_sent: 0,
    };

    const details = events
      .map((e) => {
        const normalized = this.normalizeEventType(e.event_type);
        if (normalized) counts[normalized]++;

        return {
          firstName: e.user?.first_name ?? '',
          lastName: e.user?.last_name ?? '',
          email: e.user?.email ?? '',
          position: '',
          submittedAt: e.submitted_at,
          payload: e.payload ? JSON.parse(e.payload) : {},
          event_type: e.event_type,
          metadata: e.metadata ?? {},
        };
      })
      .reverse();

    const { riskIndex, pOpen, pClick, pData } = this.calculateRiskIndex(counts);

    return {
      riskIndex,                 // 0..100
      riskBand: this.riskBand(riskIndex),  // 'Bajo' | 'Moderado' | 'Alto' | 'Crítico'
      emailsSent: counts.email_sent,
      emailsOpened: counts.email_opened,
      linksClicked: counts.link_clicked,
      dataSent: counts.data_sent,
      // porcentajes útiles para los RadialBars si quieres mostrar % en vez de valor bruto:
      percentages: {
        open: Math.round(pOpen),
        click: Math.round(pClick),
        data: Math.round(pData),
      },
      details,
    };
  }
}
