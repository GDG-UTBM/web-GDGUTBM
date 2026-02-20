import { Component, EventEmitter, Input, Output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { EventsService } from '../../../core/services/events.service';
import {EventModel} from '../../../core/models/event.model';

@Component({
  selector: 'app-all-events-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'all-events-modal.html',
})
export class AllEventsModalComponent {
  @Input() events: EventModel[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() eventClick = new EventEmitter<EventModel>();

  constructor(public languageService: LanguageService) {}

  onEventClick(event: EventModel) {
    this.eventClick.emit(event);
  }
}
