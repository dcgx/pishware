// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TemplateEntity } from './entities/template.entity';

import { FileUploadModule } from 'src/storage/storage.module';
import { TemplateAttachmentEntity } from './entities/template-attachment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TemplateEntity, TemplateAttachmentEntity]), FileUploadModule],
    controllers: [TemplateController],
    providers: [TemplateService],
    exports: [TemplateService],
})
export class TemplateModule { }