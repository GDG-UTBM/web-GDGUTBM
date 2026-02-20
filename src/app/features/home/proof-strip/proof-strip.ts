import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';

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
  constructor(public languageService: LanguageService, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startCounters();
    } else {
      // Pour le SSR, on met directement la valeur cible
      this.membersCount.set(this.targetMembers);
      this.eventsCount.set(this.targetEvents);
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
