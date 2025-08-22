import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { TemplateService } from '../template/template.service';
import { TrackingService } from '../tracking/tracking.service';
import { TrackingEmailService } from '../tracking/tracking-email.service';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        { provide: TemplateService, useValue: { findOne: jest.fn() } },
        { provide: TrackingService, useValue: { logEvent: jest.fn() } },
        { provide: TrackingEmailService, useValue: { logEmail: jest.fn() } },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
