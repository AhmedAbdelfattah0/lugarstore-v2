import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  PLATFORM_ID,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DrawerService } from '../../../../core/services/drawer.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { LgMobileDrawerComponent } from '../lg-mobile-drawer/lg-mobile-drawer.component';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'lg-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LgMobileDrawerComponent],
  templateUrl: './lg-navbar.component.html',
  styleUrl: './lg-navbar.component.scss',
})
export class LgNavbarComponent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly drawer = inject(DrawerService);
  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);

  protected readonly scrolled = signal(false);

  protected readonly navLinks: NavLink[] = [
    { label: 'Collections', route: '/products' },
    { label: 'Living',      route: '/products?category=living' },
    { label: 'Bedroom',     route: '/products?category=bedroom' },
    { label: 'Dining',      route: '/products?category=dining' },
    { label: 'About',       route: '/about' },
  ];

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.initScrollBehavior();
    });
  }

  private initScrollBehavior(): void {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      import('gsap').then(({ gsap }) => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
          start: 'top -80',
          onEnter: () => this.scrolled.set(true),
          onLeaveBack: () => this.scrolled.set(false),
        });
      });
    });
  }
}
