import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  AfterViewInit,
  ElementRef,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';

@Component({
  selector: 'lg-atelier-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LgNavbarComponent, LgFooterComponent],
  templateUrl: './lg-atelier-page.component.html',
  styleUrl:    './lg-atelier-page.component.scss',
})
export class LgAtelierPageComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly meta       = inject(Meta);
  private readonly title      = inject(Title);

  private readonly storySection    = viewChild<ElementRef>('storySection');
  private readonly statsSection    = viewChild<ElementRef>('statsSection');
  private readonly earthSection    = viewChild<ElementRef>('earthSection');
  private readonly artisansSection = viewChild<ElementRef>('artisansSection');
  private readonly quoteSection    = viewChild<ElementRef>('quoteSection');
  private readonly ctaSection      = viewChild<ElementRef>('ctaSection');

  constructor() {
    this.title.setTitle('The Atelier — Lugar Furniture');
    this.meta.updateTag({
      name: 'description',
      content: 'Discover the Cairo workshop behind every Lugar piece. 15 years of Egyptian craftsmanship.',
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initScrollAnimations();
  }

  private initScrollAnimations(): void {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const sections = [
          this.storySection()?.nativeElement,
          this.statsSection()?.nativeElement,
          this.earthSection()?.nativeElement,
          this.artisansSection()?.nativeElement,
          this.quoteSection()?.nativeElement,
          this.ctaSection()?.nativeElement,
        ].filter(Boolean);

        sections.forEach(el => {
          gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          });
        });

        // Stagger stat items
        gsap.from('.stat-item', {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: this.statsSection()?.nativeElement,
            start: 'top 80%',
            once: true,
          },
        });

        // Stagger artisan cards
        gsap.from('.artisan-card', {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: this.artisansSection()?.nativeElement,
            start: 'top 80%',
            once: true,
          },
        });
      });
    });
  }
}
