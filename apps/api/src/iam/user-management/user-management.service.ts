import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Profile } from '../profile/profile.entity';
import { User } from './entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getUsers() {
    const profiles = await this.profileRepository.find({
      relations: ['groups'],
    });
    const users = await this.userRepository.find({ relations: ['profile'] });
    return users.map((user) => {
      const profile = profiles.find((p) => p.id === user.profile.id);
      return {
        ...user,
        profile: profile,
        groups: profile?.groups?.map((g) => g.id) || [],
      };
    });
  }

  async createUser(body: {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  }) {
    const generatedPassword = crypto.randomBytes(8).toString('hex');

    const profile = this.profileRepository.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      username: body.username,
    });
    const savedProfile = await this.profileRepository.save(profile);

    const user = this.userRepository.create({
      email: body.email,
      password: generatedPassword,
      first_name: body.first_name,
      last_name: body.last_name,
      profile: savedProfile,
    });
    await this.userRepository.save(user);

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: generatedPassword,
      email_confirm: true,
    });

    if (error) {
      throw new Error(
        `Error al registrar el usuario en Supabase: ${error.message}`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.mailerService.sendUserCredentialsEmail(
      body.email,
      generatedPassword,
    );

    return {
      profile: savedProfile,
      message:
        'Usuario creado correctamente, se envió una contraseña temporal al correo.',
    };
  }

  async deleteUser(id: string) {
    if (!id) throw new Error('ID de usuario no proporcionado.');
    await this.profileRepository.update(id, { deleted_at: new Date() });
    // Also delete or deactivate the authentication user record
    await this.userRepository.delete({ profile: { id } });
    return { message: 'Usuario eliminado correctamente.' };
  }

  async getMe() {
    const user = await this.userRepository.findOne({ relations: ['profile'] });
    if (!user) return null;
    return {
      id: user.profile.id,
      email: user.email,
      first_name: user.profile.first_name,
      last_name: user.profile.last_name,
      username: user.profile.username,
    };
  }

  async updateUser(
    id: string,
    body: {
      first_name?: string;
      last_name?: string;
      username?: string;
      password?: string;
      oldPassword?: string;
    },
  ) {
    const profileUpdate: Partial<Profile> = {};
    const userUpdate: Partial<User> = {};

    if (body.first_name) {
      profileUpdate.first_name = body.first_name;
      userUpdate.first_name = body.first_name;
    }
    if (body.last_name) {
      profileUpdate.last_name = body.last_name;
      userUpdate.last_name = body.last_name;
    }
    if (body.username) {
      profileUpdate.username = body.username;
    }
    if (body.password) {
      const user = await this.userRepository.findOne({
        where: { profile: { id } },
      });
      if (!user) {
        throw new Error('Usuario no encontrado.');
      }
      if (!body.oldPassword || user.password !== body.oldPassword) {
        throw new Error('La contraseña actual es incorrecta.');
      }
      if (body.password.length < 8) {
        throw new Error(
          'La nueva contraseña debe tener al menos 8 caracteres.',
        );
      }
      userUpdate.password = body.password;
    }

    if (Object.keys(profileUpdate).length > 0) {
      await this.profileRepository.update(id, profileUpdate);
    }
    if (Object.keys(userUpdate).length > 0) {
      await this.userRepository.update({ profile: { id } }, userUpdate);
    }

    return { message: 'Usuario actualizado correctamente.' };
  }
}
