import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Topic {
  id: string;
  user_id: string;
  theme: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  private supabase: SupabaseClient;
  private topics = signal<Topic[]>([]);

  constructor(private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async createTopic(topicData: { theme: string; description: string }) {
    const user = this.authService.getUser()();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('topics')
      .insert([{
        user_id: user.id,
        theme: topicData.theme,
        description: topicData.description,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserTopics(userId: string) {
    const { data, error } = await this.supabase
      .from('topics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    this.topics.set(data);
    return data;
  }

  async getAllTopics() {
    const { data, error } = await this.supabase
      .from('topics')
      .select(`
        *,
        user:profiles(first_name, last_name, email, role)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    this.topics.set(data);
    return data;
  }

  async updateTopicStatus(topicId: string, status: 'approved' | 'rejected') {
    const { data, error } = await this.supabase
      .from('topics')
      .update({ status })
      .eq('id', topicId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  getTopics() {
    return this.topics.asReadonly();
  }
}
