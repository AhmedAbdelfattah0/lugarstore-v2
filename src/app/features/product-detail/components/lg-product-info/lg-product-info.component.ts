import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { Product } from '../../../../shared/models';
import { LgQuantityStepperComponent } from '../../../../shared/components/commerce/lg-quantity-stepper/lg-quantity-stepper.component';
import { LgButtonComponent } from '../../../../shared/components/ui/lg-button/lg-button.component';
import { LgDividerComponent } from '../../../../shared/components/ui/lg-divider/lg-divider.component';
import { CurrencyEgpPipe } from '../../../../shared/pipes/currency-egp.pipe';

@Component({
  selector: 'lg-product-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LgQuantityStepperComponent,
    LgButtonComponent,
    LgDividerComponent,
    CurrencyEgpPipe,
  ],
  templateUrl: './lg-product-info.component.html',
  styleUrl: './lg-product-info.component.scss',
})
export class LgProductInfoComponent {
  readonly product      = input.required<Product>();
  readonly qty          = input.required<number>();
  readonly isWishlisted = input.required<boolean>();

  readonly qtyChange        = output<number>();
  readonly addToCart        = output<void>();
  readonly wishlistToggle   = output<void>();
  readonly whatsappEnquire  = output<void>();
  readonly commissionCustom = output<void>();
}
