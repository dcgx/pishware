import { Body, Controller, Delete, Get, Header, Param, Post } from '@nestjs/common';
import { UsersService } from './user-management.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  @Header('Pragma', 'no-cache')
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
