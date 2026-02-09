import { Component } from '@angular/core';
import {HeroComponent} from './hero/hero';
import {ProofStripComponent} from './proof-strip/proof-strip';
import {WhatWeDoComponent} from './what-we-do/what-we-do';
import {PastEventsComponent} from './past-events/past-events';
import {FinalCtaComponent} from './final-cta/final-cta';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ProofStripComponent,
    WhatWeDoComponent,
    PastEventsComponent,
    FinalCtaComponent

  ],
  template: `
    <div class="min-h-screen bg-gdg-bg">
      <!-- Hero Section -->
      <app-hero class="block"></app-hero>

      <!-- Proof Strip Section -->
      <app-proof-strip class="block"></app-proof-strip>

      <!-- What We Do Section -->
      <app-what-we-do class="block"></app-what-we-do>

      <!-- Past Events Section -->
      <app-past-events class="block"></app-past-events>

      <!-- Final CTA Section -->
      <app-final-cta class="block"></app-final-cta>
    </div>
  `,
  styles: ``
})
export class HomeComponent {}
