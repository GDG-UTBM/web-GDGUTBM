import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';
import {Activity} from '../../../core/models/Activity.model';
import {ActivityDetailModalComponent} from '../../../shared/components/activity-detail-modal/activity-detail-modal';
import {ActivitiesService} from '../../../core/services/activities.service';


@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, ActivityDetailModalComponent],
  templateUrl: 'what-we-do.html',
  styleUrls: ['./what-we-do.scss']
})
export class WhatWeDoComponent implements OnInit  {
  selectedActivity = signal<Activity | null>(null);
  activities = signal<Activity[]>([]);

  constructor(public languageService: LanguageService,  private activitiesService: ActivitiesService,) {
  }

  async ngOnInit() {
    try {
      const data = await this.activitiesService.getAllActivities();
      if (data && data.length) {
        this.activities.set(data);
      } else {
        this.activities.set(this.datas);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      this.activities.set(this.datas);
    }
  }

  openActivityDetail(activity: Activity) {
    this.selectedActivity.set(activity);
  }

  closeActivityDetail() {
    this.selectedActivity.set(null);
  }

  datas: Activity[] = [
    {
      id: "1",
      title_fr: 'Conférences & Ateliers',
      title_en: 'Talks & Workshops',
      description_fr: 'Des sessions animées par des experts pour approfondir vos connaissances techniques.',
      description_en: 'Sessions led by experts to deepen your technical knowledge.',
      icon: '🎤',
      details_fr: 'Nos conférences et ateliers couvrent les dernières tendances technologiques, des meilleures pratiques de développement aux innovations en IA et robotique.',
      details_en: 'Our talks and workshops cover the latest tech trends, from development best practices to AI and robotics innovations.',
      display_order: 0,
      created_at: "",
      updated_at: ""
    },
    {
      id: "2",
      title_fr: 'Sessions de Coding',
      title_en: 'Coding Sessions',
      description_fr: 'Pratique collaborative pour améliorer vos compétences en programmation.',
      description_en: 'Collaborative practice to improve your programming skills.',
      icon: '💻',
      details_fr: 'Des sessions de codage en groupe pour résoudre des problèmes complexes, apprendre de nouveaux langages et frameworks.',
      details_en: 'Group coding sessions to solve complex problems, learn new languages and frameworks.',
      display_order: 0,
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      title_fr: 'Networking & Échanges',
      title_en: 'Networking & Exchanges',
      description_fr: 'Rencontrez des professionnels et passionnés de la tech pour élargir votre réseau.',
      description_en: 'Meet tech professionals and enthusiasts to expand your network.',
      icon: '🤝',
      details_fr: 'Des événements de networking pour connecter étudiants, développeurs et entreprises du secteur technologique.',
      details_en: 'Networking events to connect students, developers and tech companies.',
      display_order: 0,
      created_at: "",
      updated_at: ""
    }
  ];

  openActivityDetails(activity: Activity) {
    // Ouvrir la modale avec les détails de l'activité
    console.log('Open activity details:', activity);
  }
}
