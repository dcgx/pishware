// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPageEntity } from './landing-page.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LandingPageEntity])],
})
export class LandingPageModule { }