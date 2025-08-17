import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { RoleModule } from './role/role.module';
import { UserManagmentModule } from './user-management/user-management.module';
import { GroupsModule } from './groups/groups.module';

@Module({
    imports: [GroupsModule, ProfileModule, RoleModule, UserManagmentModule],
})
export class IamModule { }
