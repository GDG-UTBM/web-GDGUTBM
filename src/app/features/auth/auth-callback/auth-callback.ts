import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss'
})
export class AuthCallbackComponent implements OnInit {
  isProcessing = true;
  hasError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  async ngOnInit() {
    try {
      await this.authService.setSessionFromUrl();
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('OAuth callback error:', error);
      this.hasError = true;
    } finally {
      this.isProcessing = false;
    }
  }
}
