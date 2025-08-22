import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tracking } from './entities/tracking.entity';
import { User } from 'src/iam/user-management/entities/user.entity';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async logEvent(
    eventType: string,
    payload: any,
    metadata: Record<string, any>,
    userId?: string,
  ) {
    const tracking = this.trackingRepository.create({
      event_type: eventType,
      payload: JSON.stringify(payload ?? {}),
      metadata,
      submitted_at: new Date(),
      user: {
        id: userId,
      }
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

    const details = await events.map(async (e) => {
      const detail = {
        firstName: e.user?.first_name ?? '',
        lastName: e.user?.last_name ?? '',
        email: e.user?.email ?? '',
        position: '',
        submittedAt: e.submitted_at,
        payload: JSON.parse(e.payload),
        event_type: e.event_type,
      };
      console.log('detail', detail);
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
