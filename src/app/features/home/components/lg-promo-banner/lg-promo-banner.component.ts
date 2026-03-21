import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  input,
  signal,
  computed,
  OnDestroy,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Banner } from '../../../../shared/models/banner.model';

@Component({
  selector: 'lg-promo-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './lg-promo-banner.component.html',
  styleUrl: './lg-promo-banner.component.scss',
})
export class LgPromoBannerComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  readonly banners = input<Banner[]>([]);

  protected readonly activeIndex = signal(0);
  protected readonly paused      = signal(false);

  protected readonly activeBanner = computed(() => {
    const list = this.banners();
    return list.length > 0 ? list[this.activeIndex()] : null;
  });

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
    }, 5000);
  }

  private stopAutoPlay(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  protected next(): void {
    const len = this.banners().length;
    if (len === 0) return;
    this.activeIndex.update(i => (i + 1) % len);
  }

  protected prev(): void {
    const len = this.banners().length;
    if (len === 0) return;
    this.activeIndex.update(i => (i - 1 + len) % len);
  }

  protected goTo(index: number): void {
    this.activeIndex.set(index);
  }

  protected onMouseEnter(): void {
    this.paused.set(true);
  }

  protected onMouseLeave(): void {
    this.paused.set(false);
  }

  // Fallback static slides when no API banners
  protected readonly staticSlides = [
    {
      eyebrow: 'The Artisan\'s Archive',
      headline: 'Up to 40% Off',
      body: 'Selected pieces from our master craftsmen. Limited quantities, permanent quality.',
      cta: 'Shop The Sale',
      ctaRoute: '/hot-deals',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700',
    },
    {
      eyebrow: 'New Collection',
      headline: 'Desert Moderne',
      body: 'Where ancient Egyptian craft meets contemporary living. Arriving this season.',
      cta: 'Preview Collection',
      ctaRoute: '/products',
      imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=700',
    },
    {
      eyebrow: 'Bespoke Services',
      headline: 'Commission Your Vision',
      body: 'Every home has a story waiting to be told. Let our artisans craft yours.',
      cta: 'Start Your Order',
      ctaRoute: '/custom-order',
      imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700',
    },
  ];

  protected readonly activeSlide = computed(() => {
    const bannerList = this.banners();
    if (bannerList.length > 0) return null; // Use API banners
    return this.staticSlides[this.activeIndex() % this.staticSlides.length];
  });

  protected readonly slideCount = computed(() => {
    const len = this.banners().length;
    return len > 0 ? len : this.staticSlides.length;
  });

  protected readonly dots = computed(() =>
    Array.from({ length: this.slideCount() }, (_, i) => i)
  );
}
