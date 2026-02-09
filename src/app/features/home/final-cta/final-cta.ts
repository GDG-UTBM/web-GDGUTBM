import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {LanguageService} from '../../../core/services/language.service';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  template: `
    <section class="py-20 bg-gdg-dark text-white">
      <div class="container-custom text-center">
        <div class="max-w-3xl mx-auto space-y-8">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold">
            {{ languageService.isFrench() ? 'Prêts à rejoindre laventure ?' : 'Ready to join the adventure?' }}
          </h2>

          <p class="text-lg text-gray-300">
            {{ languageService.isFrench()
              ? 'Rejoignez notre communauté de passionnés de technologie et accédez à des événements exclusifs, du networking et des opportunités de croissance.'
              : 'Join our community of tech enthusiasts and get access to exclusive events, networking and growth opportunities.'
            }}
          </p>

          <div class="space-y-6">
            <button (click)="openJoinModal()"
                    class="bg-white text-gdg-dark hover:bg-gray-100 font-semibold text-lg px-10 py-4 rounded-r10 transition-all duration-200">
              {{ languageService.isFrench() ? 'Rejoindre la communauté' : 'Join the community' }}
            </button>

            <p class="text-sm text-gray-400">
              {{ languageService.isFrench() ? 'Rejoignez gratuitement' : 'Join for free' }}
            </p>
          </div>

          <!-- Logos partenaires -->
          <div class="pt-12 border-t border-gray-800">
            <p class="text-gray-400 mb-6">
              {{ languageService.isFrench() ? 'En partenariat avec' : 'In partnership with' }}
            </p>
            <div class="flex flex-wrap justify-center items-center gap-6 md:gap-10">
              <div class="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="assets/images/partners/google-white.svg" alt="Google" class="h-full">
              </div>
              <div class="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="assets/images/partners/gdg-white.svg" alt="GDG" class="h-full">
              </div>
              <div class="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="assets/images/partners/capgemini-white.svg" alt="Capgemini" class="h-full">
              </div>
              <div class="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="assets/images/partners/engineering-white.svg" alt="Engineering" class="h-full">
              </div>
              <div class="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="assets/images/partners/utbm-white.svg" alt="UTBM" class="h-full">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``
})
export class FinalCtaComponent{
  constructor(public languageService: LanguageService) {
  }

  openJoinModal() {
    console.log('Open join modal from final CTA');
  }
}
