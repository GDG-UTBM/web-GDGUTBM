import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-join-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl:'./join-modal.html' ,
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
