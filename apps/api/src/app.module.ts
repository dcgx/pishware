import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { GroupsModule } from './modules/groups/groups.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TemplateModule } from './template/template.module.ts';
import { ProfileModule } from './profile/profile.module';
import { LandingPageModule } from './landing-page/landing-page.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // para usar ConfigService en cualquier módulo
    }),
    UsersModule,
    RolesModule,
    GroupsModule,
    ProfileModule,
    TemplateModule,
    LandingPageModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
