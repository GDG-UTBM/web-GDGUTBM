import { Component, EventEmitter, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, UserProfile } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-complete-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'complete-profile-modal.html' ,
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
