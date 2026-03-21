import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  signal,
  computed,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface RoomSlide {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const ROOM_SLIDES: RoomSlide[] = [
  { number: '01', title: 'The Living Suite',    subtitle: 'Living Room', description: '', imageUrl: 'room-1.png' },
  { number: '02', title: 'The Bedroom Atelier', subtitle: 'Bedroom',     description: '', imageUrl: 'room-2.jpg' },
  { number: '03', title: 'The Dining Room',     subtitle: 'Dining',      description: '', imageUrl: 'room-3.jpg' },
  { number: '04', title: 'The Home Office',     subtitle: 'Office',      description: '', imageUrl: 'room-4.jpg' },
  { number: '05', title: 'The Lounge Corner',   subtitle: 'Lounge',      description: '', imageUrl: 'room-5.jpg' },
  { number: '06', title: 'Cairo Living',        subtitle: 'Full Room',   description: '', imageUrl: 'room-6.jpg' },
];

@Component({
  selector: 'lg-room-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-room-slider.component.html',
  styleUrl: './lg-room-slider.component.scss',
})
export class LgRoomSliderComponent {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly activeIndex = signal(0);
  protected readonly slides      = signal(ROOM_SLIDES).asReadonly();

  protected readonly activeSlide = computed<RoomSlide | null>(
    () => this.slides()[this.activeIndex()] ?? null
  );

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.initGsapScroll();
    });
  }

  private initGsapScroll(): void {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to('.room__image', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: '.room',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    });
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
}
