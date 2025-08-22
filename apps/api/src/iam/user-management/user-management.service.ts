import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Profile } from '../profile/profile.entity';
import { User } from './entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  private supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );

  async getUsers() {
    const { data: profiles } = await this.supabase
      .from('profiles')
      .select('id, first_name, last_name, email, role, group, status');

    const { data: userList } = await this.supabase.auth.admin.listUsers();
    const lastAccessMap = new Map(
      userList.users.map((u) => [u.id, u.last_sign_in_at]),
    );

    return (
      profiles?.map((profile: any) => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        role: profile.role,
        group: profile.group,
        status: profile.status,
        ultimo_acceso: lastAccessMap.get(profile.id) || null,
        groups: profile.group ? [profile.group] : [],
      })) || []
    );
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
