import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.scss']
})
export class LanguageSwitcherComponent {
  constructor(public languageService: LanguageService) {}

  setLanguage(lang: 'fr' | 'en') {
    this.languageService.setLanguage(lang);
  }
}
