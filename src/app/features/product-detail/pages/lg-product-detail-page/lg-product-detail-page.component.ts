import {
  Component,
  ChangeDetectionStrategy,
  inject,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title, Meta } from '@angular/platform-browser';

import { environment } from '../../../../../environments/environment';
import { PdpStateService } from '../../services/pdp-state.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../shared/models';

import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgBreadcrumbComponent } from '../../../../shared/components/navigation/lg-breadcrumb/lg-breadcrumb.component';
import { LgSpinnerComponent } from '../../../../shared/components/ui/lg-spinner/lg-spinner.component';
import { LgEmptyStateComponent } from '../../../../shared/components/feedback/lg-empty-state/lg-empty-state.component';

import { LgImageGalleryComponent } from '../../components/lg-image-gallery/lg-image-gallery.component';
import { LgProductInfoComponent } from '../../components/lg-product-info/lg-product-info.component';
import { LgScrollytellingComponent } from '../../components/lg-scrollytelling/lg-scrollytelling.component';

@Component({
  selector: 'lg-product-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LgNavbarComponent,
    LgFooterComponent,
    LgBreadcrumbComponent,
    LgSpinnerComponent,
    LgEmptyStateComponent,
    LgImageGalleryComponent,
    LgProductInfoComponent,
    LgScrollytellingComponent,
  ],
  templateUrl: './lg-product-detail-page.component.html',
  styleUrl: './lg-product-detail-page.component.scss',
})
export class LgProductDetailPageComponent {
  private readonly platformId    = inject(PLATFORM_ID);
  private readonly route         = inject(ActivatedRoute);
  protected readonly router      = inject(Router);
  private readonly titleService  = inject(Title);
  private readonly meta          = inject(Meta);
  private readonly cart          = inject(CartService);
  private readonly wishlist      = inject(WishlistService);
  private readonly toast         = inject(ToastService);

  protected readonly pdpState    = inject(PdpStateService);

  private readonly paramMap = toSignal(this.route.paramMap); // FR-021

  constructor() {
    // Route param change detection — signals-first, no subscription (FR-021)
    effect(() => {
      const id = this.paramMap()?.get('id');
      if (id) {
        this.pdpState.loadProduct(+id);
      } else {
        this.router.navigate(['/products']);
      }
    });

    // Meta tags — updated whenever product signal changes
    effect(() => {
      const product = this.pdpState.product();
      if (!product) return;
      this.titleService.setTitle(`${product.title} — Lugar Furniture`);
      this.meta.updateTag({ name: 'description', content: product.description?.substring(0, 160) ?? '' });
      this.meta.updateTag({ property: 'og:image', content: product.primaryImage });
    });
  }

  protected isWishlisted(id: number): boolean {
    return this.wishlist.isInWishlist(id);
  }

  protected onAddToCart(): void {
    const product = this.pdpState.product();
    if (!product) return;
    this.cart.add({
      id:           product.id,
      title:        product.title,
      image:        product.primaryImage,
      qty:          this.pdpState.qty(),
      price:        this.pdpState.activePrice(),
      categoryName: product.categoryName,
    });
    this.toast.show(`${product.title} added to cart`, 'success');
  }

  protected onWishlistToggle(): void {
    const product = this.pdpState.product();
    if (!product) return;
    this.wishlist.toggle({
      id: product.id,
      title: product.title,
      image: product.primaryImage,
      qty: 1,
      price: product.hasDiscount ? product.discountedPrice : product.price,
      categoryName: product.categoryName,
    });
    const added = this.wishlist.isInWishlist(product.id);
    this.toast.show(added ? 'Added to wishlist' : 'Removed from wishlist', 'wishlist');
  }

  protected onWhatsappEnquire(): void {
    const product = this.pdpState.product();
    if (!product) return;
    const url = this.buildWhatsAppUrl(product.title);
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  protected onCommissionCustom(): void {
    this.router.navigate(['/custom-order']);
  }

  protected onRelatedAddToCart(product: Product): void {
    this.cart.add({
      id:           product.id,
      title:        product.title,
      image:        product.primaryImage,
      qty:          1,
      price:        product.hasDiscount ? product.discountedPrice : product.price,
      categoryName: product.categoryName,
    });
    this.toast.show(`${product.title} added to cart`, 'success');
  }

  protected onRelatedAddToWishlist(product: Product): void {
    this.wishlist.toggle({
      id: product.id,
      title: product.title,
      image: product.primaryImage,
      qty: 1,
      price: product.hasDiscount ? product.discountedPrice : product.price,
      categoryName: product.categoryName,
    });
    const added = this.wishlist.isInWishlist(product.id);
    this.toast.show(added ? 'Added to wishlist' : 'Removed from wishlist', 'wishlist');
  }

  protected buildWhatsAppUrl(title: string): string {
    const text = encodeURIComponent(`Hello, I'm interested in: ${title}`);
    return `https://wa.me/${environment.whatsappPhone}?text=${text}`;
  }
}
