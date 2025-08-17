import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CampaignEntity } from './entities/campaign.entity';
import { MailerService } from 'src/mailer/mailer.service';

describe('CampaignController', () => {
  let controller: CampaignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [
        CampaignService,
        { provide: getRepositoryToken(CampaignEntity), useValue: {} },
        { provide: MailerService, useValue: { sendTestEmail: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CampaignController>(CampaignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
