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
import { SiteFooterComponent } from '../../shared/components/site-footer/site-footer';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticipationModalComponent, TopicModalComponent, JoinModalComponent, SiteFooterComponent],
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
  currentMonth = signal(new Date());
  selectedDay = signal<number | null>(null);
  searchTerm = signal('');
  sortOrder = signal<'date_desc' | 'date_asc'>('date_desc');

  constructor(
    public languageService: LanguageService,
    private eventsService: EventsService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  filteredEvents() {
    let list = [...this.events()];
    const type = this.filterType();
    if (type !== 'all') {
      list = list.filter(e => this.getEventStatus(e) === type);
    }

    const day = this.selectedDay();
    if (day) {
      const current = this.currentMonth();
      list = list.filter(event => {
        if (!event.date) return false;
        const d = new Date(event.date);
        return d.getDate() === day && d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear();
      });
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (term) {
      list = list.filter(event => {
        const title = `${event.title_fr} ${event.title_en}`.toLowerCase();
        const desc = `${event.description_fr} ${event.description_en}`.toLowerCase();
        const location = (event.location || '').toLowerCase();
        const partner = (event.partner || '').toLowerCase();
        return title.includes(term) || desc.includes(term) || location.includes(term) || partner.includes(term);
      });
    }

    list.sort((a, b) => {
      const aTime = new Date(a.date || 0).getTime();
      const bTime = new Date(b.date || 0).getTime();
      return this.sortOrder() === 'date_asc' ? aTime - bTime : bTime - aTime;
    });

    return list;
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

  setSearch(value: string) {
    this.searchTerm.set(value);
  }

  setSort(value: string) {
    this.sortOrder.set(value === 'date_asc' ? 'date_asc' : 'date_desc');
  }

  weekDays() {
    return this.languageService.isFrench()
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  monthLabel() {
    const locale = this.languageService.isFrench() ? 'fr-FR' : 'en-US';
    return this.currentMonth().toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }

  calendarDays(): Array<number | null> {
    const date = this.currentMonth();
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const startDay = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: Array<number | null> = Array(startDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length < 42) days.push(null);
    return days;
  }

  prevMonth() {
    const date = this.currentMonth();
    this.currentMonth.set(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    this.selectedDay.set(null);
  }

  nextMonth() {
    const date = this.currentMonth();
    this.currentMonth.set(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    this.selectedDay.set(null);
  }

  selectDay(day: number | null) {
    if (!day) return;
    this.selectedDay.set(day);
  }

  clearSelectedDay() {
    this.selectedDay.set(null);
  }

  isToday(day: number | null) {
    if (!day) return false;
    const now = new Date();
    const current = this.currentMonth();
    return now.getDate() === day && now.getMonth() === current.getMonth() && now.getFullYear() === current.getFullYear();
  }

  hasEventOnDay(day: number | null) {
    if (!day) return false;
    const current = this.currentMonth();
    return this.events().some(event => {
      if (!event.date) return false;
      const d = new Date(event.date);
      return d.getDate() === day && d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear();
    });
  }

  totalCount() {
    return this.events().length;
  }

  eventLink(event: EventModel) {
    return event.link || event.video_url || '';
  }

  upcomingCount() {
    return this.events().filter(event => this.getEventStatus(event) === 'upcoming').length;
  }

  pastCount() {
    return this.events().filter(event => this.getEventStatus(event) === 'past').length;
  }

  getEventStatus(event: EventModel): 'upcoming' | 'past' {
    if (event.status) return event.status;
    if (!event.date) return 'past';
    return new Date(event.date) >= new Date() ? 'upcoming' : 'past';
  }
}
