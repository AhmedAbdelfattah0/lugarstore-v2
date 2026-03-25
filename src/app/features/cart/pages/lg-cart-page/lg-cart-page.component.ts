import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { CartService } from '../../../../core/services/cart.service';
import { CurrencyEgpPipe } from '../../../../shared/pipes/currency-egp.pipe';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgQuantityStepperComponent } from '../../../../shared/components/commerce/lg-quantity-stepper/lg-quantity-stepper.component';
import { LgOrderSummaryComponent } from '../../../../shared/components/commerce/lg-order-summary/lg-order-summary.component';
import { LgEmptyStateComponent } from '../../../../shared/components/feedback/lg-empty-state/lg-empty-state.component';

@Component({
  selector: 'lg-cart-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgNavbarComponent, LgFooterComponent, CurrencyEgpPipe, LgQuantityStepperComponent, LgOrderSummaryComponent, LgEmptyStateComponent],
  templateUrl: './lg-cart-page.component.html',
  styleUrl: './lg-cart-page.component.scss',
})
export class LgCartPageComponent {
  private readonly router = inject(Router);
  private readonly meta  = inject(Meta);
  private readonly title = inject(Title);
  protected readonly cart = inject(CartService);

  readonly items = this.cart.items;

  constructor() {
    this.title.setTitle('Shopping Bag — Lugar Furniture');
    this.meta.updateTag({ name: 'description', content: 'Review your selected pieces and proceed to checkout.' });
  }

  onQtyChange(id: number, qty: number): void {
    this.cart.updateQty(id, qty);
  }

  onRemove(id: number): void {
    this.cart.remove(id);
  }

  onCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  onContinueShopping(): void {
    this.router.navigate(['/products']);
  }
}
