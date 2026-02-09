import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  template: `
    <div class="flex items-center space-x-1">
      <button (click)="setLanguage('fr')"
              [class]="languageService.isFrench() ? 'text-gdg-blue font-medium' : 'text-gdg-muted hover:text-gdg-text'"
              class="px-2 py-1 text-sm transition-colors">
        FR
      </button>
      <span class="text-gdg-line">|</span>
      <button (click)="setLanguage('en')"
              [class]="!languageService.isFrench() ? 'text-gdg-blue font-medium' : 'text-gdg-muted hover:text-gdg-text'"
              class="px-2 py-1 text-sm transition-colors">
        EN
      </button>
    </div>
  `,
  styles: ``
})
export class LanguageSwitcherComponent {
  constructor(public languageService: LanguageService) {}

  setLanguage(lang: 'fr' | 'en') {
    this.languageService.setLanguage(lang);
  }
}
