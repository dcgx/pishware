import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { TemplateService } from '../template/template.service';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        { provide: TemplateService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
