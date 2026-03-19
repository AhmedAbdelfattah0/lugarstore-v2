import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  inject,
} from '@angular/core';

import { Product } from '../../../models/product.model';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { LgBadgeComponent, BadgeVariant } from '../../ui/lg-badge/lg-badge.component';
import { CurrencyEgpPipe } from '../../../pipes/currency-egp.pipe';

export type CardVariant = 'default' | 'featured' | 'compact';

@Component({
  selector: 'lg-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgBadgeComponent, CurrencyEgpPipe],
  templateUrl: './lg-product-card.component.html',
  styleUrl: './lg-product-card.component.scss',
})
export class LgProductCardComponent {
  readonly product = input.required<Product>();
  readonly variant = input<CardVariant>('default');

  readonly addToCart     = output<Product>();
  readonly addToWishlist = output<Product>();

  private readonly wishlistService = inject(WishlistService);

  protected readonly isWishlisted = computed(() =>
    this.wishlistService.ids().includes(this.product().id),
  );

  protected readonly secondaryImage = computed(() =>
    this.product().images[1] ?? null,
  );

  protected readonly activeBadge = computed<BadgeVariant | null>(() => {
    const p = this.product();
    if (p.isOutOfStock) return 'out-of-stock';
    if (p.hasDiscount)  return 'discount';
    if (p.isNew)        return 'new';
    if (p.isTop)        return 'top';
    return null;
  });

  protected readonly discountLabel = computed(() =>
    `-${this.product().discount}%`,
  );

  protected onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product());
  }

  protected onWishlistToggle(event: Event): void {
    event.stopPropagation();
    this.addToWishlist.emit(this.product());
  }
}
