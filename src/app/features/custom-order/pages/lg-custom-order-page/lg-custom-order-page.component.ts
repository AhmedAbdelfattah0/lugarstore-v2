import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lg-custom-order-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:2rem;color:#7A6F65;">
      Coming Soon
    </div>
  `,
})
export class LgCustomOrderPageComponent {}
