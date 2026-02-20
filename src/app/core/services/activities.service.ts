import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import {Activity} from '../models/Activity.model';


@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getAllActivities() {
    const { data, error } = await this.supabase
      .from('activities')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return data;
  }

  async getActivity(id: string) {
    const { data, error } = await this.supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createActivity(activity: Partial<Activity>) {
    const { data, error } = await this.supabase
      .from('activities')
      .insert([activity])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateActivity(id: string, updates: Partial<Activity>) {
    const { data, error } = await this.supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteActivity(id: string) {
    const { error } = await this.supabase
      .from('activities')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async reorderActivities(activities: Activity[]) {
    for (let i = 0; i < activities.length; i++) {
      const { error } = await this.supabase
        .from('activities')
        .update({ display_order: i })
        .eq('id', activities[i].id);
      if (error) throw error;
    }
  }
}
