import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ParticipantsService, EventParticipant } from '../../../core/services/participants.service';
import { ParticipationModalComponent } from '../../../shared/components/participation-modal/participation-modal';
import { EventsService } from '../../../core/services/events.service';
import { EventModel } from '../../../core/models/event.model';
import { EventMarksService, EventMark } from '../../../core/services/event-marks.service';
import { AuthService } from '../../../core/services/auth.service';
import { SiteFooterComponent } from '../../../shared/components/site-footer/site-footer';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ParticipationModalComponent, SiteFooterComponent],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.scss']
})
export class EventDetailComponent implements OnInit {
  event = signal<EventModel | null>(null);
  safeVideoUrl = signal<SafeResourceUrl | null>(null);
  eventId = signal<string | null>(null);
  showParticipationModal = signal(false);
  participantsList = signal<EventParticipant[]>([]);
  marksList = signal<EventMark[]>([]);
  isMarkedByUser = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private eventsService: EventsService,
    private participantsService: ParticipantsService,
    private marksService: EventMarksService,
    private authService: AuthService,
    public languageService: LanguageService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.eventId.set(id);
    if (!id) return;
    try {
      const found = await this.eventsService.getEvent(id);
      this.event.set(found);
      this.safeVideoUrl.set(this.toSafeVideoUrl(found?.video_url || null));
    } catch (error) {
      console.error('Error loading event:', error);
    }

    await this.loadParticipants();
    await this.loadMarks();
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

  async loadParticipants() {
    const id = this.eventId();
    if (!id) return;
    try {
      const list = await this.participantsService.loadByEvent(id);
      this.participantsList.set(list.filter(p => p.status === 'approved'));
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  }

  participants() {
    return this.participantsList();
  }

  async loadMarks() {
    const id = this.eventId();
    if (!id) return;
    try {
      const list = await this.marksService.loadByEvent(id);
      this.marksList.set(list);
      const user = this.authService.getUser()();
      this.isMarkedByUser.set(!!user && list.some(m => m.user_id === user.id));
    } catch (error) {
      console.error('Error loading marks:', error);
    }
  }

  marks() {
    return this.marksList();
  }

  async toggleMark() {
    const id = this.eventId();
    if (!id) return;
    const user = this.authService.getUser()();
    if (!user) {
      alert(this.languageService.isFrench() ? 'Connectez-vous pour marquer un événement.' : 'Sign in to mark an event.');
      return;
    }
    try {
      if (this.isMarkedByUser()) {
        await this.marksService.unmarkEvent(id);
      } else {
        await this.marksService.markEvent(id);
      }
      await this.loadMarks();
    } catch (error) {
      console.error('Error toggling mark:', error);
    }
  }

  eventStatus() {
    const ev = this.event();
    if (!ev?.date) return 'past';
    if (ev.status) return ev.status;
    return new Date(ev.date) >= new Date() ? 'upcoming' : 'past';
  }

  eventLink() {
    const ev = this.event();
    return ev?.link || ev?.video_url || '';
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
