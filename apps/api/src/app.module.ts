import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TemplateModule } from './template/template.module.ts';
import { ProfileModule } from './iam/profile/profile.module';
import { LandingModule } from './landing/landing.module';
import { FileUploadModule } from './storage/storage.module';
import { CampaignModule } from './campaign/campaign.module';
import { MailerModule } from './mailer/mailer.module';
import { IamModule } from './iam/iam.module';
import { TrackingModule } from './tracking/tracking.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para usar ConfigService en cualquier módulo
    }),
    ScheduleModule.forRoot(),
    IamModule,
    ProfileModule,
    TemplateModule,
    LandingModule,
    FileUploadModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CampaignModule,
    MailerModule,
    TrackingModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
