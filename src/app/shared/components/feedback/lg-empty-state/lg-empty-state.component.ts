import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { LgButtonComponent } from '../../ui/lg-button/lg-button.component';

@Component({
  selector: 'lg-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgButtonComponent],
  templateUrl: './lg-empty-state.component.html',
  styleUrl: './lg-empty-state.component.scss',
})
export class LgEmptyStateComponent {
  readonly icon     = input<string>('');
  readonly title    = input<string>('Nothing here yet');
  readonly message  = input<string>('');
  readonly ctaLabel = input<string>('');
  readonly ctaClick = output<void>();
}
