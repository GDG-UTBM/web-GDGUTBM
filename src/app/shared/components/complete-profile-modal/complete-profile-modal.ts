import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-complete-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         (click)="closeModal()">
      <div class="bg-white rounded-r16 w-full max-w-md p-6 animate-scale-in"
           (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">
            {{ languageService.isFrench() ? 'Complétez votre profil' : 'Complete your profile' }}
          </h3>
          <button (click)="closeModal()" class="text-gdg-muted hover:text-gdg-text">
            ✕
          </button>
        </div>

        <p class="text-gdg-muted mb-6">
          {{ languageService.isFrench()
            ? 'Veuillez compléter votre profil pour accéder à toutes les fonctionnalités.'
            : 'Please complete your profile to access all features.'
          }}
        </p>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Prénom *' : 'First name *' }}
              </label>
              <input type="text" formControlName="first_name"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Nom *' : 'Last name *' }}
              </label>
              <input type="text" formControlName="last_name"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2">
            </div>
          </div>

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

          @if (selectedRole() === 'student') {
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'École *' : 'School *' }}
              </label>
              <input type="text" formControlName="school"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Niveau d\'étude *' : 'Study level *' }}
              </label>
              <select formControlName="study_level"
                      class="w-full border border-gdg-line rounded-r4 px-3 py-2">
                <option value="">{{ languageService.isFrench() ? 'Sélectionnez' : 'Select' }}</option>
                <option value="licence">Licence</option>
                <option value="master">Master</option>
                <option value="doctorat">Doctorat</option>
              </select>
            </div>
          }

          @if (selectedRole() === 'professional') {
            <div>
              <label class="block text-sm font-medium text-gdg-text mb-1">
                {{ languageService.isFrench() ? 'Entreprise' : 'Company' }}
              </label>
              <input type="text" formControlName="company"
                     class="w-full border border-gdg-line rounded-r4 px-3 py-2">
            </div>
          }

          @if (errorMessage()) {
            <p class="text-red-500 text-sm">{{ errorMessage() }}</p>
          }

          <button type="submit" [disabled]="isLoading()"
                  class="btn-primary w-full">
            @if (isLoading()) {
              <span>{{ languageService.isFrench() ? 'Enregistrement...' : 'Saving...' }}</span>
            } @else {
              <span>{{ languageService.isFrench() ? 'Enregistrer' : 'Save' }}</span>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: ``
})
export class CompleteProfileModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() completed = new EventEmitter<void>();

  profileForm: FormGroup;
  selectedRole = signal<'student' | 'professional'>('student');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public languageService: LanguageService
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: ['student', Validators.required],
      school: [''],
      study_level: [''],
      company: ['']
    });
  }

  ngOnInit() {
    this.profileForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole.set(role);

      if (role === 'student') {
        this.profileForm.get('school')?.setValidators([Validators.required]);
        this.profileForm.get('study_level')?.setValidators([Validators.required]);
      } else {
        this.profileForm.get('company')?.setValidators([Validators.required]);
      }
    });
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const user = this.authService.getUser()();
      if (!user) throw new Error('User not found');

      await this.authService.updateUserProfile(user.id, this.profileForm.value);
      this.completed.emit();
      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error.message);
    } finally {
      this.isLoading.set(false);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
