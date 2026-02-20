import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { EventModel } from '../../../core/models/event.model';
import { EventsService } from '../../../core/services/events.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-detail-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail-modal.html',
  styleUrls: ['./event-detail-modal.scss']
})
export class EventDetailModalComponent implements OnChanges {
  @Input() eventId!: string;
  @Output() close = new EventEmitter<void>();

  event = signal<EventModel | null>(null);
  safeVideoUrl = signal<SafeResourceUrl | null>(null);
  isLoading = signal(false);

  constructor(
    public languageService: LanguageService,
    private eventsService: EventsService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventId']) {
      this.loadEvent();
    }
  }

  async loadEvent() {
    if (!this.eventId) return;
    this.isLoading.set(true);
    try {
      const data = await this.eventsService.getEvent(this.eventId);
      this.event.set(data);
      this.safeVideoUrl.set(this.toSafeVideoUrl(data?.video_url || null));
    } catch (error) {
      console.error('Error loading event detail:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  eventStatus() {
    const ev = this.event();
    if (!ev?.date) return 'past';
    if (ev.status) return ev.status;
    return new Date(ev.date) >= new Date() ? 'upcoming' : 'past';
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
        if (parsed.pathname.startsWith('/embed/')) return url;
        if (parsed.pathname === '/watch') {
          const id = parsed.searchParams.get('v');
          if (!id) return url;
          return `https://www.youtube.com/embed/${id}`;
        }
      }
    } catch {
      return url;
    }
    return url;
  }
}
