import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  passwordSuccess = signal('');
  passwordError = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public languageService: LanguageService
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      school: [''],
      study_level: [''],
      company: [''],
      avatar_url: ['']
    });

    this.passwordForm = this.fb.group({
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async ngOnInit() {
    await this.authService.ensureProfileLoaded();
    const profile = this.authService.getProfile()();
    if (profile) {
      this.profileForm.patchValue({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        role: profile.role || '',
        school: profile.school || '',
        study_level: profile.study_level || '',
        company: profile.company || '',
        avatar_url: profile.avatar_url || ''
      });
      this.applyRoleValidators(profile.role as 'student' | 'professional');
    }
  }

  private applyRoleValidators(role: 'student' | 'professional') {
    if (role === 'student') {
      this.profileForm.get('school')?.setValidators([Validators.required]);
      this.profileForm.get('study_level')?.setValidators([Validators.required]);
      this.profileForm.get('company')?.clearValidators();
    } else {
      this.profileForm.get('company')?.setValidators([Validators.required]);
      this.profileForm.get('school')?.clearValidators();
      this.profileForm.get('study_level')?.clearValidators();
    }
    this.profileForm.get('school')?.updateValueAndValidity();
    this.profileForm.get('study_level')?.updateValueAndValidity();
    this.profileForm.get('company')?.updateValueAndValidity();
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    try {
      const user = this.authService.getUser()();
      if (!user) throw new Error('User not authenticated');

      const current = this.authService.getProfile()();
      const role = (current?.role || 'student') as 'student' | 'professional';

      const formValue = this.profileForm.value;
      const updates: Partial<UserProfile> = {
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        avatar_url: formValue.avatar_url || null,
        school: role === 'student' ? formValue.school : null,
        study_level: role === 'student' ? formValue.study_level : null,
        company: role === 'professional' ? formValue.company : null
      };

      await this.authService.updateUserProfile(user.id, updates);
      this.successMessage.set(
        this.languageService.isFrench() ? 'Profil mis à jour.' : 'Profile updated.'
      );
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Une erreur est survenue');
    } finally {
      this.isLoading.set(false);
    }
  }

  async changePassword() {
    this.passwordSuccess.set('');
    this.passwordError.set('');

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { new_password, confirm_password } = this.passwordForm.value;
    if (new_password !== confirm_password) {
      this.passwordError.set(
        this.languageService.isFrench() ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.'
      );
      return;
    }

    try {
      await this.authService.updatePassword(new_password);
      this.passwordSuccess.set(
        this.languageService.isFrench() ? 'Mot de passe mis à jour.' : 'Password updated.'
      );
      this.passwordForm.reset();
    } catch (error: any) {
      this.passwordError.set(error?.message || 'Une erreur est survenue');
    }
  }
}
