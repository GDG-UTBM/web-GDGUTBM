import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async sendParticipationStatusEmail(payload: { participant_id: string; status: 'approved' | 'rejected' }) {
    const { error } = await this.supabase.functions.invoke('send-participation-status', {
      body: payload
    });
    if (error) throw error;
  }
}
