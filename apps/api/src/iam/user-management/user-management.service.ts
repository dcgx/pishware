import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Profile } from '../profile/profile.entity';
import { User } from './entities/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  private supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );

  async getUsers() {
    try {
      const profiles = await this.profileRepository.createQueryBuilder('profiles')
        .getMany();

      const { data: userList } = await this.supabase.auth.admin.listUsers();
      console.log('User List:', userList);
      const lastAccessMap = new Map<string, any>(
        userList.users.map((u) => [u.id, u.last_sign_in_at] as [string, any]),
      );
      console.log('Last Access Map:', lastAccessMap);
      console.log('Fetched Profiles:', profiles);
      const mappedProfiles = profiles?.map((profile: Profile) => {
        console.log('Processing profile:', profile);
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          role: null,
          status: true,
          ultimo_acceso: lastAccessMap.get(profile.id) || null,
          groups: profile.groups || [],
          created_at: profile.created_at,
        }
      })
      console.log('Mapped Profiles:', mappedProfiles);
      return mappedProfiles;

    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    }
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    const users = await this.userRepository.find({ where: { id: In(ids) }, relations: ['profile'] });
    return users.map((user) => {
      return {
        ...user,
      };
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['profile'] });
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

    let savedProfile = null;
    try {
      const savedProfile = await this.profileRepository.save(profile);
      const user = this.userRepository.create({
        email: body.email,
        password: generatedPassword,
        first_name: body.first_name,
        last_name: body.last_name,
        profile: savedProfile,
      });
      await this.userRepository.save(user);

    } catch (error) {
      if (error.code === '23505') {
        return {
          message: 'El correo electrónico ya está registrado.',
        }
      }
    }


    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') as string;
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') as string;
    console.log('Supabase URL:', supabaseUrl);
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
    let userHasBeenCreated = false;
    if (error) {
      if (error.message.includes('email address has already been registered')) {
        console.warn('El usuario ya existe en Supabase, se omitió la creación en Supabase.');
        userHasBeenCreated = true;
      }
      else {
        throw new Error(`Error al registrar el usuario en Supabase: ${error.message}`);
      }

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
