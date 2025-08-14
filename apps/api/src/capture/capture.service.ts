import { Injectable } from '@nestjs/common';
import { CreateCaptureDto } from './dto/create-capture.dto';
import { UpdateCaptureDto } from './dto/update-capture.dto';

@Injectable()
export class CaptureService {
  create(createCaptureDto: CreateCaptureDto) {
    return 'This action adds a new capture';
  }

  findAll() {
    return `This action returns all capture`;
  }

  findOne(id: number) {
    return `This action returns a #${id} capture`;
  }

  update(id: number, updateCaptureDto: UpdateCaptureDto) {
    return `This action updates a #${id} capture`;
  }

  remove(id: number) {
    return `This action removes a #${id} capture`;
  }
}
