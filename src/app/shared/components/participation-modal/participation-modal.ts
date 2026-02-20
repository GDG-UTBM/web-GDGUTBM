import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { ParticipantsService } from '../../../core/services/participants.service';

@Component({
  selector: 'app-participation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participation-modal.html',
  styleUrls: ['./participation-modal.scss']
})
export class ParticipationModalComponent implements OnInit {
  @Input() eventId!: string;
  @Input() eventTitle!: string;
  @Output() close = new EventEmitter<void>();

  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  selectedRole = signal<'student' | 'professional'>('student');

  participationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private participantsService: ParticipantsService,
    private authService: AuthService,
    public languageService: LanguageService
  ) {
    this.participationForm = this.fb.group({
      fullName: ['', Validators.required],
      role: ['student', Validators.required],
      school: [''],
      studyLevel: [''],
      profession: ['']
    });
  }

  ngOnInit() {
    const profile = this.authService.getProfile()();
    if (profile) {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      const role = profile.role === 'professional' ? 'professional' : 'student';
      this.participationForm.patchValue({
        fullName,
        role,
        school: profile.school || '',
        studyLevel: profile.study_level || '',
        profession: profile.company || ''
      });
      this.selectedRole.set(role);
      this.applyRoleValidators(role);
    } else {
      this.applyRoleValidators('student');
    }

    this.participationForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole.set(role);
      this.applyRoleValidators(role);
    });
  }

  private applyRoleValidators(role: 'student' | 'professional') {
    if (role === 'student') {
      this.participationForm.get('school')?.setValidators([Validators.required]);
      this.participationForm.get('studyLevel')?.setValidators([Validators.required]);
      this.participationForm.get('profession')?.clearValidators();
    } else {
      this.participationForm.get('profession')?.setValidators([Validators.required]);
      this.participationForm.get('school')?.clearValidators();
      this.participationForm.get('studyLevel')?.clearValidators();
    }
    this.participationForm.get('school')?.updateValueAndValidity();
    this.participationForm.get('studyLevel')?.updateValueAndValidity();
    this.participationForm.get('profession')?.updateValueAndValidity();
  }

  submitParticipation() {
    if (this.participationForm.invalid) {
      this.participationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const formValue = this.participationForm.value;
      this.participantsService.addParticipant({
        eventId: this.eventId,
        eventTitle: this.eventTitle,
        fullName: formValue.fullName,
        role: formValue.role,
        school: formValue.role === 'student' ? formValue.school : undefined,
        studyLevel: formValue.role === 'student' ? formValue.studyLevel : undefined,
        profession: formValue.role === 'professional' ? formValue.profession : undefined
      });

      this.successMessage.set(
        this.languageService.isFrench()
          ? 'Demande envoyée. Validation en cours.'
          : 'Request sent. Pending approval.'
      );

      setTimeout(() => this.closeModal(), 1200);
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Une erreur est survenue');
    } finally {
      this.isLoading.set(false);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
