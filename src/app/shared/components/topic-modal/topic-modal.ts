import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import {TopicsService} from '../../../core/services/topics.service';

@Component({
  selector: 'app-topic-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl:'topic-modal.html' ,
  styles: ``
})
export class TopicModalComponent {
  @Output() close = new EventEmitter<void>();

  topicForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  eventOptions = [
    { id: '4', labelFr: 'Meetup: Future of Web', labelEn: 'Meetup: Future of Web' },
    { id: '5', labelFr: 'Coding Session: React', labelEn: 'Coding Session: React' },
    { id: '1', labelFr: 'AI & Robotique', labelEn: 'AI & Robotics' }
  ];

  constructor(
    private fb: FormBuilder,
    private topicsService: TopicsService,
    public languageService: LanguageService
  ) {
    this.topicForm = this.fb.group({
      eventId: ['', Validators.required],
      theme: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit() {
    if (this.topicForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const selectedEvent = this.eventOptions.find(e => e.id === this.topicForm.value.eventId);
      const eventLabel = this.languageService.isFrench()
        ? selectedEvent?.labelFr
        : selectedEvent?.labelEn;

      const payload = {
        theme: this.topicForm.value.theme,
        description: eventLabel
          ? `${this.topicForm.value.description}\n\n${this.languageService.isFrench() ? 'Événement' : 'Event'}: ${eventLabel}`
          : this.topicForm.value.description
      };

      await this.topicsService.createTopic(payload);

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
