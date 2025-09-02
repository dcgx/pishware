import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPageEntity } from './entities/landing-page.entity';
import { LandingAdminController } from './landing-admin.controller';
import { LandingAdminService } from './landing-admin.service';
import { LandingRuntimeController } from './landing-runtime.controller';
import { TrackingModule } from 'src/tracking/tracking.module';
import { UsersService } from 'src/iam/user-management/user-management.service';
import { UserManagmentModule } from 'src/iam/user-management/user-management.module';

@Module({
    imports: [TypeOrmModule.forFeature([LandingPageEntity]), TrackingModule, UserManagmentModule],
    controllers: [LandingAdminController, LandingRuntimeController],
    providers: [LandingAdminService],
    exports: [LandingAdminService], 
})
export class LandingModule { }
