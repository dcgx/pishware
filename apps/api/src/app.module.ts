import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemplateModule } from './template/template.module.ts';
import { ProfileModule } from './profile/profile.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { RoleModule } from './role/role.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { CampaignModule } from './campaign/campaign.module';
import { EmailModule } from './email/email.module';
import { SmtpProfileModule } from './smtp-profile/smtp-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para usar ConfigService en cualquier módulo
    }),
    UsersModule,
    RoleModule,
    GroupsModule,
    ProfileModule,
    TemplateModule,
    LandingPageModule,
    FileUploadModule,
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
    EmailModule,
    SmtpProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
