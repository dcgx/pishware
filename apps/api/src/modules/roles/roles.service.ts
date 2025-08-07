import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const supabaseUrl = 'https://alqirwjbzzejpebmlpmy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODM3NzcsImV4cCI6MjA2Nzk1OTc3N30.GgyDZAH9eKPvlMlwjzzhdPANJQbjxSLWEFmsCovIFbA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseServiceRoleClient = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4Mzc3NywiZXhwIjoyMDY3OTU5Nzc3fQ.gB7LBIWOfzdG1V7OLSx0olAYbqPcG9BtnQ6Uw6_zU8M")

@Injectable()
export class RolesService {
    async getRoles() {
        const { data, error } = await supabaseServiceRoleClient.from('roles').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    async createRole(role: { name: string; description: string }) {
        const { data, error } = await supabaseServiceRoleClient.from('roles').insert([role]);
        if (error) throw new Error(error.message);
        return data;
    }
}
