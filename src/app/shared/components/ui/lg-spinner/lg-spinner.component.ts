import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'lg-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-spinner.component.html',
  styleUrl: './lg-spinner.component.scss',
})
export class LgSpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly sizeClass = computed(() => {
    const map = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' } as const;
    return map[this.size()];
  });
}
