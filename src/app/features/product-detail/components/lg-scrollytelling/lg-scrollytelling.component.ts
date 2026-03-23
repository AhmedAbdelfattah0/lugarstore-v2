import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  PLATFORM_ID,
  inject,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../shared/models';
import { LgProductCardComponent } from '../../../../shared/components/product/lg-product-card/lg-product-card.component';
import { getLifestyleImages } from '../../data/category-lifestyle-images';

@Component({
  selector: 'lg-scrollytelling',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    LgProductCardComponent,
  ],
  templateUrl: './lg-scrollytelling.component.html',
  styleUrl: './lg-scrollytelling.component.scss',
})
export class LgScrollytellingComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly relatedProducts = input.required<Product[]>();
  readonly categoryId      = input<number>(0);

  protected readonly lifestyleImage = computed(() =>
    getLifestyleImages(this.categoryId()).lifestyle
  );

  protected readonly craftImage = computed(() =>
    getLifestyleImages(this.categoryId()).craft
  );

  readonly addRelatedToCart     = output<Product>();
  readonly addRelatedToWishlist = output<Product>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Lazy-import GSAP + ScrollTrigger only in the browser
    import('gsap').then(({ gsap }) =>
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        const fadeUp = (selector: string): void => {
          gsap.from(selector, {
            opacity: 0,
            y: 40,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: selector,
              start: 'top 85%',
            },
          });
        };

        fadeUp('.scrolly__lifestyle');
        fadeUp('.scrolly__craft');
        fadeUp('.scrolly__related');
      }),
    );
  }
}
