import {Component, effect, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher';
import {JoinModalComponent} from '../join-modal/join-modal';
import {TopicModalComponent} from '../topic-modal/topic-modal';
import {CompleteProfileModalComponent} from '../complete-profile-modal/complete-profile-modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    LanguageSwitcherComponent,
    JoinModalComponent,
    TopicModalComponent,
    CompleteProfileModalComponent
  ],
  template: `
    <header class="sticky top-0 z-50 bg-gdg-surface border-b border-gdg-line shadow-sm">
      <nav class="container-custom">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a href="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gdg-blue rounded-r10 flex items-center justify-center">
                <span class="text-white font-bold text-lg">GDG</span>
              </div>
              <span class="text-xl font-bold text-gdg-text hidden md:inline">UTBM</span>
            </a>
          </div>

          <!-- Navigation Centrale -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="/" class="text-gdg-text hover:text-gdg-blue font-medium transition-colors">
              {{ languageService.isFrench() ? 'Accueil' : 'Home' }}
            </a>
            <a href="/events" class="text-gdg-text hover:text-gdg-blue font-medium transition-colors">
              {{ languageService.isFrench() ? 'Événements' : 'Events' }}
            </a>
            <a href="/about" class="text-gdg-text hover:text-gdg-blue font-medium transition-colors">
              {{ languageService.isFrench() ? 'À propos' : 'About' }}
            </a>
          </div>

          <!-- Côté droit -->
          <div class="flex items-center space-x-4">
            <!-- Switch langue -->
            <app-language-switcher></app-language-switcher>

            <!-- Bouton proposer un sujet (visible seulement si professionnel connecté) -->
            @if (authService.isAuthenticated() && authService.isProfessional()) {
              <button (click)="openTopicModal()"
                      class="btn-secondary text-sm px-4 py-2">
                {{ languageService.isFrench() ? 'Proposer un sujet' : 'Propose topic' }}
              </button>
            }

            <!-- Bouton rejoindre ou profil -->
            @if (!authService.isAuthenticated()) {
              <button (click)="openJoinModal()"
                      class="btn-primary text-sm px-4 py-2">
                {{ languageService.isFrench() ? 'Rejoindre' : 'Join' }}
              </button>
            } @else {
              <div class="relative">
                <button (click)="toggleProfileMenu()"
                        class="flex items-center space-x-2 text-gdg-text hover:text-gdg-blue">
                  <div class="w-8 h-8 bg-gdg-blue/10 rounded-full flex items-center justify-center">
                    <span class="font-semibold">
                      {{ getInitials() }}
                    </span>
                  </div>
                  <span class="hidden md:inline">{{ getFirstName() }}</span>
                </button>

                <!-- Menu profil -->
                @if (profileMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-r10 shadow-lg border border-gdg-line py-1 z-50">
                    <div class="px-4 py-2 border-b border-gdg-line">
                      <p class="font-semibold">{{ getFullName() }}</p>
                      <p class="text-xs text-gdg-muted">{{ getEmail() }}</p>
                    </div>
                    <button (click)="signOut()"
                            class="w-full text-left px-4 py-2 text-red-600 hover:bg-gdg-bg">
                      {{ languageService.isFrench() ? 'Déconnexion' : 'Sign out' }}
                    </button>
                  </div>
                }
              </div>
            }

            <!-- Menu mobile -->
            <button (click)="toggleMobileMenu()"
                    class="md:hidden p-2 rounded-lg hover:bg-gdg-bg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Menu mobile -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden py-4 border-t border-gdg-line">
            <div class="flex flex-col space-y-3">
              <a href="/" class="text-gdg-text hover:text-gdg-blue font-medium px-4 py-2">
                {{ languageService.isFrench() ? 'Accueil' : 'Home' }}
              </a>
              <a href="/events" class="text-gdg-text hover:text-gdg-blue font-medium px-4 py-2">
                {{ languageService.isFrench() ? 'Événements' : 'Events' }}
              </a>
              <a href="/about" class="text-gdg-text hover:text-gdg-blue font-medium px-4 py-2">
                {{ languageService.isFrench() ? 'À propos' : 'About' }}
              </a>
              @if (authService.isProfessional()) {
                <button (click)="openTopicModal()"
                        class="text-left text-gdg-text hover:text-gdg-blue font-medium px-4 py-2">
                  {{ languageService.isFrench() ? 'Proposer un sujet' : 'Propose topic' }}
                </button>
              }
            </div>
          </div>
        }
      </nav>
    </header>

    <!-- Modale d'inscription -->
    @if (showJoinModal()) {
      <app-join-modal
        (close)="closeJoinModal()"
        (registerSuccess)="onRegisterSuccess()">
      </app-join-modal>
    }

    <!-- Modale de proposition de sujet -->
    @if (showTopicModal()) {
      <app-topic-modal
        (close)="closeTopicModal()">
      </app-topic-modal>
    }

    <!-- Modale de complétion de profil -->
    @if (showCompleteProfileModal()) {
      <app-complete-profile-modal
        (close)="closeCompleteProfileModal()"
        (completed)="onProfileCompleted()">
      </app-complete-profile-modal>
    }
  `,
  styles: ``
})
export class HeaderComponent {
  mobileMenuOpen = signal(false);
  profileMenuOpen = signal(false);
  showJoinModal = signal(false);
  showTopicModal = signal(false);
  showCompleteProfileModal = signal(false);

  constructor(
    public authService: AuthService,
    public languageService: LanguageService
  ) {
    // Vérifier si le profil est complet après connexion
    const profileSignal = this.authService.getProfile();
    effect(() => {
      const profile = profileSignal();
      if (profile && (!profile.first_name || !profile.role)) {
        this.showCompleteProfileModal.set(true);
      }
    });
  }

  // Getters pour les informations utilisateur
  getInitials(): string {
    const profile = this.authService.getProfile()();
    if (!profile) return '?';
    return (profile.first_name?.charAt(0) || '') + (profile.last_name?.charAt(0) || '');
  }

  getFirstName(): string {
    return this.authService.getProfile()()?.first_name || 'Profil';
  }

  getFullName(): string {
    const profile = this.authService.getProfile()();
    if (!profile) return 'Utilisateur';
    return `${profile.first_name} ${profile.last_name}`;
  }

  getEmail(): string {
    return this.authService.getProfile()()?.email || '';
  }

  // Méthodes de toggle
  toggleMobileMenu() {
    this.mobileMenuOpen.update(state => !state);
  }

  toggleProfileMenu() {
    this.profileMenuOpen.update(state => !state);
  }

  // Méthodes pour les modales
  openJoinModal() {
    this.showJoinModal.set(true);
  }

  closeJoinModal() {
    this.showJoinModal.set(false);
  }

  openTopicModal() {
    this.showTopicModal.set(true);
  }

  closeTopicModal() {
    this.showTopicModal.set(false);
  }

  openCompleteProfileModal() {
    this.showCompleteProfileModal.set(true);
  }

  closeCompleteProfileModal() {
    this.showCompleteProfileModal.set(false);
  }

  // Callbacks
  onRegisterSuccess() {
    // Rediriger ou afficher message
    console.log('Registration successful');
  }

  onProfileCompleted() {
    console.log('Profile completed');
  }

  async signOut() {
    try {
      await this.authService.signOut();
      this.profileMenuOpen.set(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
