import {computed, Injectable, signal} from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'professional' | 'admin';
  school?: string;
  study_level?: string;
  company?: string;
  avatar_url?: string;
  is_verified?: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser = signal<User | null>(null);
  private currentProfile = signal<UserProfile | null>(null);
  private initPromise: Promise<void>;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initPromise = this.initAuth();
  }

  private async initAuth() {
    // Vérifier la session actuelle
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser.set(session?.user ?? null);

    if (session?.user) {
      await this.loadUserProfile(session.user);
    }

    // Écouter les changements d'authentification
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.currentUser.set(session?.user ?? null);

      if (session?.user) {
        await this.loadUserProfile(session.user);
      } else {
        this.currentProfile.set(null);
      }
    });
  }

  private async loadUserProfile(user: User) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    if (!data) {
      const metadata = (user.user_metadata || {}) as Record<string, any>;
      const { data: created, error: insertError } = await this.supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          first_name: metadata['first_name'] || '',
          last_name: metadata['last_name'] || '',
          role: metadata['role'] || 'student',
          school: metadata['school'] || null,
          study_level: metadata['study_level'] || null,
          company: metadata['company'] || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return;
      }
      this.currentProfile.set(created);
      return;
    }

    this.currentProfile.set(data);
  }

  async signUpWithEmail(email: string, password: string, userData: Partial<UserProfile>) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          school: userData.school,
          study_level: userData.study_level,
          company: userData.company
        }
      }
    });

    if (error) throw error;

    return data;
  }

  async requestPasswordReset(email: string, redirectTo: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  async setSessionFromUrl() {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return false;
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (!access_token || !refresh_token) return false;

    const { error } = await this.supabase.auth.setSession({ access_token, refresh_token });
    if (error) throw error;
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.currentUser.set(null);
    this.currentProfile.set(null);
    this.router.navigate(['/']);
  }

  async createUserProfile(userId: string, profileData: Partial<UserProfile>) {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert([{
        id: userId,
        ...profileData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    this.currentProfile.set(data);
    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    this.currentProfile.set(data);
    return data;
  }

  async whenReady() {
    await this.initPromise;
  }

  async ensureProfileLoaded() {
    await this.whenReady();
    const user = this.currentUser();
    if (!user) return null;
    if (this.currentProfile()) return this.currentProfile();

    await this.loadUserProfile(user);
    return this.currentProfile();
  }

  // Getters
  getUser() {
    return this.currentUser.asReadonly();
  }

  getProfile() {
    return this.currentProfile.asReadonly();
  }

  isAuthenticated() {
    return this.currentUser() !== null;
  }

  isProfessional() {
    return this.currentProfile()?.role === 'professional';
  }

  isAdmin() {
    return this.currentProfile()?.role === 'admin';
  }

  isStudent() {
    return this.currentProfile()?.role === 'student';
  }
  isProfessionalOrAdmin = computed(() => {
    const profile = this.currentProfile();
    return profile?.role === 'professional' || profile?.role === 'admin';
  });
}
