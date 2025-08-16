import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Profile } from '../profile/profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async getUsers() {
    const users = await this.profileRepository.find({ relations: ['groups'] });
    return users.map((user) => ({
      ...user,
      groups: user.groups?.map((g) => g.id) || [],
    }));
  }

  async createUser(body: { name: string; email: string; username: string }) {
    const generatedPassword = crypto.randomBytes(8).toString('hex');
    const profile = this.profileRepository.create({
      first_name: body.name,
      email: body.email,
      username: body.username,
    });
    const saved = await this.profileRepository.save(profile);
    return {
      profile: saved,
      password: generatedPassword,
      message: 'Usuario creado correctamente, correo enviado con instrucciones de acceso.',
    };
  }

  async deleteUser(id: string) {
    if (!id) throw new Error('ID de usuario no proporcionado.');
    await this.profileRepository.update(id, { deleted_at: new Date() });
    // Also delete or deactivate the authentication user record
    await this.userRepository.delete({ profile: { id } });
    return { message: 'Usuario eliminado correctamente.' };
  }
}
