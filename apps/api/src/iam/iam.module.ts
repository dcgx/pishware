import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { RoleModule } from './role/role.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';

@Module({
    imports: [GroupsModule, ProfileModule, RoleModule, UsersModule],
})
export class IamModule { }
