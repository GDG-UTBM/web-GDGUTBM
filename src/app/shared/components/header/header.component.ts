import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher';
import {LanguageService} from '../../../core/services/language.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent],
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
            <a href="/join" class="text-gdg-text hover:text-gdg-blue font-medium transition-colors">
              {{ languageService.isFrench() ? 'Nous rejoindre' : 'Join us' }}
            </a>
          </div>

          <!-- Côté droit -->
          <div class="flex items-center space-x-4">
            <!-- Switch langue -->
            <app-language-switcher></app-language-switcher>

            <!-- Bouton proposer un sujet (visible seulement si connecté) -->
            @if (isLoggedIn()) {
              <button (click)="openTopicModal()"
                      class="btn-secondary text-sm px-4 py-2">
                {{ languageService.isFrench() ? 'Proposer un sujet' : 'Propose topic' }}
              </button>
            }

            <!-- Bouton rejoindre -->
            <button (click)="openJoinModal()"
                    class="btn-primary text-sm px-4 py-2">
              {{ languageService.isFrench() ? 'Rejoindre' : 'Join' }}
            </button>

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
              <a href="/join" class="text-gdg-text hover:text-gdg-blue font-medium px-4 py-2">
                {{ languageService.isFrench() ? 'Nous rejoindre' : 'Join us' }}
              </a>
            </div>
          </div>
        }
      </nav>
    </header>
  `,
  styles: ``
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = signal(false);
  isLoggedIn = signal(false);

  constructor(public languageService: LanguageService) {}

  ngOnInit() {
    // Pas besoin d'initialiser la langue ici, le service le fait déjà
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(state => !state);
  }

  openJoinModal() {
    console.log('Open join modal');
  }

  openTopicModal() {
    console.log('Open topic modal');
  }
}
