import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CaptureService } from './capture.service';
import { CreateCaptureDto } from './dto/create-capture.dto';
import { UpdateCaptureDto } from './dto/update-capture.dto';

@Controller('capture')
export class CaptureController {
  constructor(private readonly captureService: CaptureService) { }

  @Post()
  create(@Body() createCaptureDto: CreateCaptureDto) {
    console.log('Datos capturados:', createCaptureDto);
    return this.captureService.create(createCaptureDto);
  }

  @Get()
  findAll() {
    return this.captureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.captureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaptureDto: UpdateCaptureDto) {
    return this.captureService.update(+id, updateCaptureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.captureService.remove(+id);
  }
}
