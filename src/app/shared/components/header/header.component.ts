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
  templateUrl:'./header.component.html',
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
    return `${profile.first_name} ${profile.last_name} `;
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
