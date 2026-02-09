import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';

interface PastEvent {
  id: number;
  titleFr: string;
  titleEn: string;
  date: string;
  image: string;
  descriptionFr: string;
  descriptionEn: string;
  partner: string;
}

@Component({
  selector: 'app-past-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section-spacing bg-gdg-surface">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-semibold mb-4">
            {{ languageService.isFrench() ? 'Événements Passés' : 'Past Events' }}
          </h2>
          <p class="text-gdg-muted max-w-2xl mx-auto">
            {{ languageService.isFrench()
              ? 'Découvrez nos événements précédents qui ont marqué la communauté tech.'
              : 'Discover our past events that have marked the tech community.'
            }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (event of pastEvents; track event.id) {
            <div class="card group">
              <!-- Image de l'événement -->
              <div class="mb-4 relative overflow-hidden rounded-r16">
                <div class="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                  <span class="text-4xl">🎯</span>
                </div>
                <div class="absolute top-4 right-4 bg-gdg-blue text-white text-xs px-3 py-1 rounded-full">
                  {{ event.partner }}
                </div>
              </div>

              <!-- Contenu -->
              <div class="space-y-3">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-lg group-hover:text-gdg-blue transition-colors">
                      {{ languageService.isFrench() ? event.titleFr : event.titleEn }}
                    </h3>
                    <p class="text-sm text-gdg-muted mt-1">
                      {{ event.date }}
                    </p>
                  </div>
                </div>

                <p class="text-gdg-muted text-sm line-clamp-2">
                  {{ languageService.isFrench() ? event.descriptionFr : event.descriptionEn }}
                </p>

                <div class="pt-4 border-t border-gdg-line flex justify-between items-center">
                  <span class="text-xs text-gdg-muted">
                    {{ languageService.isFrench() ? 'Avec' : 'With' }} {{ event.partner }}
                  </span>
                  <button (click)="openEventDetails(event)"
                          class="text-gdg-blue text-sm font-medium hover:text-gdg-blue-hover transition-colors">
                    {{ languageService.isFrench() ? 'Voir plus →' : 'Learn More →' }}
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Bouton voir tous les événements -->
        <div class="text-center mt-12">
          <button class="btn-secondary px-8 py-3">
            {{ languageService.isFrench() ? 'Voir tous les événements' : 'View all events' }}
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PastEventsComponent  {
  constructor(public languageService: LanguageService) {
  }


  pastEvents: PastEvent[] = [
    {
      id: 1,
      titleFr: 'AI & Robotique',
      titleEn: 'AI & Robotics',
      date: '12 Octobre 2021',
      image: 'ai-robotics.jpg',
      descriptionFr: 'Conférence sur l\'intelligence artificielle et la robotique avec des experts Google.',
      descriptionEn: 'Conference on artificial intelligence and robotics with Google experts.',
      partner: 'Google'
    },
    {
      id: 2,
      titleFr: 'Web & Cloud',
      titleEn: 'Web & Cloud',
      date: '5 Juin 2021',
      image: 'web-cloud.jpg',
      descriptionFr: 'Atelier de développement web et solutions cloud modernes.',
      descriptionEn: 'Workshop on web development and modern cloud solutions.',
      partner: 'Capgemini'
    },
    {
      id: 3,
      titleFr: 'DevOps & CI/CD',
      titleEn: 'DevOps & CI/CD',
      date: '15 Mars 2022',
      image: 'devops.jpg',
      descriptionFr: 'Introduction aux pratiques DevOps et pipelines CI/CD.',
      descriptionEn: 'Introduction to DevOps practices and CI/CD pipelines.',
      partner: 'Engineering'
    }
  ];

  openEventDetails(event: PastEvent) {
    // Ouvrir la modale avec les détails de l'événement
    console.log('Open event details:', event);
  }
}
