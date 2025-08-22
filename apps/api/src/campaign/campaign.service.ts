import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { CampaignEntity, CampaignStatus } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepository: Repository<CampaignEntity>,
    private readonly mailerService: MailerService,
  ) { }

  async create(dto: CreateCampaignDto): Promise<CampaignEntity> {
    const campaign = this.campaignRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      template: { id: dto.template_id } as any,
      landing_page: { id: dto.landing_page_id } as any,
      scheduled_start_at: dto.scheduled_start_at ?? null,
      status: dto.status ?? CampaignStatus.DRAFT,
    });
    return this.campaignRepository.save(campaign);
  }

  async findAll(): Promise<CampaignEntity[]> {
    return this.campaignRepository.find({ relations: ['template', 'landing_page'] });
  }

  async findOne(id: number): Promise<CampaignEntity | null> {
    return this.campaignRepository.findOne({ where: { id }, relations: ['template', 'landing_page'] });
  }

  async update(id: number, dto: UpdateCampaignDto): Promise<CampaignEntity | null> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) return null;
    if (dto.name !== undefined) campaign.name = dto.name;
    if (dto.description !== undefined) campaign.description = dto.description;
    if (dto.template_id !== undefined) campaign.template = { id: dto.template_id } as any;
    if (dto.landing_page_id !== undefined) campaign.landing_page = { id: dto.landing_page_id } as any;
    if (dto.scheduled_start_at !== undefined) campaign.scheduled_start_at = dto.scheduled_start_at;
    if (dto.status !== undefined) campaign.status = dto.status;
    return this.campaignRepository.save(campaign);
  }

  async remove(id: number): Promise<void> {
    await this.campaignRepository.delete(id);
  }

  @Cron('*/5 * * * * *')
  async processScheduledCampaigns() {
    const now = new Date();
    const campaigns = await this.campaignRepository.find({
      where: {
        status: CampaignStatus.SCHEDULED,
        scheduled_start_at: LessThanOrEqual(now),
      },
      relations: ['template', 'landing_page'],
    });

    for (const campaign of campaigns) {
      await this.mailerService.sendTestEmail();
      campaign.status = CampaignStatus.SENT;
      await this.campaignRepository.save(campaign);
    }
  }
}
