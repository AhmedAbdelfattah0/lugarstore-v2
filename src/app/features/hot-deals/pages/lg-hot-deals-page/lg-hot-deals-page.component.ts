import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
  ElementRef,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { HotDealsStateService } from '../../services/hot-deals-state.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../shared/models';

import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgFilterBarComponent } from '../../../../shared/components/filtering/lg-filter-bar/lg-filter-bar.component';
import { LgProductCardComponent } from '../../../../shared/components/product/lg-product-card/lg-product-card.component';
import { LgSpinnerComponent } from '../../../../shared/components/ui/lg-spinner/lg-spinner.component';
import { LgEmptyStateComponent } from '../../../../shared/components/feedback/lg-empty-state/lg-empty-state.component';
import { LgPaginationComponent } from '../../../../shared/components/filtering/lg-pagination/lg-pagination.component';

@Component({
  selector: 'lg-hot-deals-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HotDealsStateService],
  imports: [
    LgNavbarComponent,
    LgFooterComponent,
    LgFilterBarComponent,
    LgProductCardComponent,
    LgSpinnerComponent,
    LgEmptyStateComponent,
    LgPaginationComponent,
  ],
  templateUrl: './lg-hot-deals-page.component.html',
  styleUrl:    './lg-hot-deals-page.component.scss',
})
export class LgHotDealsPageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router     = inject(Router);
  private readonly titleSvc   = inject(Title);
  private readonly meta       = inject(Meta);
  private readonly cart       = inject(CartService);
  private readonly wishlist   = inject(WishlistService);
  private readonly toast      = inject(ToastService);

  protected readonly state = inject(HotDealsStateService);

  protected readonly productsSection = viewChild<ElementRef>('productsSection');

  constructor() {
    this.titleSvc.setTitle('Hot Deals — Lugar Furniture');
    this.meta.updateTag({
      name: 'description',
      content: 'Shop luxury Egyptian furniture at exceptional prices. Limited time offers on handcrafted pieces.',
    });
  }

  protected scrollToProducts(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.productsSection()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  protected navigateToProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  protected navigateToCollection(): void {
    this.router.navigate(['/products']);
  }

  protected onCategoryChange(id: number | null): void {
    this.state.setCategory(id);
  }

  protected onSortChange(value: string): void {
    this.state.setSort(value as 'newest' | 'priceAsc' | 'priceDesc');
  }

  protected onPageChange(page: number): void {
    this.state.setPage(page);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected onAddToCart(product: Product): void {
    this.cart.add({
      id:    product.id,
      title: product.title,
      image: product.primaryImage,
      qty:   1,
      price: product.hasDiscount ? product.discountedPrice : product.price,
      categoryName: product.categoryName,
    });
    this.toast.show(`${product.title} added to cart`, 'success');
  }

  protected onAddToWishlist(product: Product): void {
    this.wishlist.toggle({
      id:    product.id,
      title: product.title,
      image: product.primaryImage,
      qty:   1,
      price: product.hasDiscount ? product.discountedPrice : product.price,
      categoryName: product.categoryName,
    });
    const added = this.wishlist.isInWishlist(product.id);
    this.toast.show(added ? 'Added to wishlist' : 'Removed from wishlist', 'wishlist');
  }

  protected clearFilters(): void {
    this.state.reset();
  }
}
