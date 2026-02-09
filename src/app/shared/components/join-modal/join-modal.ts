import { Component, signal, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         (click)="closeModal()">
      <div class="bg-white rounded-r16 w-full max-w-md p-6 animate-scale-in"
           (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">
            {{ isFrench() ? 'Rejoindre la communauté' : 'Join the community' }}
          </h3>
          <button (click)="closeModal()" class="text-gdg-muted hover:text-gdg-text">
            ✕
          </button>
        </div>

        <!-- Formulaire simplifié -->
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gdg-text mb-1">
              {{ isFrench() ? 'Nom complet' : 'Full name' }}
            </label>
            <input type="text"
                   class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
          </div>

          <div>
            <label class="block text-sm font-medium text-gdg-text mb-1">
              Email
            </label>
            <input type="email"
                   class="w-full border border-gdg-line rounded-r4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gdg-blue">
          </div>

          <div class="pt-4">
            <button type="submit" class="btn-primary w-full">
              {{ isFrench() ? 'Créer un compte' : 'Create account' }}
            </button>
          </div>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gdg-line"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gdg-muted">
                {{ isFrench() ? 'Ou continuer avec' : 'Or continue with' }}
              </span>
            </div>
          </div>

          <button type="button"
                  class="w-full flex items-center justify-center space-x-2 border border-gdg-line hover:bg-gdg-bg rounded-r4 px-4 py-3 transition-colors">
            <img src="assets/icons/google.svg" alt="Google" class="w-5 h-5">
            <span>{{ isFrench() ? 'Continuer avec Google' : 'Continue with Google' }}</span>
          </button>
        </form>

        <p class="text-xs text-gdg-muted mt-6 text-center">
          {{ isFrench()
            ? 'En vous inscrivant, vous acceptez nos conditions d\'utilisation et notre politique de confidentialité.'
            : 'By signing up, you agree to our Terms of Service and Privacy Policy.'
          }}
        </p>
      </div>
    </div>
  `,
  styles: ``
})
export class JoinModalComponent {
  @Output() close = new EventEmitter<void>();
  isFrench = signal(localStorage.getItem('gdg-language') !== 'en');

  closeModal() {
    this.close.emit();
  }
}
