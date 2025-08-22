import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user-management.service';
import { UsersController } from './user-management.controller';
import { User } from './entities/user.entity';
import { Profile } from '../profile/profile.entity';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User]), MailerModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UserManagmentModule {}
