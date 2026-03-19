import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CartItem } from '../../../models';
import { CurrencyEgpPipe } from '../../../pipes/currency-egp.pipe';
import { LgButtonComponent } from '../../ui/lg-button/lg-button.component';

@Component({
  selector: 'lg-order-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyEgpPipe, LgButtonComponent],
  templateUrl: './lg-order-summary.component.html',
  styleUrl: './lg-order-summary.component.scss',
})
export class LgOrderSummaryComponent {
  readonly items    = input.required<CartItem[]>();
  readonly ctaLabel = input<string>('Proceed to Checkout');

  readonly ctaClick = output<void>();

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.qty, 0)
  );
}
