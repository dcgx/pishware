import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from './entities/template.entity';
@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(TemplateEntity) private readonly templateRepository: Repository<TemplateEntity>
    ) {
    }

    async findAll(): Promise<TemplateEntity[]> {
        return this.templateRepository.find();
    }

    async create(dto: Partial<TemplateEntity>): Promise<TemplateEntity> {
        const template = this.templateRepository.create(dto);
        return this.templateRepository.save(template);
    }
}
