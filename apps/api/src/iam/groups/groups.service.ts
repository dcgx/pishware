import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const supabaseUrl = 'https://alqirwjbzzejpebmlpmy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODM3NzcsImV4cCI6MjA2Nzk1OTc3N30.GgyDZAH9eKPvlMlwjzzhdPANJQbjxSLWEFmsCovIFbA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseServiceRoleClient = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlyd2pienplanBlYm1scG15Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjM4Mzc3NywiZXhwIjoyMDY3OTU5Nzc3fQ.gB7LBIWOfzdG1V7OLSx0olAYbqPcG9BtnQ6Uw6_zU8M")

@Injectable()
export class GroupsService {
    async getGroups() {
        let { data, error } = await supabaseServiceRoleClient
            .from('groups')
            .select(`
                *,
                group_profile (
                    profile_id,
                    profiles (
                        id,
                        first_name,
                        last_name,  
                        email
                    )
                )
            `);
        // const { data, error } = await supabaseServiceRoleClient.from('groups').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    async getGroupByProfileId(id: string) {
        const { data, error } = await supabaseServiceRoleClient
            .from('group_profile')
            .select('group_id')
            .eq('profile_id', id);

        if (error) throw new Error(error.message);
        return data;
    }

    async getGroupsByUserId(userId: string) {
        const { data, error } = await supabaseServiceRoleClient
            .from('group_profile')
            .select('group_id')
            .eq('profile_id', userId);
        if (error) throw new Error(error.message);
        return data.map(item => item.group_id);
    }

    async createGroup(body: {
        name: string;
        users: any[];
    }) {
        console.log('Creating group with body:', body);
        const { data, error } = await supabaseServiceRoleClient.from('groups').insert({
            name: body.name,
            created_at: new Date().toISOString(),
        }).select();

        if (!data || data.length === 0) {
            throw new Error('Failed to create group: No data returned.');
        }
        const groupId = data[0].id;

        // 'group_profile'
        body.users.forEach(async (user) => {
            await supabaseServiceRoleClient.from('group_profile').insert({
                group_id: groupId,
                profile_id: user.id,
            });
        });

        if (error) throw new Error(error);

        return data;
    }
}
