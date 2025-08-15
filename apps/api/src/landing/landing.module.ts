// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPageEntity } from './entities/landing-page.entity';
import { LandingAdminController } from './landing-admin.controller';
import { LandingAdminService } from './landing-admin.service';
import { LandingRuntimeController } from './landing-runtime.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LandingPageEntity])],
    controllers: [LandingAdminController, LandingRuntimeController],
    providers: [LandingAdminService],
    exports: [LandingAdminService], 
})
export class LandingModule { }