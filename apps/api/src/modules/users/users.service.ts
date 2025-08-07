import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';
import { GroupsService } from '../groups/groups.service';

const supabaseUrl = 'https://alqirwjbzzejpebmlpmy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODM3NzcsImV4cCI6MjA2Nzk1OTc3N30.GgyDZAH9eKPvlMlwjzzhdPANJQbjxSLWEFmsCovIFbA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseServiceRoleClient = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4Mzc3NywiZXhwIjoyMDY3OTU5Nzc3fQ.gB7LBIWOfzdG1V7OLSx0olAYbqPcG9BtnQ6Uw6_zU8M")

@Injectable()
export class UsersService {
    constructor(
        private readonly groupsService: GroupsService,
    ) { }

    async getUsers() {
        const { data, error } = await supabaseServiceRoleClient.from('profiles').select('*');

        if (error) throw new Error(error.message);

        const usersData = await Promise.all(
            data.map(async user => {
                console.log('user', user);
                user.groups = await this.groupsService.getGroupsByUserId(user.id);
                console.log('user.groups', user.groups);
                return user;
            })
        );

        console.log('getUsers resolved', { usersData });
        return usersData;
    }

    async createUser(body: {
        name: string;
        email: string;
        username: string;
    }) {
        const generatedPassword = crypto.randomBytes(8).toString('hex');
        console.log({ generatedPassword })

        const { data: authUser, error: authError } = await supabaseServiceRoleClient.auth.admin.createUser({
            email: body.email,
            password: generatedPassword,
            email_confirm: true,
        });

        if (authError) throw new Error(authError.message);

        const { data: profile, error: profileError } = await supabaseServiceRoleClient.from('profiles').insert([
            {
                id: authUser.user.id, // clave primaria igual al auth_id
                first_name: body.name,
                email: body.email,
                username: body.username,
            }
        ]).select('*');

        if (profileError) throw new Error(profileError.message);

        return {
            profile: profile?.[0],
            password: generatedPassword,
            message: 'Usuario creado correctamente, correo enviado con instrucciones de acceso.',
        };
    }

    async deleteUser(id: string) {
        if (!id) throw new Error('ID de usuario no proporcionado.');

        await supabaseServiceRoleClient.from('profiles').update({ deleted_at: new Date() })
            .eq('id', id);

        console.log('Eliminando usuario con ID:', id);

        const { error: deleteError } = await supabaseServiceRoleClient.auth.admin.deleteUser(id);

        if (deleteError) {
            console.error('Error desde Supabase Admin:', deleteError);
            throw new Error(`Error al eliminar el usuario: ${deleteError.message}`);
        }

        return { message: 'Usuario eliminado correctamente.' };
    }
}
