// src/template/template.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProfileEntity])],
})
export class ProfileModule { }