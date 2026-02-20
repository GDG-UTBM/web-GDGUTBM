import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { RouterLink } from '@angular/router';
import { ParticipationModalComponent } from '../../shared/components/participation-modal/participation-modal';
import { TopicModalComponent } from '../../shared/components/topic-modal/topic-modal';
import { EventsService } from '../../core/services/events.service';
import { EventModel } from '../../core/models/event.model';
import { AuthService } from '../../core/services/auth.service';
import { JoinModalComponent } from '../../shared/components/join-modal/join-modal';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticipationModalComponent, TopicModalComponent, JoinModalComponent],
  templateUrl: './events.html',
  styleUrl:'./events.scss',
})
export class EventsComponent implements OnInit {
  events = signal<EventModel[]>([]);
  isLoading = signal(true);
  filterType = signal<'all' | 'upcoming' | 'past'>('all');
  showParticipationModal = signal(false);
  selectedEvent = signal<EventModel | null>(null);
  showTopicModal = signal(false);
  showJoinModal = signal(false);

  constructor(
    public languageService: LanguageService,
    private eventsService: EventsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  filteredEvents() {
    const type = this.filterType();
    if (type === 'all') return this.events();
    return this.events().filter(e => this.getEventStatus(e) === type);
  }

  getTypeLabel(type: string): string {
    if (type === 'conference') return this.languageService.isFrench() ? 'Conférence' : 'Conference';
    if (type === 'workshop') return this.languageService.isFrench() ? 'Atelier' : 'Workshop';
    if (type === 'meetup') return this.languageService.isFrench() ? 'Rencontre' : 'Meetup';
    if (type === 'coding') return this.languageService.isFrench() ? 'Coding session' : 'Coding session';
    return type;
  }

  async loadEvents() {
    this.isLoading.set(true);
    try {
      const data = await this.eventsService.getAllEvents();
      this.events.set(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openTopicModal() {
    this.showTopicModal.set(true);
  }

  closeTopicModal() {
    this.showTopicModal.set(false);
  }

  openJoinModal() {
    this.showJoinModal.set(true);
  }

  closeJoinModal() {
    this.showJoinModal.set(false);
  }

  openParticipation(event: EventModel) {
    this.selectedEvent.set(event);
    this.showParticipationModal.set(true);
  }

  closeParticipation() {
    this.showParticipationModal.set(false);
    this.selectedEvent.set(null);
  }

  getEventStatus(event: EventModel): 'upcoming' | 'past' {
    if (event.status) return event.status;
    if (!event.date) return 'past';
    return new Date(event.date) >= new Date() ? 'upcoming' : 'past';
  }
}
