import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title, Meta } from '@angular/platform-browser';

import { PlpStateService } from '../../services/plp-state.service';
import { FilterStateService } from '../../services/filter-state.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../shared/models';

import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgPlpHeaderComponent } from '../../components/lg-plp-header/lg-plp-header.component';
import { LgFilterBarComponent } from '../../../../shared/components/filtering/lg-filter-bar/lg-filter-bar.component';

import { LgProductCardComponent } from '../../../../shared/components/product/lg-product-card/lg-product-card.component';
import { LgSpinnerComponent } from '../../../../shared/components/ui/lg-spinner/lg-spinner.component';
import { LgEmptyStateComponent } from '../../../../shared/components/feedback/lg-empty-state/lg-empty-state.component';
import { LgPaginationComponent } from '../../../../shared/components/filtering/lg-pagination/lg-pagination.component';

@Component({
  selector: 'lg-products-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    LgNavbarComponent,
    LgFooterComponent,
    LgPlpHeaderComponent,
    LgFilterBarComponent,

    LgProductCardComponent,
    LgSpinnerComponent,
    LgEmptyStateComponent,
    LgPaginationComponent,
  ],
  templateUrl: './lg-products-page.component.html',
  styleUrl: './lg-products-page.component.scss',
})
export class LgProductsPageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly cart = inject(CartService);
  private readonly wishlist = inject(WishlistService);
  private readonly toast = inject(ToastService);

  protected readonly plpState = inject(PlpStateService);
  protected readonly filterState = inject(FilterStateService);

  private readonly queryParamMap = toSignal(this.route.queryParamMap);

  constructor() {
    this.titleService.setTitle('Collections — Lugar Furniture');
    this.meta.updateTag({ name: 'description', content: 'Shop luxury handcrafted furniture from Cairo.' });

    // Sync ?category= query param → FilterStateService on every navigation
    effect(() => {
      const raw = this.queryParamMap()?.get('category');
      this.filterState.setCategory(raw ? Number(raw) : null);
    });
  }

  protected navigateToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  protected onCategoryChange(id: number | null): void {
    this.filterState.setCategory(id);
  }

  protected onSortChange(value: string): void {
    this.filterState.setSort(value as 'newest' | 'priceAsc' | 'priceDesc');
  }

  protected onPageChange(page: number): void {
    this.filterState.setPage(page);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected onAddToCart(product: Product): void {
    this.cart.add({
      id: product.id,
      title: product.title,
      image: product.primaryImage,
      qty: 1,
      price: product.hasDiscount ? product.discountedPrice : product.price,
    });
    this.toast.show(`${product.title} added to cart`, 'success');
  }

  protected onAddToWishlist(product: Product): void {
    this.wishlist.toggle(product.id);
    const added = this.wishlist.isInWishlist(product.id);
    this.toast.show(added ? 'Added to wishlist' : 'Removed from wishlist', 'wishlist');
  }

  protected clearFilters(): void {
    this.filterState.reset();
  }
}
