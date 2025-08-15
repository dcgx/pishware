import { Body, Controller, Get, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleEntity } from "./role.entity";

@Controller('roles')
export class RoleController {
    constructor(
        private readonly roleService: RoleService
    ) { }

    @Get()
    findAll() {
        return this.roleService.findAll();
    }

    @Post('create')
    create(
        @Body() dto: Partial<RoleEntity>
    ) {
        return this.roleService.create(dto);
    }
}
