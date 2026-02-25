import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {LanguageService} from '../../../core/services/language.service';
import {EventDetailModalComponent} from '../../../shared/components/event-detail-modal/event-detail-modal';
import {ParticipationModalComponent} from '../../../shared/components/participation-modal/participation-modal';
import {EventsService} from '../../../core/services/events.service';
import {EventModel} from '../../../core/models/event.model';



@Component({
  selector: 'app-past-events',
  standalone: true,
  imports: [CommonModule, EventDetailModalComponent, ParticipationModalComponent, RouterLink],
  templateUrl: './past-events.html',
  styleUrl:'./past-events.scss',
})
export class PastEventsComponent implements OnInit, AfterViewInit, OnDestroy  {
  allEvents = signal<EventModel[]>([]);
  displayedEvents = signal<EventModel[]>([]);
  selectedEvent = signal<EventModel | null>(null);
  showParticipationModal = signal(false);
  selectedParticipationEvent = signal<EventModel | null>(null);
  private currentIndex = 0;
  private cleanupFns: Array<() => void> = [];
  private goFn?: (index: number) => void;
  private carouselInitialized = false;

  @ViewChild('eventsViewport') eventsViewport?: ElementRef<HTMLElement>;
  @ViewChild('eventsTrack') eventsTrack?: ElementRef<HTMLElement>;

  constructor(
    public languageService: LanguageService,
    private eventsService: EventsService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }
  async ngOnInit() {
    await this.loadEvents();
  }

  async loadEvents() {
    try {
      const events = await this.eventsService.getAllEvents();
      if (events && events.length) {
        this.allEvents.set(events);
        this.displayedEvents.set(events);
      } else {
        this.allEvents.set(this.datas);
        this.displayedEvents.set(this.datas);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      this.allEvents.set(this.datas);
      this.displayedEvents.set(this.datas);
    }

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initCarousel());
    }
  }

  openEventDetail(event: EventModel) {
    this.selectedEvent.set(event);
  }

  closeEventDetail() {
    this.selectedEvent.set(null);
  }

  goToAllEvents() {
    this.router.navigate(['/events']);
  }


  datas: EventModel[] = [
    {
      "id": "1",
      "title_fr": "AI & Robotique",
      "title_en": "AI & Robotics",
      "description_fr": "Conférence sur l'intelligence artificielle et la robotique avec des experts Google.",
      "description_en": "Conference on artificial intelligence and robotics with Google experts.",
      "date": "2025-10-12T18:30:00",
      "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      "partner": "Google",
      "location": "Belfort",
      "type": "conference",
      "link": "https://gdg.community.dev",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    },
    {
      "id": "2",
      "title_fr": "Web & Cloud",
      "title_en": "Web & Cloud",
      "description_fr": "Atelier de développement web et solutions cloud modernes.",
      "description_en": "Workshop on web development and modern cloud solutions.",
      "date": "2025-06-05T14:00:00",
      "image_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      "partner": "Capgemini",
      "location": "Sevenans",
      "type": "workshop",
      "link": "https://www.capgemini.com",
      "created_at": "2024-01-02T11:00:00Z",
      "updated_at": "2024-01-02T11:00:00Z"
    },
    {
      "id": "3",
      "title_fr": "DevOps & CI/CD",
      "title_en": "DevOps & CI/CD",
      "description_fr": "Introduction aux pratiques DevOps et pipelines CI/CD.",
      "description_en": "Introduction to DevOps practices and CI/CD pipelines.",
      "date": "2025-03-15T09:30:00",
      "image_url": "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1200&q=80",
      "partner": "Engineering",
      "location": "Belfort",
      "type": "meetup",
      "link": "https://www.utbm.fr",
      "created_at": "2024-01-03T09:00:00Z",
      "updated_at": "2024-01-03T09:00:00Z"
    }
  ];

  getEventStatus(event: EventModel): 'upcoming' | 'past' {
    if (event.status) return event.status;
    if (!event.date) return 'past';
    return new Date(event.date) >= new Date() ? 'upcoming' : 'past';
  }

  openParticipation(event: EventModel) {
    this.selectedParticipationEvent.set(event);
    this.showParticipationModal.set(true);
  }

  closeParticipation() {
    this.showParticipationModal.set(false);
    this.selectedParticipationEvent.set(null);
  }

  eventLink(event: EventModel) {
    return event.link || event.video_url || '';
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initCarousel());
    }
  }

  ngOnDestroy() {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }

  goPrev() {
    this.goFn?.(this.currentIndex - 1);
  }

  goNext() {
    this.goFn?.(this.currentIndex + 1);
  }

  private initCarousel() {
    const viewport = this.eventsViewport?.nativeElement;
    const track = this.eventsTrack?.nativeElement;
    if (!viewport || !track) return;

    const slides = Array.from(track.querySelectorAll('.event-slide')) as HTMLElement[];
    if (!slides.length) return;
    if (this.carouselInitialized) return;
    this.carouselInitialized = true;

    const getStep = () => {
      const slide = slides[0];
      const slideWidth = slide.getBoundingClientRect().width;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      return slideWidth + gap;
    };

    const applyActive = () => {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === this.currentIndex));
    };

    const go = (index: number) => {
      this.currentIndex = (index + slides.length) % slides.length;
      applyActive();

      const viewportRect = viewport.getBoundingClientRect();
      const slide = slides[this.currentIndex];
      const slideRect = slide.getBoundingClientRect();

      const slideCenter = (slideRect.left - viewportRect.left) + (slideRect.width / 2);
      const dx = slideCenter - (viewportRect.width / 2);

      const currentTransform = new DOMMatrixReadOnly(getComputedStyle(track).transform);
      let currentX = currentTransform.m41;
      let targetX = currentX - dx;

      const maxLeft = 0;
      const maxRight = viewportRect.width - track.scrollWidth;
      if (targetX > maxLeft) targetX = maxLeft;
      if (targetX < maxRight) targetX = maxRight;

      track.style.transform = `translateX(${targetX}px)`;
    };

    this.goFn = go;
    go(this.currentIndex);

    let isDragging = false;
    let pointerId: number | null = null;
    let startX = 0;
    let startTranslate = 0;
    let moved = false;

    const getTranslateX = () => {
      const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
      return m.m41 || 0;
    };

    const setTranslateX = (x: number) => {
      track.style.transform = `translateX(${x}px)`;
    };

    const clampTranslate = (x: number) => {
      const viewportW = viewport.getBoundingClientRect().width;
      const maxLeft = 0;
      const maxRight = viewportW - track.scrollWidth;
      if (x > maxLeft) x = maxLeft;
      if (x < maxRight) x = maxRight;
      return x;
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return !!target.closest('a, button, input, select, textarea, label');
    };

    const onPointerDown = (e: PointerEvent) => {
      moved = false;
      if (isInteractiveTarget(e.target)) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isDragging = true;
      pointerId = e.pointerId;
      startX = e.clientX;
      startTranslate = getTranslateX();
      track.style.transition = 'none';
      viewport.setPointerCapture(pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      const nextT = clampTranslate(startTranslate + dx);
      setTranslateX(nextT);
    };

    const finishDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 520ms cubic-bezier(.2,.8,.2,1)';

      const endTranslate = getTranslateX();
      const delta = endTranslate - startTranslate;
      const threshold = Math.min(120, viewport.getBoundingClientRect().width * 0.18);

      if (Math.abs(delta) > threshold) {
        if (delta < 0) go(this.currentIndex + 1);
        else go(this.currentIndex - 1);
      } else {
        go(this.currentIndex);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      finishDrag();
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      finishDrag();
    };

    const onClick = (e: MouseEvent) => {
      if (moved && !isInteractiveTarget(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onResize = () => go(this.currentIndex);

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerCancel);
    viewport.addEventListener('click', onClick, true);
    window.addEventListener('resize', onResize);

    this.cleanupFns.push(() => viewport.removeEventListener('pointerdown', onPointerDown));
    this.cleanupFns.push(() => viewport.removeEventListener('pointermove', onPointerMove));
    this.cleanupFns.push(() => viewport.removeEventListener('pointerup', onPointerUp));
    this.cleanupFns.push(() => viewport.removeEventListener('pointercancel', onPointerCancel));
    this.cleanupFns.push(() => viewport.removeEventListener('click', onClick, true));
    this.cleanupFns.push(() => window.removeEventListener('resize', onResize));
  }

}
