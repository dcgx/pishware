// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPageEntity } from './landing-page.entity';
import { LandingPageController } from './landing-page.controller';
import { LandingPageService } from './landing-page.service';

@Module({
    imports: [TypeOrmModule.forFeature([LandingPageEntity])],
    controllers: [LandingPageController],
    providers: [LandingPageService],
    exports: [LandingPageService], 
})
export class LandingPageModule { }