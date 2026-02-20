import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { RouterLink } from '@angular/router';
import { ParticipationModalComponent } from '../../shared/components/participation-modal/participation-modal';
import { TopicModalComponent } from '../../shared/components/topic-modal/topic-modal';

interface Event {
  id: string;
  titleFr: string;
  titleEn: string;
  date: Date;
  endDate?: Date;
  location: string;
  descriptionFr: string;
  descriptionEn: string;
  image?: string;
  type: 'workshop' | 'conference' | 'meetup' | 'coding';
  status: 'upcoming' | 'past';
  partners?: string[];
  link?: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink, ParticipationModalComponent, TopicModalComponent],
  templateUrl: './events.html',
  styleUrl:'./events.scss',
})
export class EventsComponent implements OnInit {
  events = signal<Event[]>([]);
  isLoading = signal(true);
  filterType = signal<'all' | 'upcoming' | 'past'>('all');
  showParticipationModal = signal(false);
  selectedEvent = signal<Event | null>(null);
  showTopicModal = signal(false);

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  filteredEvents() {
    const type = this.filterType();
    if (type === 'all') return this.events();
    return this.events().filter(e => e.status === type);
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
      // Simuler un chargement depuis une API (à remplacer par votre service)
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockEvents: Event[] = [
        {
          id: '1',
          titleFr: 'AI & Robotique',
          titleEn: 'AI & Robotics',
          date: new Date('2025-12-12'),
          location: 'UTBM, Belfort',
          descriptionFr: 'Conférence sur l\'intelligence artificielle et la robotique avec des experts Google.',
          descriptionEn: 'Conference on artificial intelligence and robotics with Google experts.',
          type: 'conference',
          status: 'past',
          partners: ['Google'],
          image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
          link: '#'
        },
        {
          id: '2',
          titleFr: 'Web & Cloud',
          titleEn: 'Web & Cloud',
          date: new Date('2025-06-05'),
          location: 'UTBM, Sevenans',
          descriptionFr: 'Atelier de développement web et solutions cloud modernes.',
          descriptionEn: 'Workshop on web development and modern cloud solutions.',
          type: 'workshop',
          status: 'past',
          partners: ['Capgemini'],
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
          link: '#'
        },
        {
          id: '3',
          titleFr: 'DevOps & CI/CD',
          titleEn: 'DevOps & CI/CD',
          date: new Date('2025-03-15'),
          location: 'En ligne',
          descriptionFr: 'Introduction aux pratiques DevOps et pipelines CI/CD.',
          descriptionEn: 'Introduction to DevOps practices and CI/CD pipelines.',
          type: 'workshop',
          status: 'past',
          image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=80',
          link: '#'
        },
        {
          id: '4',
          titleFr: 'Meetup: Future of Web',
          titleEn: 'Meetup: Future of Web',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // dans 7 jours
          location: 'UTBM, Belfort',
          descriptionFr: 'Rencontre avec des experts pour discuter des tendances du web.',
          descriptionEn: 'Meetup with experts to discuss web trends.',
          type: 'meetup',
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
          link: '#'
        },
        {
          id: '5',
          titleFr: 'Coding Session: React',
          titleEn: 'Coding Session: React',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          location: 'En ligne',
          descriptionFr: 'Session de codage collaborative sur React.',
          descriptionEn: 'Collaborative coding session on React.',
          type: 'coding',
          status: 'upcoming',
          image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
          link: '#'
        }
      ];
      this.events.set(mockEvents);
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

  openParticipation(event: Event) {
    this.selectedEvent.set(event);
    this.showParticipationModal.set(true);
  }

  closeParticipation() {
    this.showParticipationModal.set(false);
    this.selectedEvent.set(null);
  }
}
