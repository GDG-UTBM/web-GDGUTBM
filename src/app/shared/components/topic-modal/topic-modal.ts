import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import {TopicsService} from '../../../core/services/topics.service';

@Component({
  selector: 'app-topic-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         (click)="closeModal()">
      <div class="bg-white rounded-r16 w-full max-w-md p-6 animate-scale-in"
           (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">
            {{ languageService.isFrench() ? 'Proposer un sujet' : 'Propose a topic' }}
          </h3>
          <button (click)="closeModal()" class="text-gdg-muted hover:text-gdg-text">
            ✕
          </button>
        </div>

        <form [formGroup]="topicForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gdg-text mb-1">
              {{ languageService.isFrench() ? 'Thème du sujet *' : 'Topic theme *' }}
            </label>
            <input type="text" formControlName="theme"
                   placeholder="{{ languageService.isFrench() ? 'Ex: Intelligence Artificielle, Web3, DevOps...' : 'Ex: Artificial Intelligence, Web3, DevOps...' }}"
                   class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
          </div>

          <div>
            <label class="block text-sm font-medium text-gdg-text mb-1">
              {{ languageService.isFrench() ? 'Description *' : 'Description *' }}
            </label>
            <textarea formControlName="description" rows="4"
                      placeholder="{{ languageService.isFrench() ? 'Décrivez votre sujet en détail...' : 'Describe your topic in detail...' }}"
                      class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue"></textarea>
          </div>

          @if (successMessage()) {
            <p class="text-green-500 text-sm">{{ successMessage() }}</p>
          }

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
                {{ languageService.isFrench() ? 'Envoi...' : 'Sending...' }}
              </span>
            } @else {
              <span>{{ languageService.isFrench() ? 'Proposer le sujet' : 'Propose topic' }}</span>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: ``
})
export class TopicModalComponent {
  @Output() close = new EventEmitter<void>();

  topicForm: FormGroup;
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private topicsService: TopicsService,
    public languageService: LanguageService
  ) {
    this.topicForm = this.fb.group({
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
      await this.topicsService.createTopic(this.topicForm.value);

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
