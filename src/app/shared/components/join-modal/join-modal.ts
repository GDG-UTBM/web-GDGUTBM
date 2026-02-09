import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-join-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         (click)="closeModal()">
      <div class="bg-white rounded-r16 w-full max-w-md p-6 animate-scale-in max-h-[90vh] overflow-y-auto"
           (click)="$event.stopPropagation()">
        <!-- En-tête -->
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">
            {{ languageService.isFrench() ? 'Rejoindre la communauté' : 'Join the community' }}
          </h3>
          <button (click)="closeModal()" class="text-gdg-muted hover:text-gdg-text text-xl">
            ✕
          </button>
        </div>

        <!-- Onglets -->
        <div class="flex border-b border-gdg-line mb-6">
          <button
            [class]="activeTab() === 'login' ? 'border-b-2 border-gdg-blue text-gdg-blue' : 'text-gdg-muted'"
            (click)="setActiveTab('login')"
            class="flex-1 py-2 font-medium">
            {{ languageService.isFrench() ? 'Connexion' : 'Login' }}
          </button>
          <button
            [class]="activeTab() === 'register' ? 'border-b-2 border-gdg-blue text-gdg-blue' : 'text-gdg-muted'"
            (click)="setActiveTab('register')"
            class="flex-1 py-2 font-medium">
            {{ languageService.isFrench() ? 'Inscription' : 'Register' }}
          </button>
        </div>

        <!-- Formulaire de connexion -->
        @if (activeTab() === 'login') {
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Email' : 'Email' }}
              </label>
              <input type="email" formControlName="email"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="text-red-500 text-sm mt-1">
                  {{ languageService.isFrench() ? 'Email invalide' : 'Invalid email' }}
                </p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Mot de passe' : 'Password' }}
              </label>
              <input type="password" formControlName="password"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-red-500 text-sm mt-1">
                  {{ languageService.isFrench() ? 'Mot de passe requis' : 'Password required' }}
                </p>
              }
            </div>

            @if (errorMessage()) {
              <p class="text-red-500 text-sm">{{ errorMessage() }}</p>
            }

            <button type="submit" [disabled]="isLoading()"
                    class="btn-primary w-full disabled:opacity-50">
              @if (isLoading()) {
                <span class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {{ languageService.isFrench() ? 'Connexion...' : 'Logging in...' }}
                </span>
              } @else {
                <span>{{ languageService.isFrench() ? 'Se connecter' : 'Sign in' }}</span>
              }
            </button>
          </form>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gdg-line"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gdg-muted">
                {{ languageService.isFrench() ? 'Ou continuer avec' : 'Or continue with' }}
              </span>
            </div>
          </div>

          <button (click)="signInWithGoogle()"
                  [disabled]="isLoading()"
                  class="w-full flex items-center justify-center space-x-2 border border-gdg-line hover:bg-gdg-bg rounded-r4 px-4 py-3 transition-colors disabled:opacity-50">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        }

        <!-- Formulaire d'inscription -->
        @if (activeTab() === 'register') {
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-4">
            <!-- Nom et Prénom -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gdg-text mb-1">
                  {{ languageService.isFrench() ? 'Prénom *' : 'First name *' }}
                </label>
                <input type="text" formControlName="first_name"
                       class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
              </div>
              <div>
                <label class="block text-sm font-medium text-gdg-text mb-1">
                  {{ languageService.isFrench() ? 'Nom *' : 'Last name *' }}
                </label>
                <input type="text" formControlName="last_name"
                       class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Email *' : 'Email *' }}
              </label>
              <input type="email" formControlName="email"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
            </div>

            <!-- Mot de passe -->
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Mot de passe *' : 'Password *' }}
              </label>
              <input type="password" formControlName="password"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
              <p class="text-xs text-gdg-muted mt-1">
                {{ languageService.isFrench()
                  ? 'Minimum 6 caractères'
                  : 'Minimum 6 characters'
                }}
              </p>
            </div>

            <!-- Rôle -->
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-2">
                {{ languageService.isFrench() ? 'Vous êtes *' : 'You are *' }}
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input type="radio" formControlName="role" value="student" class="mr-2">
                  <span>{{ languageService.isFrench() ? 'Étudiant' : 'Student' }}</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" formControlName="role" value="professional" class="mr-2">
                  <span>{{ languageService.isFrench() ? 'Professionnel' : 'Professional' }}</span>
                </label>
              </div>
            </div>

            <!-- Champs conditionnels -->
            @if (selectedRole() === 'student') {
              <div>
                <label class="block text-sm font-medium text-gdg-text mb-1">
                  {{ languageService.isFrench() ? 'École *' : 'School *' }}
                </label>
                <input type="text" formControlName="school"
                       class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
              </div>
              <div>
                <label class="block text-sm font-medium text-gdg-text mb-1">
                  {{ languageService.isFrench() ? 'Niveau d étude *' : 'Study level *' }}
                </label>
                <select formControlName="study_level"
                        class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
                  <option value="">{{ languageService.isFrench() ? 'Sélectionnez' : 'Select' }}</option>
                  <option value="licence">Licence</option>
                  <option value="master">Master</option>
                  <option value="doctorat">Doctorat</option>
                  <option value="ingenieur">Ingénieur</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            }

            @if (selectedRole() === 'professional') {
              <div>
                <label class="block text-sm font-medium text-gdg-text mb-1">
                  {{ languageService.isFrench() ? 'Entreprise' : 'Company' }}
                </label>
                <input type="text" formControlName="company"
                       class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
                <p class="text-xs text-gdg-muted mt-1">
                  {{ languageService.isFrench()
                    ? 'Ladministrateur validera votre statut professionnel'
                    : 'Admin will verify your professional status'
                  }}
                </p>
              </div>
            }

            <!-- Photo de profil (optionnel) -->
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Photo de profil' : 'Profile photo' }}
                <span class="text-gdg-muted"> ({{ languageService.isFrench() ? 'optionnel' : 'optional' }})</span>
              </label>
              <input type="file" (change)="onFileSelected($event)"
                     accept="image/*"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2">
            </div>

            <!-- Conditions -->
            <div class="flex items-start space-x-2">
              <input type="checkbox" formControlName="acceptTerms" id="acceptTerms" class="mt-1">
              <label for="acceptTerms" class="text-sm">
                {{ languageService.isFrench()
                  ? 'Jaccepte les termes et conditions *'
                  : 'I accept the terms and conditions *'
                }}
              </label>
            </div>

            @if (errorMessage()) {
              <p class="text-red-500 text-sm">{{ errorMessage() }}</p>
            }

            <button type="submit" [disabled]="isLoading() || registerForm.invalid"
                    class="btn-primary w-full disabled:opacity-50">
              @if (isLoading()) {
                <span class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {{ languageService.isFrench() ? 'Inscription...' : 'Registering...' }}
                </span>
              } @else {
                <span>{{ languageService.isFrench() ? 'S inscrire' : 'Sign up' }}</span>
              }
            </button>
          </form>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class JoinModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();

  activeTab = signal<'login' | 'register'>('login');
  selectedRole = signal<'student' | 'professional'>('student');
  isLoading = signal(false);
  errorMessage = signal('');
  selectedFile: File | null = null;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public languageService: LanguageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required],
      school: [''],
      study_level: [''],
      company: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    // Écouter les changements de rôle
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole.set(role);

      if (role === 'student') {
        this.registerForm.get('school')?.setValidators([Validators.required]);
        this.registerForm.get('study_level')?.setValidators([Validators.required]);
        this.registerForm.get('company')?.clearValidators();
      } else {
        this.registerForm.get('company')?.setValidators([Validators.required]);
        this.registerForm.get('school')?.clearValidators();
        this.registerForm.get('study_level')?.clearValidators();
      }

      this.registerForm.get('school')?.updateValueAndValidity();
      this.registerForm.get('study_level')?.updateValueAndValidity();
      this.registerForm.get('company')?.updateValueAndValidity();
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.signInWithEmail(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(
        this.languageService.isFrench()
          ? 'Identifiants incorrects'
          : 'Invalid credentials'
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  async onRegister() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const formValue = this.registerForm.value;

      // Créer l'utilisateur
      await this.authService.signUpWithEmail(
        formValue.email,
        formValue.password,
        {
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          role: formValue.role,
          school: formValue.role === 'student' ? formValue.school : undefined,
          study_level: formValue.role === 'student' ? formValue.study_level : undefined,
          company: formValue.role === 'professional' ? formValue.company : undefined
        }
      );

      this.registerSuccess.emit();
      this.closeModal();

      alert(
        this.languageService.isFrench()
          ? 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.'
          : 'Registration successful! Please check your email to confirm your account.'
      );
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Une erreur est survenue');
    } finally {
      this.isLoading.set(false);
    }
  }

  async signInWithGoogle() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.signInWithGoogle();
      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  setActiveTab(tab: 'login' | 'register') {
    this.activeTab.set(tab);
    this.errorMessage.set('');
  }

  closeModal() {
    this.close.emit();
  }
}
