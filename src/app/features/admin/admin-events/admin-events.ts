import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventsService, } from '../../../core/services/events.service';
import { LanguageService } from '../../../core/services/language.service';
import {EventModel} from '../../../core/models/event.model';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-events.html' ,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class AdminEventsComponent implements OnInit {
  events = signal<EventModel[]>([]);
  isLoading = signal(false);
  showModal = signal(false);
  editingId = signal<string | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal('');

  eventForm: FormGroup;

  constructor(
    private eventsService: EventsService,
    private fb: FormBuilder,
    public languageService: LanguageService
  ) {
    this.eventForm = this.fb.group({
      title_fr: ['', Validators.required],
      title_en: ['', Validators.required],
      description_fr: ['', Validators.required],
      description_en: ['', Validators.required],
      date: ['', Validators.required],
      image_url: [''],
      partner: ['']
    });
  }

  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    this.isLoading.set(true);
    try {
      const data = await this.eventsService.getAllEvents();
      this.events.set(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openAddModal() {
    this.editingId.set(null);
    this.eventForm.reset();
    this.showModal.set(true);
  }

  editEvent(event: EventModel) {
    this.editingId.set(event.id);
    // Formater la date pour input date (YYYY-MM-DD)
    const formattedDate = new Date(event.date).toISOString().split('T')[0];
    this.eventForm.patchValue({
      ...event,
      date: formattedDate
    });
    this.showModal.set(true);
  }

  async deleteEvent(id: string) {
    if (!confirm(this.languageService.isFrench() ? 'Supprimer cet événement ?' : 'Delete this event?')) return;
    try {
      await this.eventsService.deleteEvent(id);
      await this.loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }

  async onSubmit() {
    if (this.eventForm.invalid) return;
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    try {
      const formValue = this.eventForm.value;
      if (this.editingId()) {
        await this.eventsService.updateEvent(this.editingId()!, formValue);
      } else {
        await this.eventsService.createEvent(formValue);
      }
      this.closeModal();
      await this.loadEvents();
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Une erreur est survenue');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  closeModal() {
    this.showModal.set(false);
  }
}
