import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-recovery.html',
  styleUrls: ['./password-recovery.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  requestForm: FormGroup;
  resetForm: FormGroup;

  isLoading = signal(false);
  message = signal('');
  errorMessage = signal('');

  hasSession = computed(() => !!this.authService.getUser()());

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public languageService: LanguageService
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async ngOnInit() {
    try {
      await this.authService.setSessionFromUrl();
    } catch (error) {
      console.error('Error setting session from url:', error);
    }
  }

  async requestReset() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.message.set('');
    this.errorMessage.set('');

    try {
      const email = this.requestForm.value.email;
      await this.authService.requestPasswordReset(email, `${window.location.origin}/reset-password`);
      this.message.set(
        this.languageService.isFrench()
          ? 'Email envoyé. Vérifiez votre boîte de réception.'
          : 'Email sent. Please check your inbox.'
      );
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Une erreur est survenue');
    } finally {
      this.isLoading.set(false);
    }
  }

  async resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { new_password, confirm_password } = this.resetForm.value;
    if (new_password !== confirm_password) {
      this.errorMessage.set(
        this.languageService.isFrench() ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.'
      );
      return;
    }

    this.isLoading.set(true);
    this.message.set('');
    this.errorMessage.set('');

    try {
      await this.authService.updatePassword(new_password);
      this.message.set(
        this.languageService.isFrench() ? 'Mot de passe mis à jour.' : 'Password updated.'
      );
      this.resetForm.reset();
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Une erreur est survenue');
    } finally {
      this.isLoading.set(false);
    }
  }
}
