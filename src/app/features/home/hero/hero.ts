import {Component, OnInit} from '@angular/core';
import {LanguageService} from '../../../core/services/language.service';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `
    <section class="section-spacing bg-gradient-to-b from-gdg-bg to-white">
      <div class="container-custom">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Texte à gauche -->
          <div class="space-y-6 animate-fade-in">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {{ languageService.isFrench() ? 'Un point d ancrage pour évoluer dans la tech' : 'A hub to grow in tech' }}
            </h1>

            <p class="text-lg md:text-xl text-gdg-muted leading-relaxed">
              {{ languageService.isFrench()
              ? 'Événements, rencontres et échanges entre étudiants, ingénieurs et acteurs de la tech.'
              : 'Events, meetings and exchanges between students, engineers and tech professionals.'
              }}
            </p>

            <div class="space-y-4">
              <button (click)="openJoinModal()" class="btn-primary text-lg px-8 py-4">
                {{ languageService.isFrench() ? 'Rejoindre la communauté' : 'Join the community' }}
              </button>

              <p class="text-sm text-gdg-muted">
                {{ languageService.isFrench()
                ? 'Accès aux événements, échanges et opportunités tech locales.'
                : 'Access to local tech events, exchanges and opportunities.'
                }}
              </p>
            </div>
          </div>

          <!-- Image à droite -->
          <div class="relative animate-scale-in">
            <div class="relative rounded-r24 overflow-hidden shadow-2xl">
              <div class="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span class="text-white text-4xl font-bold">GDG UTBM</span>
              </div>
            </div>

            <!-- Badge ou élément décoratif -->
            <div class="absolute -top-4 -right-4 bg-gdg-blue text-white px-4 py-2 rounded-r10 shadow-lg">
              <span class="font-semibold">300+ {{ languageService.isFrench() ? 'membres' : 'members' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class HeroComponent{

  constructor(public languageService: LanguageService) {
  }




  openJoinModal() {
    console.log('Open join modal from hero');
  }
}
