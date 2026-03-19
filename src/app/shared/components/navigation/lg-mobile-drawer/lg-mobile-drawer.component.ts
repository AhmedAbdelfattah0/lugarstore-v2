import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DrawerService } from '../../../../core/services/drawer.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';

interface NavLink {
  label: string;
  route: string;
}

@Component({
  selector: 'lg-mobile-drawer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './lg-mobile-drawer.component.html',
  styleUrl: './lg-mobile-drawer.component.scss',
})
export class LgMobileDrawerComponent {
  protected readonly drawer = inject(DrawerService);
  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);

  protected readonly navLinks: NavLink[] = [
    { label: 'Collections', route: '/products' },
    { label: 'Living',      route: '/products?category=living' },
    { label: 'Bedroom',     route: '/products?category=bedroom' },
    { label: 'Dining',      route: '/products?category=dining' },
    { label: 'About',       route: '/about' },
  ];

  protected readonly socials = [
    { label: 'Instagram', icon: 'instagram', href: 'https://instagram.com/lugarfurniture' },
    { label: 'Facebook',  icon: 'facebook',  href: 'https://facebook.com/lugarfurniture' },
    { label: 'TikTok',    icon: 'tiktok',    href: 'https://tiktok.com/@lugarfurniture' },
    { label: 'WhatsApp',  icon: 'whatsapp',  href: 'https://wa.me/201234567890' },
  ];

  close(): void {
    this.drawer.close();
  }
}
