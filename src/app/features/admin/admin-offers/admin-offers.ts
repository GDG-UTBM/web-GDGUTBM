import { Component, computed, inject, signal } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OffersService, Offer, OfferApplication } from '../../offers/offers.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-offers.html',
  styleUrls: ['./admin-offers.scss']
})
export class AdminOffersComponent implements OnInit {
  private offersService = inject(OffersService);

  offers = this.offersService.getOffersSignal();
  applications = this.offersService.getApplicationsSignal();
  activeTab = signal<'offers' | 'applications'>('offers');
  showModal = signal(false);
  editingId = signal<string | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);
  isApplicationsLoading = signal(false);

  applicationFilter = signal<'all' | 'pending' | 'approved' | 'rejected'>('all');
  applicationsView = computed(() => {
    const list = this.applications().slice();
    const filter = this.applicationFilter();
    if (filter !== 'all') {
      return list.filter(app => app.status === filter);
    }
    return list;
  });

  offerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public languageService: LanguageService
  ) {
    this.offerForm = this.fb.group({
      title: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      type: ['Stage', Validators.required],
      duration: [''],
      startDate: [''],
      start_date: [''],
      mode: [''],
      description: [''],
      tags: [''],
      logo: [''],
      status: ['open', Validators.required]
    });
  }

  async ngOnInit() {
    this.isLoading.set(true);
    this.isApplicationsLoading.set(true);
    try {
      await this.offersService.loadOffers();
    } finally {
      this.isLoading.set(false);
    }
    try {
      await this.offersService.loadApplications();
    } finally {
      this.isApplicationsLoading.set(false);
    }
  }

  openAddModal() {
    this.editingId.set(null);
    this.offerForm.reset({
      title: '',
      company: '',
      location: '',
      type: 'Stage',
      duration: '',
      startDate: '',
      start_date: '',
      mode: '',
      description: '',
      tags: '',
      logo: '',
      status: 'open'
    });
    this.showModal.set(true);
  }

  editOffer(offer: Offer) {
    this.editingId.set(offer.id);
    this.offerForm.patchValue({
      title: offer.title,
      company: offer.company,
      location: offer.location,
      type: offer.type,
      duration: offer.duration,
      startDate: offer.startDate,
      start_date: offer.start_date || '',
      mode: offer.mode,
      description: offer.description,
      tags: offer.tags ? offer.tags.join(', ') : '',
      logo: offer.logo,
      status: offer.status || 'open'
    });
    this.showModal.set(true);
  }

  async deleteOffer(id: string) {
    if (!confirm(this.languageService.isFrench() ? 'Supprimer cette offre ?' : 'Delete this offer?')) return;
    await this.offersService.deleteOffer(id);
  }

  async submitOffer() {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    try {
      const formValue = this.offerForm.value;
      const normalizedTags = this.normalizeCommaList(formValue.tags);
      const startDateLabel = formValue.startDate || this.formatDateLabel(formValue.start_date);
      const payload: Partial<Offer> = {
        title: formValue.title,
        company: formValue.company,
        location: formValue.location,
        type: formValue.type,
        duration: formValue.duration,
        startDate: startDateLabel,
        start_date: formValue.start_date || undefined,
        mode: formValue.mode,
        description: formValue.description,
        tags: normalizedTags,
        logo: formValue.logo,
        status: formValue.status
      };

      if (this.editingId()) {
        await this.offersService.updateOffer(this.editingId()!, payload);
      } else {
        await this.offersService.createOffer(payload);
      }

      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error?.message || 'Une erreur est survenue');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  closeModal() {
    this.showModal.set(false);
  }

  statusLabel(status: OfferApplication['status']) {
    if (status === 'pending') return this.languageService.isFrench() ? 'En attente' : 'Pending';
    if (status === 'approved') return this.languageService.isFrench() ? 'Approuvé' : 'Approved';
    return this.languageService.isFrench() ? 'Rejeté' : 'Rejected';
  }

  formatDate(value: string) {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return value;
    }
  }

  offerLabel(app: OfferApplication) {
    return `${app.offer_title || 'Offre'}${app.company ? ' · ' + app.company : ''}`;
  }

  async updateApplicationStatus(id: string, status: OfferApplication['status']) {
    await this.offersService.updateApplicationStatus(id, status);
  }

  async deleteApplication(id: string) {
    if (!confirm(this.languageService.isFrench() ? 'Supprimer cette candidature ?' : 'Delete this application?')) return;
    await this.offersService.deleteApplication(id);
  }

  private normalizeCommaList(value: string | null | undefined) {
    if (!value) return [];
    const items = value.split(',').map(v => v.trim()).filter(Boolean);
    return items.length ? items : [];
  }

  private formatDateLabel(value: string | null | undefined) {
    if (!value) return '';
    try {
      return new Date(value).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    } catch {
      return value;
    }
  }
}
