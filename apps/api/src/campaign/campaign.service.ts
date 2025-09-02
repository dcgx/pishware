import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import { CampaignEntity, CampaignStatus } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { SendEmailDto } from 'src/mailer/dto/send-email.dto';
import { Cron } from '@nestjs/schedule';
import { UsersService } from 'src/iam/user-management/user-management.service';
import { User } from 'src/iam/user-management/entities/user.entity';
import { GroupEntity } from 'src/iam/groups/group.entity';
import { parseHtmlCampaign } from './utils/parseHtml';
import { LandingPageEntity } from 'src/landing/entities/landing-page.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepository: Repository<CampaignEntity>,
    @InjectRepository(LandingPageEntity)
    private readonly landingPageRepository: Repository<LandingPageEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly userManagementService: UsersService,
    private readonly mailerService: MailerService,
  ) { }

  async create(dto: CreateCampaignDto): Promise<CampaignEntity> {
    const requestedUserIds = dto.user_ids ?? [];
    const users = requestedUserIds.length
      ? await this.userRepository.find({ where: { id: In(requestedUserIds) } })
      : [];
    console.log('Requested User IDs:', requestedUserIds);
    const campaign = this.campaignRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      template: { id: dto.template_id } as any,
      landing_page: { id: dto.landing_page_id } as any,
      scheduled_start_at: dto.scheduled_start_at ? new Date(dto.scheduled_start_at) : null,
      status: dto.status ?? CampaignStatus.DRAFT,
      groups: dto.group_ids?.map((id) => ({ id }) as any) || [],
      users: users,
    });
    const saved = await this.campaignRepository.save(campaign);
    if (dto.send_now) {
      const campaign = await this.campaignRepository.findOne({
        where: { id: saved.id },
        relations: ['template', 'landing_page'],
      });
      if (!campaign) throw new Error('Campaign not found after creation');

      const users = await this.userManagementService.findUsersByIds(dto.user_ids || []);

      for (const user of users) {
        const emailDto: SendEmailDto = {
          to: user.email,
          subject: campaign.template?.subject || 'Test email',
          html: parseHtmlCampaign(campaign.template?.body_content, campaign.landing_page, campaign.template, user),
          user_id: user.id,
          profile_id: user.profile.id.toString(),
          landing_id: dto.landing_page_id?.toString(),
        };
        console.log({ emailDto });
        await this.mailerService.sendEmail(emailDto);
      }
      saved.status = CampaignStatus.SENT;
      saved.scheduled_start_at = null;
      await this.campaignRepository.save(saved);
    }
    return saved;
  }

  async findAll(): Promise<CampaignEntity[]> {
    return this.campaignRepository.find({
      relations: ['template', 'landing_page', 'groups', 'users'],
    });
  }

  async findOne(id: number): Promise<CampaignEntity | null> {
    return this.campaignRepository.findOne({
      where: { id },
      relations: ['template', 'landing_page', 'groups', 'users'],
    });
  }

  async update(
    id: number,
    dto: UpdateCampaignDto,
  ): Promise<CampaignEntity | null> {
    const campaign = await this.campaignRepository.findOne({ where: { id }, relations: ['groups', 'users', 'template', 'landing_page'] });
    const template = campaign?.template;
    console.log('Updating Campaign:', campaign);
    if (!campaign) return null;
    if (dto.name !== undefined) campaign.name = dto.name;
    if (dto.description !== undefined) campaign.description = dto.description;
    if (dto.template_id !== undefined) {
      if (dto.template_id) {
        campaign.template = { id: dto.template_id } as any;
      } else {
        // Opción 1: mantener el valor actual y no sobreescribir
        // campaign.template se deja como está
        // Opción 2: permitir null explícito (si la DB lo acepta)
        // campaign.template = null;
      }
    }
    if (dto.landing_page_id !== undefined) {
      const landingPage = await this.landingPageRepository.findOne({ 
        where: { id: dto.landing_page_id?.toString() }
      });
      campaign.landing_page = { id: dto.landing_page_id, public_key: landingPage?.public_key } as any;

    }
    if (dto.scheduled_start_at !== undefined) {
      if (dto.scheduled_start_at) {
        const parsedDate = new Date(dto.scheduled_start_at);
        if (!isNaN(parsedDate.getTime())) {
          campaign.scheduled_start_at = parsedDate;
        } else {
          campaign.scheduled_start_at = null;
        }
      } else {
        campaign.scheduled_start_at = null;
      }
    }
    if (dto.status !== undefined) campaign.status = dto.status;
    if (dto.group_ids !== undefined)
      campaign.groups = dto.group_ids.map((id) => ({ id }) as any);
    if (dto.user_ids !== undefined)
      campaign.users = dto.user_ids.map((id) => ({ id }) as any);
    if (dto.send_now) {
      const groups = campaign.groups || [];
      let userIds: string[] = dto.user_ids || [];
      let profileIds: string[] = [];
      for (const group of groups) {
        const groupWithUsers = await this.groupRepository.findOne({
          where: { id: group.id },
          relations: ['profiles'],
        });
        if (groupWithUsers) {
          const profileIdsFromGroup = groupWithUsers.profiles.map((profile) => profile.id);
          profileIds = profileIdsFromGroup.concat(profileIdsFromGroup);
        }
      }
      profileIds = Array.from(new Set(profileIds)); // Remove duplicates
      const users = profileIds.length ?
        await this.userRepository.find({ where: { profile: In(profileIds) }, relations: ['profile'] }) :
        [];
      for (const user of users) {
        
        const emailDto: SendEmailDto = {
          to: user.email,
          subject: template?.subject || 'Test email',
          html: parseHtmlCampaign(template?.body_content, campaign.landing_page, template, user),
          user_id: user.id.toString(),
          profile_id: user.profile.id,
          landing_id: dto.landing_page_id?.toString(),
        };
        await this.mailerService.sendEmail(emailDto);
      }

      campaign.status = CampaignStatus.SENT;
      campaign.scheduled_start_at = null;
    }
    console.log('Updated Campaign:', campaign);
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
      const emailDto: SendEmailDto = {
        to: 'test@example.com',
        subject: 'Test email',
        html: '<p>Test</p>',
        user_id: '',
        profile_id: '',
        landing_id: campaign.landing_page?.id,
      };
      await this.mailerService.sendEmail(emailDto);
      campaign.status = CampaignStatus.SENT;
      await this.campaignRepository.save(campaign);
    }
  }
}
