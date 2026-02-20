import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { UserProfile } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async createUserByAdmin(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
  }) {
    const { data, error } = await this.supabase.rpc('admin_create_user', userData);
    if (error) throw error;
    return data;
  }

  async getAllUsers() {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async updateUserRole(userId: string, newRole: 'student' | 'professional' | 'admin') {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateUser(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteUser(userId: string) {
    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (error) throw error;
  }
}
