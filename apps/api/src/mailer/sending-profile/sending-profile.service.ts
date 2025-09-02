import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendingProfileEntity } from './entities/sending-profile.entity';
import { CreateSendingProfileDto } from './dto/create-sending-profile.dto';
import { UpdateSendingProfileDto } from './dto/update-sending-profile.dto';

@Injectable()
export class SendingProfileService {
  constructor(
    @InjectRepository(SendingProfileEntity)
    private readonly repo: Repository<SendingProfileEntity>,
  ) { }

  create(dto: CreateSendingProfileDto) {
    const profile = this.repo.create(dto);
    return this.repo.save(profile);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateSendingProfileDto) {
    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([_, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(updateData).length === 0) {
      throw new Error('No fields to update')
    }

    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
