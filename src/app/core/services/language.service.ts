// src/app/core/services/language.service.ts
import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private language = signal<'fr' | 'en'>('fr');

  // Exposer un signal en lecture seule
  readonly currentLanguage = this.language.asReadonly();

  // Exposer une valeur calculée pour isFrench
  readonly isFrench = computed(() => this.language() === 'fr');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeLanguage();
  }

  private initializeLanguage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('gdg-language') as 'fr' | 'en' || 'fr';
      this.language.set(savedLang);

      // Écouter les changements de langue
      window.addEventListener('language-change', (event: any) => {
        this.language.set(event.detail);
      });
    }
  }

  setLanguage(lang: 'fr' | 'en') {
    this.language.set(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('gdg-language', lang);
      // Émettre un événement personnalisé
      window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
    }
  }

  toggleLanguage() {
    this.setLanguage(this.language() === 'fr' ? 'en' : 'fr');
  }
}
