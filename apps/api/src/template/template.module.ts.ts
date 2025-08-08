// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TemplateEntity } from './template.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TemplateEntity])],
    controllers: [TemplateController],
    providers: [TemplateService],
})
export class TemplateModule { }