import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import {TopicsService} from '../../../core/services/topics.service';
import { EventsService } from '../../../core/services/events.service';
import { EventModel } from '../../../core/models/event.model';

@Component({
  selector: 'app-topic-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'topic-modal.html' ,
  styles: ``
})
export class TopicModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  topicForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  eventOptions = signal<EventModel[]>([]);

  constructor(
    private fb: FormBuilder,
    private topicsService: TopicsService,
    private eventsService: EventsService,
    public languageService: LanguageService
  ) {
    this.topicForm = this.fb.group({
      eventId: ['', Validators.required],
      theme: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async ngOnInit() {
    try {
      const events = await this.eventsService.getAllEvents();
      const upcoming = (events || []).filter(e => {
        if (e.status) return e.status === 'upcoming';
        if (!e.date) return false;
        return new Date(e.date) >= new Date();
      });
      this.eventOptions.set(upcoming.length ? upcoming : (events || []));
    } catch (error) {
      console.error('Error loading events for topics:', error);
    }
  }

  async onSubmit() {
    if (this.topicForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.topicsService.createTopic({
        event_id: this.topicForm.value.eventId,
        theme: this.topicForm.value.theme,
        description: this.topicForm.value.description
      });

      this.successMessage.set(
        this.languageService.isFrench()
          ? 'Soumis avec succès ! Un administrateur examinera votre proposition.'
          : 'Successfully submitted! An admin will review your proposal.'
      );

      this.topicForm.reset();

      // Fermer après 2 secondes
      setTimeout(() => {
        this.closeModal();
      }, 2000);
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
