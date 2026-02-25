import {AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';
import {UsersService} from '../../../core/services/users.service';
import {EventsService} from '../../../core/services/events.service';

@Component({
  selector: 'app-proof-strip',
  standalone: true,
  templateUrl: 'proof-strip.html',
  styleUrls: ['./proof-strip.scss']
})
export class ProofStripComponent implements OnInit, AfterViewInit, OnDestroy  {
  membersCount = signal(0);
  eventsCount = signal(0);
  private targetMembers = 30;
  private targetEvents = 3;
  private partnerTimer?: number;

  constructor(
    public languageService: LanguageService,
    private usersService: UsersService,
    private eventsService: EventsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private host: ElementRef
  ) {
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadCounts();
      this.startCounters();
    } else {
      // Pour le SSR, on met directement la valeur cible
      this.membersCount.set(this.targetMembers);
      this.eventsCount.set(this.targetEvents);
    }
  }

  private async loadCounts() {
    try {
      const users = await this.usersService.getAllUsers();
      const events = await this.eventsService.getAllEvents();
      this.targetMembers = users?.length || this.targetMembers;
      this.targetEvents = events?.length || this.targetEvents;
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  }

  private startCounters() {
    const duration = 4000; // 2 secondes
    const stepTime = 30; // ms
    const steps = duration / stepTime;
    const membersStep = this.targetMembers / steps;
    const eventsStep = this.targetEvents / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        this.membersCount.set(this.targetMembers);
        this.eventsCount.set(this.targetEvents);
        clearInterval(interval);
      } else {
        this.membersCount.set(Math.floor(membersStep * currentStep));
        this.eventsCount.set(Math.floor(eventsStep * currentStep));
      }
    }, stepTime);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initPartnersCarousel();
    }
  }

  ngOnDestroy() {
    if (this.partnerTimer) {
      window.clearInterval(this.partnerTimer);
    }
  }

  private initPartnersCarousel() {
    const root = this.host.nativeElement as HTMLElement;
    const track = root.querySelector('#partnersTrack') as HTMLElement | null;
    const link = root.querySelector('.proof-partner-link') as HTMLAnchorElement | null;
    const nameEl = root.querySelector('.proof-partner-name') as HTMLElement | null;
    const section = root.querySelector('.proof-partners-section') as HTMLElement | null;

    if (!track || !link || !nameEl) return;
    const items = Array.from(track.querySelectorAll('.partner')) as HTMLElement[];
    if (!items.length) return;

    let index = 0;
    const stepMs = 3200;

    const setActive = (i: number) => {
      section?.classList.add('is-switching');

      window.setTimeout(() => {
        items.forEach((el) => el.classList.remove('is-active'));
        const el = items[i];
        el.classList.add('is-active');

        const nm = el.getAttribute('data-name') || 'Partenaire';
        const url = el.getAttribute('data-url') || '#';

        nameEl.textContent = nm;
        link.href = url;
        link.setAttribute('aria-label', `Visiter le site de ${nm}`);

        section?.classList.remove('is-switching');
      }, 120);
    };

    items.forEach((el, i) => {
      el.addEventListener('click', () => {
        index = i;
        setActive(index);
        restart();
      });
    });

    const tick = () => {
      index = (index + 1) % items.length;
      setActive(index);
    };

    const restart = () => {
      if (this.partnerTimer) window.clearInterval(this.partnerTimer);
      this.partnerTimer = window.setInterval(tick, stepMs);
    };

    setActive(index);
    restart();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.partnerTimer) window.clearInterval(this.partnerTimer);
        this.partnerTimer = undefined;
      } else {
        restart();
      }
    });
  }
}
