import { Body, Controller, Get, Post } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Get()
  async getAll() {
    return this.rolesService.getRoles();
  }

  @Post()
  async create(@Body() body: any) {
    return this.rolesService.createRole(body);
  }
}
