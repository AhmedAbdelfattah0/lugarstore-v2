import { Component, ChangeDetectionStrategy } from '@angular/core';

interface TrustItem {
  eyebrow: string;
  heading: string;
  description: string;
}

@Component({
  selector: 'lg-trust-strip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-trust-strip.component.html',
  styleUrl: './lg-trust-strip.component.scss',
})
export class LgTrustStripComponent {
  protected readonly items: TrustItem[] = [
    {
      eyebrow: 'Delivery',
      heading: 'White Glove Shipping',
      description: 'Professional installation and placement in every room — free of charge.',
    },
    {
      eyebrow: 'Craftsmanship',
      heading: 'Lifetime Quality',
      description: 'Solid wood joinery and premium upholstery built to outlast trends.',
    },
    {
      eyebrow: 'Service',
      heading: 'Private Concierge',
      description: 'A dedicated design advisor for every order, from selection to delivery.',
    },
    {
      eyebrow: 'Returns',
      heading: 'Effortless Exchange',
      description: 'Hassle-free returns and exchanges within 14 days of delivery.',
    },
  ];
}
