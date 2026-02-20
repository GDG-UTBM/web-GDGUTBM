import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';
import {EventDetailModalComponent} from '../../../shared/components/event-detail-modal/event-detail-modal';
import {AllEventsModalComponent} from '../../../shared/components/all-events-modal/all-events-modal';
import {EventsService} from '../../../core/services/events.service';
import {EventModel} from '../../../core/models/event.model';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'app-past-events',
  standalone: true,
  imports: [CommonModule, EventDetailModalComponent, AllEventsModalComponent, RouterLink],
  templateUrl: './past-events.html',
  styleUrl:'./past-events.scss',
})
export class PastEventsComponent implements OnInit  {
  allEvents = signal<EventModel[]>([]);
  displayedEvents = signal<EventModel[]>([]);
  selectedEvent = signal<EventModel | null>(null);
  showAllEvents = signal(false);

  constructor(public languageService: LanguageService, private eventsService: EventsService,) {
  }
  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    try {
      const events = await this.eventsService.getAllEvents();
      if (events && events.length) {
        this.allEvents.set(events);
        this.displayedEvents.set(events.slice(0, 3));
      } else {
        this.allEvents.set(this.datas);
        this.displayedEvents.set(this.datas.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading events:', error);
      this.allEvents.set(this.datas);
      this.displayedEvents.set(this.datas.slice(0, 3));
    }
  }

  openEventDetail(event: EventModel) {
    this.selectedEvent.set(event);
  }

  closeEventDetail() {
    this.selectedEvent.set(null);
  }

  openAllEvents() {
    this.showAllEvents.set(true);
  }

  closeAllEvents() {
    this.showAllEvents.set(false);
  }


  datas: EventModel[] = [
    {
      "id": "1",
      "title_fr": "AI & Robotique",
      "title_en": "AI & Robotics",
      "description_fr": "Conférence sur l'intelligence artificielle et la robotique avec des experts Google.",
      "description_en": "Conference on artificial intelligence and robotics with Google experts.",
      "date": "2021-10-12",
      "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      "partner": "Google",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    },
    {
      "id": "2",
      "title_fr": "Web & Cloud",
      "title_en": "Web & Cloud",
      "description_fr": "Atelier de développement web et solutions cloud modernes.",
      "description_en": "Workshop on web development and modern cloud solutions.",
      "date": "2021-06-05",
      "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      "partner": "Capgemini",
      "created_at": "2024-01-02T11:00:00Z",
      "updated_at": "2024-01-02T11:00:00Z"
    },
    {
      "id": "3",
      "title_fr": "DevOps & CI/CD",
      "title_en": "DevOps & CI/CD",
      "description_fr": "Introduction aux pratiques DevOps et pipelines CI/CD.",
      "description_en": "Introduction to DevOps practices and CI/CD pipelines.",
      "date": "2022-03-15",
      "image_url": "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=80",
      "partner": "Engineering",
      "created_at": "2024-01-03T09:00:00Z",
      "updated_at": "2024-01-03T09:00:00Z"
    }
  ];

}
