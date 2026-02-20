import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ParticipantsService } from '../../../core/services/participants.service';
import { ParticipationModalComponent } from '../../../shared/components/participation-modal/participation-modal';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ParticipationModalComponent],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss']
})
export class EventDetailComponent implements OnInit {
  event = signal<any>(null);
  safeVideoUrl = signal<SafeResourceUrl | null>(null);
  eventId = signal<string | null>(null);
  showParticipationModal = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private participantsService: ParticipantsService,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventId.set(id);
    // Simuler un chargement depuis un service
    const events = [
      {
        id: '1',
        titleFr: 'AI & Robotique',
        titleEn: 'AI & Robotics',
        date: '12 Octobre 2021',
        descriptionFr: 'Conférence sur l\'intelligence artificielle et la robotique avec des experts Google.',
        descriptionEn: 'Conference on artificial intelligence and robotics with Google experts.',
        partner: 'Google',
        highlights: ['Présentation des dernières avancées en deep learning', 'Démonstration de robots autonomes', 'Session Q&A avec les ingénieurs Google'],
        videoUrl: 'https://www.youtube.com/watch?v=DVLzQGPV8rI',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        markedBy: [
          { id: 'm1', name: 'Camille Dupont', role: 'Étudiante', avatarUrl: 'https://i.pravatar.cc/80?img=16' },
          { id: 'm2', name: 'Hugo Petit', role: 'DevOps', avatarUrl: 'https://i.pravatar.cc/80?img=18' },
          { id: 'm3', name: 'Lea Robert', role: 'Product', avatarUrl: 'https://i.pravatar.cc/80?img=24' }
        ]
      },
      {
        id: '2',
        titleFr: 'Web & Cloud',
        titleEn: 'Web & Cloud',
        date: '5 Juin 2021',
        descriptionFr: 'Atelier de développement web et solutions cloud modernes.',
        descriptionEn: 'Workshop on web development and modern cloud solutions.',
        partner: 'Capgemini',
        highlights: ['Introduction à AWS', 'Développement d\'une application serverless', 'Bonnes pratiques de sécurité'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        markedBy: [
          { id: 'm4', name: 'Paul Nguyen', role: 'Cloud', avatarUrl: 'https://i.pravatar.cc/80?img=21' }
        ]
      },
      {
        id: '3',
        titleFr: 'DevOps & CI/CD',
        titleEn: 'DevOps & CI/CD',
        date: '15 Mars 2022',
        descriptionFr: 'Introduction aux pratiques DevOps et pipelines CI/CD.',
        descriptionEn: 'Introduction to DevOps practices and CI/CD pipelines.',
        partner: 'Engineering',
        highlights: ['Mise en place d\'un pipeline avec GitHub Actions', 'Infrastructure as Code avec Terraform', 'Monitoring et logging'],
        image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      },
      {
        id: '4',
        titleFr: 'Blockchain Day',
        titleEn: 'Blockchain Day',
        date: '20 Sept 2022',
        descriptionFr: 'Journée dédiée à la blockchain et aux cryptomonnaies.',
        descriptionEn: 'Day dedicated to blockchain and cryptocurrencies.',
        partner: 'Crypto Experts',
        highlights: ['Introduction à la blockchain', 'Smart contracts avec Solidity', 'Cas d\'usage dans la finance'],
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }
    ];
    const found = events.find(e => e.id === id);
    this.event.set(found);
    this.safeVideoUrl.set(this.toSafeVideoUrl(found?.videoUrl));
    console.log(found);
  }

  goBack() {
    this.router.navigate(['/events']);
  }

  openParticipation() {
    if (!this.eventId()) return;
    this.showParticipationModal.set(true);
  }

  closeParticipation() {
    this.showParticipationModal.set(false);
  }

  participants() {
    const list = this.participantsService.getParticipants()();
    const id = this.eventId();
    if (!id) return [];
    return list.filter(p => p.eventId === id);
  }

  private toSafeVideoUrl(url?: string | null): SafeResourceUrl | null {
    if (!url) return null;
    const embedUrl = this.toEmbedUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private toEmbedUrl(url: string): string {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');

      if (host === 'youtu.be') {
        const id = parsed.pathname.replace('/', '');
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }

      if (host === 'youtube.com' || host === 'm.youtube.com') {
        if (parsed.pathname.startsWith('/embed/')) {
          return url;
        }
        if (parsed.pathname === '/watch') {
          const id = parsed.searchParams.get('v');
          const list = parsed.searchParams.get('list');
          if (!id) return url;
          return list
            ? `https://www.youtube.com/embed/${id}?list=${encodeURIComponent(list)}`
            : `https://www.youtube.com/embed/${id}`;
        }
      }
    } catch {
      return url;
    }
    return url;
  }
}
