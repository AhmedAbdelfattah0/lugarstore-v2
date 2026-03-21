import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  signal,
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

  protected readonly slides: RoomSlide[] = [
    {
      number:      '01',
      title:       'The Desert Suite',
      subtitle:    'Living Room',
      description: 'Warm tones and natural textures inspired by Egyptian landscapes. Every piece tells a story of craft and heritage.',
      imageUrl:    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200',
    },
    {
      number:      '02',
      title:       'A Giza Morning',
      subtitle:    'Bedroom',
      description: 'Wake up to effortless luxury. Our bedroom collections blend comfort with artisanal precision.',
      imageUrl:    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
    },
    {
      number:      '03',
      title:       'Nile Terrace',
      subtitle:    'Dining Room',
      description: 'Gather around masterfully crafted tables. Every dinner becomes a ceremony of elegance.',
      imageUrl:    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200',
    },
    {
      number:      '04',
      title:       'The Scholar\'s Study',
      subtitle:    'Home Office',
      description: 'Productivity meets beauty. Our office pieces are designed for those who demand the best.',
      imageUrl:    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200',
    },
    {
      number:      '05',
      title:       'Oasis Lounge',
      subtitle:    'Outdoor',
      description: 'Extend your living space outdoors. Weather-resistant pieces that never compromise on design.',
      imageUrl:    'https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab8?w=1200',
    },
    {
      number:      '06',
      title:       'The Curator\'s Corner',
      subtitle:    'Accent',
      description: 'The finishing touches that transform a room into a curated experience.',
      imageUrl:    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200',
    },
  ];

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

        gsap.to('.room__image--active', {
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
    this.activeIndex.update(i => (i + 1) % this.slides.length);
  }

  protected prev(): void {
    this.activeIndex.update(i => (i - 1 + this.slides.length) % this.slides.length);
  }

  protected goTo(index: number): void {
    this.activeIndex.set(index);
  }

  protected get activeSlide(): RoomSlide {
    return this.slides[this.activeIndex()];
  }
}
