import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'lg-section-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-section-header.component.html',
  styleUrl: './lg-section-header.component.scss',
})
export class LgSectionHeaderComponent {
  readonly eyebrow = input<string>('');
  readonly heading = input.required<string>();
  readonly subtext = input<string>('');
  readonly align   = input<'left' | 'center'>('center');

  readonly containerClass = computed(() =>
    this.align() === 'center'
      ? 'text-center flex flex-col items-center'
      : 'text-left'
  );
}
