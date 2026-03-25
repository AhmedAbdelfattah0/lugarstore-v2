import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';

@Component({
  selector: 'lg-order-success-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LgNavbarComponent, LgFooterComponent],
  templateUrl: './lg-order-success-page.component.html',
  styleUrl:    './lg-order-success-page.component.scss',
})
export class LgOrderSuccessPageComponent {
  private readonly meta  = inject(Meta);
  private readonly title = inject(Title);

  constructor() {
    this.title.setTitle('Order Confirmed — Lugar Furniture');
    this.meta.updateTag({ name: 'description', content: 'Your Lugar Furniture order has been placed successfully.' });
  }
}
