import {AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {RouterLink} from '@angular/router';
import {LanguageService} from '../../../core/services/language.service';
import {AuthService} from '../../../core/services/auth.service';
import {JoinModalComponent} from '../../../shared/components/join-modal/join-modal';
import {TopicModalComponent} from '../../../shared/components/topic-modal/topic-modal';
import {ElementRef} from '@angular/core';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    JoinModalComponent,
    TopicModalComponent
  ],
  templateUrl: 'hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  showJoinModal = signal(false);
  showTopicModal = signal(false);
  private slideInterval?: number;
  private rafId?: number;

  constructor(
    public languageService: LanguageService,
    public authService: AuthService,
    private host: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  openJoinModal() {
    this.showJoinModal.set(true);
  }
  openTopicModal() {
    this.showTopicModal.set(true);
  }

  closeJoinModal() {
    this.showJoinModal.set(false);
  }

  closeTopicModal() {
    this.showTopicModal.set(false);
  }

  onRegisterSuccess() {
    // hook for future behavior; keep modal flow consistent with header
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initHeroSlider();
    this.initFloatingShapes();
  }

  ngOnDestroy() {
    if (this.slideInterval) window.clearInterval(this.slideInterval);
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  private initHeroSlider() {
    const root = this.host.nativeElement as HTMLElement;
    const slides = Array.from(root.querySelectorAll('.hero-slide')) as HTMLElement[];
    if (!slides.length) return;

    let index = slides.findIndex((s) => s.classList.contains('is-active'));
    if (index < 0) index = 0;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));

    this.slideInterval = window.setInterval(() => {
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }, 6500);
  }

  private initFloatingShapes() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const root = this.host.nativeElement as HTMLElement;
    const shapes = Array.from(root.querySelectorAll('.hero-float .gshape')) as HTMLElement[];
    if (!shapes.length) return;

    const params = shapes.map((el, idx) => {
      const ax = 10 + (idx % 3) * 4;
      const ay = 12 + ((idx + 1) % 4) * 3;
      const sx = 0.00055 + idx * 0.00007;
      const sy = 0.00062 + idx * 0.00006;
      const px = (idx * 1.7) % (Math.PI * 2);
      const py = (idx * 2.3) % (Math.PI * 2);
      const rot = 1.2 + (idx % 3) * 0.4;
      return { el, ax, ay, sx, sy, px, py, rot };
    });

    const animate = (t: number) => {
      for (const p of params) {
        const x =
          p.ax * Math.sin(t * p.sx + p.px) +
          (p.ax * 0.35) * Math.sin(t * (p.sx * 1.9) + p.py);

        const y =
          p.ay * Math.sin(t * p.sy + p.py) +
          (p.ay * 0.35) * Math.sin(t * (p.sy * 1.7) + p.px);
        const r = p.rot * Math.sin(t * (p.sy * 0.9) + p.px);

        p.el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg)`;
      }

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }
}
