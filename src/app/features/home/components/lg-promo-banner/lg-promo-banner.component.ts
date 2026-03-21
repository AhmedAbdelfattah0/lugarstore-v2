import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  signal,
  computed,
  OnDestroy,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LgButtonComponent } from '../../../../shared/components/ui/lg-button/lg-button.component';

interface EditorialSlide {
  imageUrl: string;
  eyebrow: string;
  heading: string;
  subtext: string;
  description: string;
  cta: string;
  ctaRoute: string;
}

const SLIDES: EditorialSlide[] = [
  {
    imageUrl:    'room-1.png',
    eyebrow:     'SEASONAL SALE',
    heading:     "The Artisan's Archive",
    subtext:     'Up to 40% off select models',
    description: 'Each archived piece holds the same standard of Cairo craftsmanship, now offered with a rare privilege.',
    cta:         'Shop The Sale',
    ctaRoute:    '/hot-deals',
  },
  {
    imageUrl:    'room-3.jpg',
    eyebrow:     'NEW COLLECTION',
    heading:     'Living Spaces, Crafted With Soul',
    subtext:     'Bespoke furniture for the modern Egyptian home',
    description: 'Discover our latest pieces — each one designed in Cairo and built to outlast trends.',
    cta:         'Explore Collection',
    ctaRoute:    '/products',
  },
  {
    imageUrl:    'room-6.jpg',
    eyebrow:     'BESPOKE ORDERS',
    heading:     'Your Vision, Our Craft',
    subtext:     'Commission a piece built around your space',
    description: 'Work directly with our Cairo atelier to create furniture that is entirely yours.',
    cta:         'Commission a Piece',
    ctaRoute:    '/custom-order',
  },
];

@Component({
  selector: 'lg-promo-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LgButtonComponent],
  templateUrl: './lg-promo-banner.component.html',
  styleUrl: './lg-promo-banner.component.scss',
})
export class LgPromoBannerComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly activeIndex = signal(0);
  protected readonly paused      = signal(false);
  protected readonly slides      = signal(SLIDES).asReadonly();

  protected readonly activeSlide = computed(() => this.slides()[this.activeIndex()]);

  protected readonly dotsArray = computed(() =>
    Array.from({ length: this.slides().length }, (_, i) => i)
  );

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.startAutoPlay();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  private startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      if (!this.paused()) this.next();
    }, 6000);
  }

  private stopAutoPlay(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  protected next(): void {
    this.activeIndex.update(i => (i + 1) % this.slides().length);
  }

  protected prev(): void {
    this.activeIndex.update(i => (i - 1 + this.slides().length) % this.slides().length);
  }

  protected goTo(index: number): void {
    this.activeIndex.set(index);
  }

  protected onMouseEnter(): void { this.paused.set(true); }
  protected onMouseLeave(): void { this.paused.set(false); }
}
