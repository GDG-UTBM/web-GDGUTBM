import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';

interface Activity {
  id: number;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  icon: string;
  detailsFr: string;
  detailsEn: string;
}

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section-spacing bg-gdg-bg">
      <div class="container-custom">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-semibold mb-4">
            {{ languageService.isFrench() ? 'Ce que nous faisons' : 'What We Do' }}
          </h2>
          <p class="text-gdg-muted max-w-2xl mx-auto">
            {{ languageService.isFrench()
              ? 'Nous créons des opportunités dapprentissage, de réseau et de croissance dans le domaine technologique.'
              : 'We create opportunities for learning, networking and growth in the technology field.'
            }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          @for (activity of activities; track activity.id) {
            <div
              class="card cursor-pointer hover:border-gdg-blue transition-all duration-300"
              (click)="openActivityDetails(activity)"
            >
              <div class="mb-4">
                <div class="w-12 h-12 bg-gdg-blue/10 rounded-r10 flex items-center justify-center mb-4">
                  <span class="text-2xl">{{ activity.icon }}</span>
                </div>
              </div>

              <h3 class="text-xl font-semibold mb-3">
                {{ languageService.isFrench() ? activity.titleFr : activity.titleEn }}
              </h3>

              <p class="text-gdg-muted mb-6">
                {{ languageService.isFrench() ? activity.descriptionFr : activity.descriptionEn }}
              </p>

              <button class="text-gdg-blue font-medium flex items-center space-x-1 hover:space-x-2 transition-all">
                <span>{{ languageService.isFrench() ? 'En savoir plus' : 'Learn more' }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class WhatWeDoComponent  {

  constructor(public languageService: LanguageService) {
  }


  activities: Activity[] = [
    {
      id: 1,
      titleFr: 'Conférences & Ateliers',
      titleEn: 'Talks & Workshops',
      descriptionFr: 'Des sessions animées par des experts pour approfondir vos connaissances techniques.',
      descriptionEn: 'Sessions led by experts to deepen your technical knowledge.',
      icon: '🎤',
      detailsFr: 'Nos conférences et ateliers couvrent les dernières tendances technologiques, des meilleures pratiques de développement aux innovations en IA et robotique.',
      detailsEn: 'Our talks and workshops cover the latest tech trends, from development best practices to AI and robotics innovations.'
    },
    {
      id: 2,
      titleFr: 'Sessions de Coding',
      titleEn: 'Coding Sessions',
      descriptionFr: 'Pratique collaborative pour améliorer vos compétences en programmation.',
      descriptionEn: 'Collaborative practice to improve your programming skills.',
      icon: '💻',
      detailsFr: 'Des sessions de codage en groupe pour résoudre des problèmes complexes, apprendre de nouveaux langages et frameworks.',
      detailsEn: 'Group coding sessions to solve complex problems, learn new languages and frameworks.'
    },
    {
      id: 3,
      titleFr: 'Networking & Échanges',
      titleEn: 'Networking & Exchanges',
      descriptionFr: 'Rencontrez des professionnels et passionnés de la tech pour élargir votre réseau.',
      descriptionEn: 'Meet tech professionals and enthusiasts to expand your network.',
      icon: '🤝',
      detailsFr: 'Des événements de networking pour connecter étudiants, développeurs et entreprises du secteur technologique.',
      detailsEn: 'Networking events to connect students, developers and tech companies.'
    }
  ];

  openActivityDetails(activity: Activity) {
    // Ouvrir la modale avec les détails de l'activité
    console.log('Open activity details:', activity);
  }
}
