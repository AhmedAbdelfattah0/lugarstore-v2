import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LgTrustStripComponent } from '../../../../shared/components/commerce/lg-trust-strip/lg-trust-strip.component';

@Component({
  selector: 'lg-trust-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgTrustStripComponent],
  template: `
    <section class="trust-section" aria-label="Why choose Lugar">
      <lg-trust-strip />
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .trust-section {
      background: #F9F1E7;
      padding: 80px 0;
    }
  `],
})
export class LgTrustSectionComponent {}
