import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface Offer {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  startDate: string;
  start_date?: string;
  mode: string;
  description: string;
  tags: string[];
  logo: string;
  status?: 'open' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export type OfferApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface OfferApplication {
  id: string;
  offer_id: string;
  offer_title?: string;
  company?: string;
  user_id?: string | null;
  email?: string | null;
  full_name: string;
  role: 'student' | 'professional';
  school?: string | null;
  study_level?: string | null;
  profession?: string | null;
  phone?: string | null;
  message?: string | null;
  status: OfferApplicationStatus;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class OffersService {
  private supabase: SupabaseClient;
  private offers = signal<Offer[]>([]);
  private applications = signal<OfferApplication[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getOffersSignal() {
    return this.offers.asReadonly();
  }

  getApplicationsSignal() {
    return this.applications.asReadonly();
  }

  getOffers() {
    return this.offers();
  }

  getOfferById(id: string) {
    return this.offers().find(offer => offer.id === id) || null;
  }

  async loadOffers() {
    const { data, error } = await this.supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const list = (data || []).map(row => this.mapOfferFromDb(row));
    this.offers.set(list);
    return list;
  }

  async fetchOfferById(id: string) {
    const { data, error } = await this.supabase
      .from('offers')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    const mapped = this.mapOfferFromDb(data);
    this.offers.update(list => {
      const idx = list.findIndex(item => item.id === id);
      if (idx >= 0) {
        const next = list.slice();
        next[idx] = mapped;
        return next;
      }
      return [mapped, ...list];
    });
    return mapped;
  }

  async createOffer(payload: Partial<Offer>) {
    const { data, error } = await this.supabase
      .from('offers')
      .insert([this.mapOfferToDb(payload)])
      .select('*')
      .single();
    if (error) throw error;
    const offer = this.mapOfferFromDb(data);
    this.offers.update(list => [offer, ...list]);
    return offer;
  }

  async updateOffer(id: string, updates: Partial<Offer>) {
    const { data, error } = await this.supabase
      .from('offers')
      .update(this.mapOfferToDb(updates))
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    const offer = this.mapOfferFromDb(data);
    this.offers.update(list => list.map(item => (item.id === id ? offer : item)));
    return offer;
  }

  async deleteOffer(id: string) {
    const { error } = await this.supabase
      .from('offers')
      .delete()
      .eq('id', id);
    if (error) throw error;
    this.offers.update(list => list.filter(offer => offer.id !== id));
    this.applications.update(list => list.filter(app => app.offer_id !== id));
  }

  async loadApplications() {
    const { data, error } = await this.supabase
      .from('offer_applications')
      .select(`
        *,
        offer:offers(id, title, company)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const list = (data || []).map(row => this.mapApplicationFromDb(row));
    this.applications.set(list);
    return list;
  }

  getApplications() {
    return this.applications();
  }

  getApplicationsByOffer(offerId: string) {
    return this.applications().filter(app => app.offer_id === offerId);
  }

  async addApplication(payload: {
    offer_id: string;
    user_id?: string | null;
    email?: string | null;
    full_name: string;
    role: 'student' | 'professional';
    school?: string | null;
    study_level?: string | null;
    profession?: string | null;
    phone?: string | null;
    message?: string | null;
  }) {
    const { data, error } = await this.supabase
      .from('offer_applications')
      .insert([{
        offer_id: payload.offer_id,
        user_id: payload.user_id ?? null,
        email: payload.email ?? null,
        full_name: payload.full_name,
        role: payload.role,
        school: payload.school ?? null,
        study_level: payload.study_level ?? null,
        profession: payload.profession ?? null,
        phone: payload.phone ?? null,
        message: payload.message ?? null,
        status: 'pending'
      }])
      .select(`
        *,
        offer:offers(id, title, company)
      `)
      .single();
    if (error) throw error;
    const application = this.mapApplicationFromDb(data);
    this.applications.update(list => [application, ...list]);
    return application;
  }

  async updateApplicationStatus(id: string, status: OfferApplicationStatus) {
    const { data, error } = await this.supabase
      .from('offer_applications')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        offer:offers(id, title, company)
      `)
      .single();
    if (error) throw error;
    const application = this.mapApplicationFromDb(data);
    this.applications.update(list =>
      list.map(app => (app.id === id ? application : app))
    );
    return application;
  }

  async deleteApplication(id: string) {
    const { error } = await this.supabase
      .from('offer_applications')
      .delete()
      .eq('id', id);
    if (error) throw error;
    this.applications.update(list => list.filter(app => app.id !== id));
  }

  private mapOfferFromDb(row: any): Offer {
    return {
      id: row.id,
      title: row.title || '',
      company: row.company || '',
      location: row.location || '',
      type: row.type || '',
      duration: row.duration || '',
      startDate: row.start_label || '',
      start_date: row.start_date || undefined,
      mode: row.mode || '',
      description: row.description || '',
      tags: row.tags || [],
      logo: row.logo_url || '',
      status: row.status || 'open',
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private mapOfferToDb(payload: Partial<Offer>) {
    return {
      title: payload.title ?? undefined,
      company: payload.company ?? undefined,
      location: payload.location ?? undefined,
      type: payload.type ?? undefined,
      duration: payload.duration ?? null,
      start_date: payload.start_date ?? null,
      start_label: payload.startDate ?? null,
      mode: payload.mode ?? null,
      description: payload.description ?? null,
      tags: payload.tags ?? [],
      logo_url: payload.logo ?? null,
      status: payload.status ?? 'open'
    };
  }

  private mapApplicationFromDb(row: any): OfferApplication {
    return {
      id: row.id,
      offer_id: row.offer_id,
      offer_title: row.offer?.title || row.offer_title,
      company: row.offer?.company || row.company,
      user_id: row.user_id ?? null,
      email: row.email ?? null,
      full_name: row.full_name,
      role: row.role,
      school: row.school ?? null,
      study_level: row.study_level ?? null,
      profession: row.profession ?? null,
      phone: row.phone ?? null,
      message: row.message ?? null,
      status: row.status || 'pending',
      created_at: row.created_at
    };
  }
}
