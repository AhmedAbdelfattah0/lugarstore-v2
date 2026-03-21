import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  afterNextRender,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../shared/models/product.model';
import { CurrencyEgpPipe } from '../../../../shared/pipes/currency-egp.pipe';
import { LgButtonComponent } from '../../../../shared/components/ui/lg-button/lg-button.component';

@Component({
  selector: 'lg-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyEgpPipe, LgButtonComponent],
  templateUrl: './lg-hero.component.html',
  styleUrl: './lg-hero.component.scss',
})
export class LgHeroComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly featuredProduct = input<Product | null>(null);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.runEntranceAnimation();
    });
  }

  private runEntranceAnimation(): void {
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.from('.hero__eyebrow',  { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero__headline', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
        .from('.hero__body',     { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.hero__actions',  { opacity: 0, y: 16, duration: 0.6 }, '-=0.3')
        .from('.hero__image',    { opacity: 0, scale: 1.04, duration: 1.0 }, 0.2)
        .from('.hero__card',     { opacity: 0, y: 24, duration: 0.6 }, '-=0.4');
    });
  }
}
