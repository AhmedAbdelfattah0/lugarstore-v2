import {
  Component,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { QuickViewService } from '../../../../core/services/quick-view.service';
import { CartService } from '../../../../core/services/cart.service';
import { CurrencyEgpPipe } from '../../../pipes/currency-egp.pipe';
import { LgDividerComponent } from '../../ui/lg-divider/lg-divider.component';
import { LgButtonComponent } from '../../ui/lg-button/lg-button.component';
import { LgQuantityStepperComponent } from '../../commerce/lg-quantity-stepper/lg-quantity-stepper.component';

@Component({
  selector: 'lg-quick-view-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    CurrencyEgpPipe,
    LgDividerComponent,
    LgButtonComponent,
    LgQuantityStepperComponent,
  ],
  templateUrl: './lg-quick-view-modal.component.html',
  styleUrl: './lg-quick-view-modal.component.scss',
})
export class LgQuickViewModalComponent {
  protected readonly quickView = inject(QuickViewService);
  private readonly cart = inject(CartService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isBrowser = isPlatformBrowser(this.platformId);

  protected onAddToCart(): void {
    const item = this.quickView.buildCartItem();
    if (!item) return;
    this.cart.add(item);
    this.quickView.close();
  }
}
