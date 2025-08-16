import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SendingProfileService } from './sending-profile.service';
import { CreateSendingProfileDto } from './dto/create-sending-profile.dto';
import { UpdateSendingProfileDto } from './dto/update-sending-profile.dto';

@Controller('sending-profiles')
export class SendingProfileController {
  constructor(private readonly service: SendingProfileService) {}

  @Post('create')
  create(@Body() dto: CreateSendingProfileDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSendingProfileDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
