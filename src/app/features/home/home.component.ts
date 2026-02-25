import { Component } from '@angular/core';
import {HeroComponent} from './hero/hero';
import {ProofStripComponent} from './proof-strip/proof-strip';
import {WhatWeDoComponent} from './what-we-do/what-we-do';
import {PastEventsComponent} from './past-events/past-events';
import {FinalCtaComponent} from './final-cta/final-cta';
import {WhyJoinComponent} from './why-join/why-join';
import {SiteFooterComponent} from '../../shared/components/site-footer/site-footer';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ProofStripComponent,
    WhatWeDoComponent,
    PastEventsComponent,
    WhyJoinComponent,
    FinalCtaComponent,
    SiteFooterComponent

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

      <!-- Why Join Section -->
      <app-why-join class="block"></app-why-join>

      <!-- Final CTA Section -->
      <app-final-cta class="block"></app-final-cta>

      <!-- Footer -->
      <app-site-footer class="block"></app-site-footer>
    </div>
  `,
  styles: ``
})
export class HomeComponent {}
