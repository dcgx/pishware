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
    console.log('Logging event:', { eventType, payload, metadata, userId });
    const tracking = this.trackingRepository.create({
      event_type: eventType,
      payload: JSON.stringify(payload ?? {}),
      metadata,
      submitted_at: new Date(),
      user: {
        id: "002d871d-d662-4003-a270-41ad9b9f962d"
      }
    });
    return this.trackingRepository.save(tracking);
  }

  async findAll() {
    return this.trackingRepository.find();
  }

  async getMetrics() {
    const events = await this.trackingRepository.find({ relations: ['user'] });

    const counts = {
      email_sent: 0,
      email_opened: 0,
      link_clicked: 0,
      data_sent: 0,
    };

    const details = await Promise.all(
      events.map(async (e) => {
        // contar según el tipo
        if (e.event_type === 'email_sent') counts.email_sent++;
        if (e.event_type === 'email_opened') counts.email_opened++;
        if (e.event_type === 'link_clicked') counts.link_clicked++;
        if (e.event_type === 'data_sent') counts.data_sent++;
        if (e.event_type === 'landing_viewed') counts.link_clicked++;
        if (e.event_type === 'landing_submitted') counts.data_sent++;

        return {
          firstName: e.user?.first_name ?? '',
          lastName: e.user?.last_name ?? '',
          email: e.user?.email ?? '',
          position: '',
          submittedAt: e.submitted_at,
          payload: e.payload ? JSON.parse(e.payload) : {},
          event_type: e.event_type,
        };
      })
      .slice(-20) // últimos 20 eventos
      .reverse(),
    );

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
