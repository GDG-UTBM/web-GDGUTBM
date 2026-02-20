import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export type ParticipationStatus = 'pending' | 'approved' | 'rejected';

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id?: string | null;
  email?: string | null;
  full_name: string;
  role: 'student' | 'professional';
  school?: string | null;
  study_level?: string | null;
  profession?: string | null;
  status: ParticipationStatus;
  created_at: string;
  event?: {
    id: string;
    title_fr: string;
    title_en: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private supabase: SupabaseClient;
  private participants = signal<EventParticipant[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getParticipants() {
    return this.participants.asReadonly();
  }

  async loadAll() {
    const { data, error } = await this.supabase
      .from('event_participants')
      .select(`
        *,
        event:events(id, title_fr, title_en, date, location)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    this.participants.set(data || []);
    return data || [];
  }

  async loadByEvent(eventId: string) {
    const { data, error } = await this.supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async addParticipant(data: {
    event_id: string;
    user_id?: string | null;
    email?: string | null;
    full_name: string;
    role: 'student' | 'professional';
    school?: string | null;
    study_level?: string | null;
    profession?: string | null;
  }) {
    const { data: inserted, error } = await this.supabase
      .from('event_participants')
      .insert([{
        event_id: data.event_id,
        user_id: data.user_id ?? null,
        email: data.email ?? null,
        full_name: data.full_name,
        role: data.role,
        school: data.school ?? null,
        study_level: data.study_level ?? null,
        profession: data.profession ?? null,
        status: 'pending'
      }])
      .select(`
        *,
        event:events(id, title_fr, title_en)
      `)
      .single();

    if (error) throw error;
    if (inserted) {
      this.participants.update(list => [inserted, ...list]);
    }
    return inserted;
  }

  async updateStatus(id: string, status: ParticipationStatus) {
    const { data, error } = await this.supabase
      .from('event_participants')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    this.participants.update(list =>
      list.map(p => (p.id === id ? { ...p, status } : p))
    );
    return data;
  }
}
