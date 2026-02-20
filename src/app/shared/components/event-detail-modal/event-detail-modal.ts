import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import {EventModel} from '../../../core/models/event.model';

@Component({
  selector: 'app-event-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detail-modal.html',
})
export class EventDetailModalComponent {
  @Input() event!: EventModel;
  @Output() close = new EventEmitter<void>();
  constructor(public languageService: LanguageService) {}
}
