import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';

@Component({
  selector: 'app-proof-strip',
  standalone: true,
  template: `
    <section class="py-12 bg-gdg-surface border-y border-gdg-line">
      <div class="container-custom">
        <!-- Logos partenaires -->
        <div class="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-12">
          <div class="h-8 md:h-10">
            <img src="assets/images/partners/google.svg" alt="Google" class="h-full opacity-70 hover:opacity-100 transition-opacity">
          </div>
          <div class="h-8 md:h-10">
            <img src="assets/images/partners/gdg.svg" alt="GDG" class="h-full opacity-70 hover:opacity-100 transition-opacity">
          </div>
          <div class="h-8 md:h-10">
            <img src="assets/images/partners/capgemini.svg" alt="Capgemini" class="h-full opacity-70 hover:opacity-100 transition-opacity">
          </div>
          <div class="h-8 md:h-10">
            <img src="assets/images/partners/engineering.svg" alt="Engineering" class="h-full opacity-70 hover:opacity-100 transition-opacity">
          </div>
          <div class="h-8 md:h-10">
            <img src="assets/images/partners/utbm.svg" alt="UTBM" class="h-full opacity-70 hover:opacity-100 transition-opacity">
          </div>
        </div>

        <!-- Chiffres clés -->
        <div class="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-gdg-blue mb-2">300+</div>
            <p class="text-gdg-muted">
              {{ languageService.isFrench() ? 'membres actifs' : 'active members' }}
            </p>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-gdg-blue mb-2">8+</div>
            <p class="text-gdg-muted">
              {{ languageService.isFrench() ? 'événements organisés' : 'events hosted' }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class ProofStripComponent  {
  constructor(public languageService: LanguageService) {
  }
}
