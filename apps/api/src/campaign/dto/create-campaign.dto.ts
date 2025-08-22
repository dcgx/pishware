import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsDateString, IsArray } from 'class-validator';
import { CampaignStatus } from '../entities/campaign.entity';

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  template_id: number;

  @IsNotEmpty()
  @IsNumber()
  landing_page_id: number;

  @IsOptional()
  @IsDateString()
  scheduled_start_at?: Date;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  group_ids?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  profile_ids?: string[];
}
