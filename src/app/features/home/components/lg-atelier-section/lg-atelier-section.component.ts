import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  afterNextRender,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LgButtonComponent } from '../../../../shared/components/ui/lg-button/lg-button.component';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

@Component({
  selector: 'lg-atelier-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LgButtonComponent],
  templateUrl: './lg-atelier-section.component.html',
  styleUrl: './lg-atelier-section.component.scss',
})
export class LgAtelierSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly stats: Stat[] = [
    { value: 15,  suffix: '+', label: 'Years of Craft' },
    { value: 500, suffix: '+', label: 'Bespoke Works' },
    { value: 3,   suffix:  '', label: 'Cairo Showrooms' },
  ];

  protected readonly displayValues = signal<number[]>(this.stats.map(() => 0));

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.initScrollCounter();
    });
  }

  private initScrollCounter(): void {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.create({
          trigger: '.atelier__stats',
          start: 'top 75%',
          onEnter: () => this.animateCounters(),
          once: true,
        });

        // Reveal animation
        gsap.from('.atelier__text', {
          opacity: 0,
          x: 40,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.atelier',
            start: 'top 70%',
          },
        });

        gsap.from('.atelier__image-wrap', {
          opacity: 0,
          x: -40,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.atelier',
            start: 'top 70%',
          },
        });
      });
    });
  }

  private animateCounters(): void {
    this.stats.forEach((stat, i) => {
      const duration = 1800;
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * stat.value);
        this.displayValues.update(vals => {
          const next = [...vals];
          next[i] = current;
          return next;
        });
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
}
