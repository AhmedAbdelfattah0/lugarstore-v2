import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CartItem } from '../../../../shared/models';
import { CurrencyEgpPipe } from '../../../../shared/pipes/currency-egp.pipe';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgEmptyStateComponent } from '../../../../shared/components/feedback/lg-empty-state/lg-empty-state.component';
import { LgDividerComponent } from '../../../../shared/components/ui/lg-divider/lg-divider.component';

@Component({
  selector: 'lg-wishlist-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LgNavbarComponent,
    LgFooterComponent,
    CurrencyEgpPipe,
    LgEmptyStateComponent,
    LgDividerComponent,
  ],
  templateUrl: './lg-wishlist-page.component.html',
  styleUrl: './lg-wishlist-page.component.scss',
})
export class LgWishlistPageComponent {
  private readonly router   = inject(Router);
  private readonly meta     = inject(Meta);
  private readonly title    = inject(Title);
  protected readonly wishlist = inject(WishlistService);
  protected readonly cart     = inject(CartService);
  private readonly toast    = inject(ToastService);

  readonly items      = this.wishlist.items;
  readonly totalValue = this.wishlist.totalValue;

  readonly pieceLabel = computed(() => {
    const n = this.wishlist.count();
    return n === 1 ? '1 piece saved' : `${n} pieces saved`;
  });

  constructor() {
    this.title.setTitle('Saved Pieces — Lugar Furniture');
    this.meta.updateTag({ name: 'description', content: 'Your curated collection of saved Lugar Furniture pieces.' });
  }

  onMoveToBag(item: CartItem): void {
    this.cart.add({ ...item, qty: 1 });
    this.wishlist.remove(item.id);
    this.toast.show(`${item.title} moved to bag`, 'success');
  }

  onRemove(item: CartItem): void {
    this.wishlist.remove(item.id);
    this.toast.show(`${item.title} removed from wishlist`, 'wishlist');
  }

  onMoveAllToBag(): void {
    const items = this.items();
    items.forEach(item => this.cart.add({ ...item, qty: 1 }));
    this.wishlist.clear();
    this.toast.show('All pieces moved to bag', 'success');
    this.router.navigate(['/cart']);
  }

  onContinueShopping(): void {
    this.router.navigate(['/products']);
  }
}
