import {
  Component,
  ChangeDetectionStrategy,
  inject,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

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
import { LgButtonComponent } from '../../../../shared/components/ui/lg-button/lg-button.component';
import { LgQuantityStepperComponent } from '../../../../shared/components/commerce/lg-quantity-stepper/lg-quantity-stepper.component';
import { LgDividerComponent } from '../../../../shared/components/ui/lg-divider/lg-divider.component';
import { LgProductCardComponent } from '../../../../shared/components/product/lg-product-card/lg-product-card.component';
import { CurrencyEgpPipe } from '../../../../shared/pipes/currency-egp.pipe';

const WHATSAPP_NUMBER = '201234567890';

@Component({
  selector: 'lg-product-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    LgNavbarComponent,
    LgFooterComponent,
    LgBreadcrumbComponent,
    LgSpinnerComponent,
    LgEmptyStateComponent,
    LgButtonComponent,
    LgQuantityStepperComponent,
    LgDividerComponent,
    LgProductCardComponent,
    CurrencyEgpPipe,
  ],
  templateUrl: './lg-product-detail-page.component.html',
  styleUrl: './lg-product-detail-page.component.scss',
})
export class LgProductDetailPageComponent implements OnInit, OnDestroy {
  private readonly route          = inject(ActivatedRoute);
  protected readonly router       = inject(Router);
  private readonly titleService = inject(Title);
  private readonly meta         = inject(Meta);
  private readonly cart         = inject(CartService);
  private readonly wishlist     = inject(WishlistService);
  private readonly toast        = inject(ToastService);

  protected readonly pdpState = inject(PdpStateService);

  private readonly ngUnsubscribe = new Subject<void>();

  constructor() {
    effect(() => {
      const product = this.pdpState.product();
      if (!product) return;
      this.titleService.setTitle(`${product.title} — Lugar Furniture`);
      this.meta.updateTag({ name: 'description', content: product.description?.substring(0, 160) ?? '' });
      this.meta.updateTag({ property: 'og:image', content: product.primaryImage });
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.pdpState.loadProduct(id);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.pdpState.reset();
  }

  protected isWishlisted(id: number): boolean {
    return this.wishlist.isInWishlist(id);
  }

  protected onAddToCart(): void {
    const product = this.pdpState.product();
    if (!product) return;
    this.cart.add({
      id:    product.id,
      title: product.title,
      image: product.primaryImage,
      qty:   this.pdpState.qty(),
      price: this.pdpState.activePrice(),
    });
    this.toast.show(`${product.title} added to cart`, 'success');
  }

  protected onWishlistToggle(): void {
    const product = this.pdpState.product();
    if (!product) return;
    this.wishlist.toggle(product.id);
    const added = this.wishlist.isInWishlist(product.id);
    this.toast.show(added ? 'Added to wishlist' : 'Removed from wishlist', 'wishlist');
  }

  protected onRelatedAddToCart(product: Product): void {
    this.cart.add({
      id:    product.id,
      title: product.title,
      image: product.primaryImage,
      qty:   1,
      price: product.hasDiscount ? product.discountedPrice : product.price,
    });
    this.toast.show(`${product.title} added to cart`, 'success');
  }

  protected onRelatedAddToWishlist(product: Product): void {
    this.wishlist.toggle(product.id);
    const added = this.wishlist.isInWishlist(product.id);
    this.toast.show(added ? 'Added to wishlist' : 'Removed from wishlist', 'wishlist');
  }

  protected buildWhatsAppUrl(title: string): string {
    const text = encodeURIComponent(`Hello, I'm interested in: ${title}`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }
}
