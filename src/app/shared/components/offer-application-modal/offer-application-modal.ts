import { Component, EventEmitter, Input, OnInit, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { OffersService } from '../../../features/offers/offers.service';

@Component({
  selector: 'app-offer-application-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './offer-application-modal.html',
  styleUrls: ['./offer-application-modal.scss']
})
export class OfferApplicationModalComponent implements OnInit {
  @Input() offerId!: string;
  @Input() offerTitle!: string;
  @Input() companyName!: string;
  @Output() close = new EventEmitter<void>();

  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  isAuthenticated = computed(() => this.authService.isAuthenticated());
  selectedRole = signal<'student' | 'professional'>('student');

  applicationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private offersService: OffersService,
    private authService: AuthService,
    public languageService: LanguageService
  ) {
    this.applicationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      role: ['student', Validators.required],
      school: [''],
      studyLevel: [''],
      profession: [''],
      phone: [''],
      message: ['']
    });
  }

  ngOnInit() {
    const profile = this.authService.getProfile()();
    if (profile) {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      const role = profile.role === 'professional' ? 'professional' : 'student';
      this.applicationForm.patchValue({
        email: profile.email || '',
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

    this.applicationForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole.set(role);
      this.applyRoleValidators(role);
    });
  }

  private applyRoleValidators(role: 'student' | 'professional') {
    if (role === 'student') {
      this.applicationForm.get('school')?.setValidators([Validators.required]);
      this.applicationForm.get('studyLevel')?.setValidators([Validators.required]);
      this.applicationForm.get('profession')?.clearValidators();
    } else {
      this.applicationForm.get('profession')?.setValidators([Validators.required]);
      this.applicationForm.get('school')?.clearValidators();
      this.applicationForm.get('studyLevel')?.clearValidators();
    }
    this.applicationForm.get('school')?.updateValueAndValidity();
    this.applicationForm.get('studyLevel')?.updateValueAndValidity();
    this.applicationForm.get('profession')?.updateValueAndValidity();
  }

  async submitApplication() {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const formValue = this.applicationForm.value;
      const user = this.authService.getUser()();
      await this.offersService.addApplication({
        offer_id: this.offerId,
        user_id: user?.id ?? null,
        email: formValue.email,
        full_name: formValue.fullName,
        role: formValue.role,
        school: formValue.role === 'student' ? formValue.school : null,
        study_level: formValue.role === 'student' ? formValue.studyLevel : null,
        profession: formValue.role === 'professional' ? formValue.profession : null,
        phone: formValue.phone || null,
        message: formValue.message || null
      });

      this.successMessage.set(
        this.languageService.isFrench()
          ? 'Candidature envoyée. Notre équipe reviendra vers vous.'
          : 'Application sent. Our team will get back to you.'
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
