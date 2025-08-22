import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
  ) {}

  async logEvent(
    eventType: string,
    payload: any,
    metadata: Record<string, any>,
    userId?: number,
  ) {
    const tracking = this.trackingRepository.create({
      event_type: eventType,
      payload: JSON.stringify(payload ?? {}),
      metadata,
      submitted_at: new Date(),
      user_id: userId ?? null,
    });
    return this.trackingRepository.save(tracking);
  }

  async findAll() {
    return this.trackingRepository.find();
  }

  async getMetrics() {
    const events = await this.trackingRepository.find();
    const counts = {
      email_sent: 0,
      email_opened: 0,
      link_clicked: 0,
      data_sent: 0,
    };

    const details = events.map((e) => {
      interface EventPayload {
        firstName?: string;
        lastName?: string;
        email?: string;
        position?: string;
      }
      let payload: EventPayload = {};
      try {
        payload = JSON.parse(e.payload ?? '{}') as EventPayload;
      } catch {
        payload = {};
      }

      const detail = {
        firstName: payload.firstName ?? '',
        lastName: payload.lastName ?? '',
        email: payload.email ?? '',
        position: payload.position ?? '',
        event_type: e.event_type,
      };

      if (Object.prototype.hasOwnProperty.call(counts, e.event_type)) {
        counts[e.event_type as keyof typeof counts]++;
      }

      return detail;
    });

    const riskIndex = Math.min(
      100,
      counts.email_sent +
        counts.email_opened +
        counts.link_clicked * 2 +
        counts.data_sent * 3,
    );

    return {
      riskIndex,
      emailsSent: counts.email_sent,
      emailsOpened: counts.email_opened,
      linksClicked: counts.link_clicked,
      dataSent: counts.data_sent,
      details,
    };
  }
}
