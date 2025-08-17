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
}
