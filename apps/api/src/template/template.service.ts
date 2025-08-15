import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateEntity } from './entities/template.entity';
import { TemplateAttachmentEntity } from './entities/template-attachment.entity';

import { FileUploadService } from 'src/storage/storage.service';

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(TemplateEntity) private readonly templateRepository: Repository<TemplateEntity>,
        @InjectRepository(TemplateAttachmentEntity) private readonly templateAttachmentRepository: Repository<TemplateAttachmentEntity>,
        private readonly fileUploadService: FileUploadService
    ) {
    }

    async findAll(): Promise<TemplateEntity[]> {
        return this.templateRepository.find();
    }

    async findOne(id: number): Promise<TemplateEntity | null> {
        return this.templateRepository.findOne({ where: { id } });
    }

    async create(dto: Partial<TemplateEntity>): Promise<TemplateEntity> {
        const template = this.templateRepository.create(dto);
        return this.templateRepository.save(template);
    }

    async uploadAttachment(templateId: number, file: any): Promise<void> {
        const fileUploaded = await this.fileUploadService.uploadToS3(file, {
            folder: `template-attachments/${templateId}`,
            makePublic: false, // o true si lo quieres público/servido por CDN
        });
        const s3Bucket = process.env.AWS_S3_BUCKET!;
        const attachment = this.templateAttachmentRepository.create({
            template: { id: templateId },
            file_name: fileUploaded.originalname,
            file_path: `https://${s3Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileUploaded.key}`,
            mime_type: fileUploaded.mimetype,
            size: fileUploaded.size,
            uploaded_at: new Date(),
        });
        await this.templateAttachmentRepository.save(attachment);
    }
}
