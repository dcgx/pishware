import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { TrackingEmail } from './entities/tracking-email.entity';

interface LogEmailParams {
  landingId?: string | null;
  userId: string;
  profileId: string;
  email: string;
  subject?: string | null;
  messageId?: string | null;
  metadata?: Record<string, any>;
  token?: string | null;
}

@Injectable()
export class TrackingEmailService {
  constructor(
    @InjectRepository(TrackingEmail)
    private readonly trackingEmailRepository: Repository<TrackingEmail>,
  ) { }

  async logEmail(params: LogEmailParams) {
    const record = this.trackingEmailRepository.create({
      landing_id: params.landingId ?? null,
      user_id: params.userId,
      profile_id: params.profileId,
      email: params.email,
      subject: params.subject ?? null,
      message_id: params.messageId ?? null,
      metadata: params.metadata ?? {},
    } as DeepPartial<TrackingEmail>);
    console.log('Logging email:', record);
    return this.trackingEmailRepository.save(record);
  }
}
