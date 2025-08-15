import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CampaignEntity } from './entities/campaign.entity';
import { MailerService } from 'src/mailer/mailer.service';

describe('CampaignService', () => {
  let service: CampaignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: getRepositoryToken(CampaignEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: MailerService, useValue: { sendTestEmail: jest.fn() } },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
