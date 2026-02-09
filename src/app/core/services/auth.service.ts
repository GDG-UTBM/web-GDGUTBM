import { Injectable, signal } from '@angular/core';
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

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initAuth();
  }

  private async initAuth() {
    // Vérifier la session actuelle
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUser.set(session?.user ?? null);

    if (session?.user) {
      await this.loadUserProfile(session.user.id);
    }

    // Écouter les changements d'authentification
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.currentUser.set(session?.user ?? null);

      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      } else {
        this.currentProfile.set(null);
      }
    });
  }

  private async loadUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
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
          role: userData.role
        }
      }
    });

    if (error) throw error;

    // Créer le profil utilisateur
    if (data.user) {
      await this.createUserProfile(data.user.id, {
        email,
        ...userData
      });
    }

    return data;
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
}
