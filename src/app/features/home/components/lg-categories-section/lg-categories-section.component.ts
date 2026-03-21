import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  input,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../../../shared/models/category.model';
import { LgSectionHeaderComponent } from '../../../../shared/components/layout/lg-section-header/lg-section-header.component';

@Component({
  selector: 'lg-categories-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LgSectionHeaderComponent],
  templateUrl: './lg-categories-section.component.html',
  styleUrl: './lg-categories-section.component.scss',
})
export class LgCategoriesSectionComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly categories = input.required<Category[]>();

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.initScrollReveal();
    });
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'room-1.png';
  }

  private initScrollReveal(): void {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        document.querySelectorAll('.cat-row').forEach((row, i) => {
          gsap.from(row, {
            opacity: 0,
            x: i % 2 === 0 ? -40 : 40,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
            },
          });
        });
      });
    });
  }
}
