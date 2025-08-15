import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemplateModule } from './template/template.module.ts';
import { ProfileModule } from './iam/profile/profile.module';
import { LandingPageModule } from './landing/landing-page.module';
import { RoleModule } from './iam/role/role.module';
import { FileUploadModule } from './storage/storage.module';
import { CampaignModule } from './campaign/campaign.module';
import { MailerModule } from './mailer/mailer.module';
import { SmtpProfileModule } from './smtp-profile/smtp-profile.module';
import { RedirectModule } from './redirect/redirect.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para usar ConfigService en cualquier módulo
    }),
    IamModule,
    ProfileModule,
    TemplateModule,
    LandingPageModule,
    FileUploadModule,
    RedirectModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: true, // solo en desarrollo
      }),
    }),
    CampaignModule,
    MailerModule,
    SmtpProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
