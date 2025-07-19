import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const supabaseUrl = 'https://alqirwjbzzejpebmlpmy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODM3NzcsImV4cCI6MjA2Nzk1OTc3N30.GgyDZAH9eKPvlMlwjzzhdPANJQbjxSLWEFmsCovIFbA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseServiceRoleClient = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4Mzc3NywiZXhwIjoyMDY3OTU5Nzc3fQ.gB7LBIWOfzdG1V7OLSx0olAYbqPcG9BtnQ6Uw6_zU8M")

@Injectable()
export class UsersService {
    async getUsers() {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    async createUser(body: {
        name: string;
        email: string;
        username: string;
    }) {
        const generatedPassword = crypto.randomBytes(8).toString('hex');

        // 1. Crear usuario Auth
        const { data: authUser, error: authError } = await supabaseServiceRoleClient.auth.admin.createUser({
            email: body.email,
            password: generatedPassword,
            email_confirm: true,
        });

        if (authError) throw new Error(authError.message);

        // 2. Crear perfil
        const { data: profile, error: profileError } = await supabaseServiceRoleClient.from('profiles').insert([
            {
                id: authUser.user.id, // clave primaria igual al auth_id
                first_name: body.name,
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
}
