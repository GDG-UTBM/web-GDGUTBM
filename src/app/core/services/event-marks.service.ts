import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface EventMark {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EventMarksService {
  private supabase: SupabaseClient;
  private marks = signal<EventMark[]>([]);

  constructor(private authService: AuthService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getMarks() {
    return this.marks.asReadonly();
  }

  async loadByEvent(eventId: string) {
    const { data, error } = await this.supabase
      .from('event_marks')
      .select(`
        *,
        user:profiles(first_name, last_name, role)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    this.marks.set(data || []);
    return data || [];
  }

  async markEvent(eventId: string) {
    const user = this.authService.getUser()();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('event_marks')
      .insert([{
        event_id: eventId,
        user_id: user.id
      }])
      .select(`
        *,
        user:profiles(first_name, last_name, role)
      `)
      .single();

    if (error) throw error;
    if (data) {
      this.marks.update(list => [data, ...list]);
    }
    return data;
  }

  async unmarkEvent(eventId: string) {
    const user = this.authService.getUser()();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('event_marks')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);
    if (error) throw error;
    this.marks.update(list => list.filter(m => !(m.event_id === eventId && m.user_id === user.id)));
  }
}
