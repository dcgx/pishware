import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
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

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.roleService.findOne(id);
    }

    @Post('create')
    create(
        @Body() dto: Partial<RoleEntity>
    ) {
        return this.roleService.create(dto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: Partial<RoleEntity>
    ) {
        return this.roleService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.roleService.remove(id);
    }
}
