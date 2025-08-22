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
    const profiles = await this.profileRepository.find({ relations: ['groups'] });
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
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
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
      throw new Error(`Error al registrar el usuario en Supabase: ${error.message}`);
    }

    await this.mailerService.sendUserCredentialsEmail(body.email, generatedPassword);

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
}
