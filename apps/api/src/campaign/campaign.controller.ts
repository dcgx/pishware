import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { SendTestEmailDto } from 'src/mailer/dto/send-test-email.dto';
import { MailerService } from 'src/mailer/mailer.service';

@Controller('campaign')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly mailerService: MailerService
  ) { }

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(createCampaignDto);
  }

  @Post('send')
  send(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.send(createCampaignDto);
  }

  @Get()
  findAll() {
    return this.campaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.update(+id, updateCampaignDto);
  }

  @Post(':id/send')
  sendExisting(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.sendExisting(+id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(+id);
  }


  @Post('send-test-email')
  sendTest(@Body() dto: SendTestEmailDto) {
    return this.mailerService.sendTestEmail();
  }
}
