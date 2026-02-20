import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';
import {UsersService} from '../../../core/services/users.service';
import {EventsService} from '../../../core/services/events.service';

@Component({
  selector: 'app-proof-strip',
  standalone: true,
  templateUrl: 'proof-strip.html',
  styles: ``
})
export class ProofStripComponent implements OnInit  {
  membersCount = signal(0);
  eventsCount = signal(0);
  private targetMembers = 30;
  private targetEvents = 3;
  constructor(
    public languageService: LanguageService,
    private usersService: UsersService,
    private eventsService: EventsService,
    @Inject(PLATFORM_ID) private platformId: Object
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
}
