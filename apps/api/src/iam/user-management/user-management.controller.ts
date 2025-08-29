import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Header,
  Patch,
  Post,
} from '@nestjs/common';
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

  @Get('me')
  async getMe() {
    return this.usersService.getMe();
  }

  @Post()
  async create(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.updateUser(id, body);
  }
}
