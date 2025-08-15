import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from './entities/campaign.entity';
import { EmailModule } from 'src/mailer/mailer.module';
import { TemplateModule } from 'src/template/template.module.ts';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignEntity]),
    TemplateModule,
    EmailModule
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule { }
