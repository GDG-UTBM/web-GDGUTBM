import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl:'./admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  constructor(
    public languageService: LanguageService,
    private authService: AuthService
  ) {}

  signOut() {
    this.authService.signOut();
  }
}
