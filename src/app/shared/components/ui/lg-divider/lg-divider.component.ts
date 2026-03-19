import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'lg-divider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-divider.component.html',
  styleUrl: './lg-divider.component.scss',
})
export class LgDividerComponent {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly variant = input<'gold' | 'muted'>('muted');
  /** Optional explicit width override, e.g. '48px' for short decorative lines */
  readonly width = input<string>('');

  readonly classes = computed(() => {
    const isVertical = this.orientation() === 'vertical';
    const size  = isVertical ? 'w-px h-full' : 'h-px w-full';
    const color = this.variant() === 'gold' ? 'bg-[#B88E2F]' : 'bg-[#E8E8E8]';
    return `${size} ${color}`;
  });

  readonly widthStyle = computed((): string | null => {
    const w = this.width();
    return w ? `width: ${w}` : null;
  });
}
