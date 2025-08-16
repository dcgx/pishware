import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './user-management.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll() {
    return this.usersService.getUsers();
  }

  @Post()
  async create(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ) {
    return this.usersService.deleteUser(id);
  }
}
