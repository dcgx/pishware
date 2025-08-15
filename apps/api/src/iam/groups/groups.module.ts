import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { GroupEntity } from './group.entity';
import { ProfileEntity } from '../profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, ProfileEntity])],
  providers: [GroupsService],
  controllers: [GroupsController],
  exports: [GroupsService],
})
export class GroupsModule {}
