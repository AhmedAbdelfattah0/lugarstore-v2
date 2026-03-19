import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type BadgeVariant = 'new' | 'discount' | 'out-of-stock' | 'top';

@Component({
  selector: 'lg-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-badge.component.html',
  styleUrl: './lg-badge.component.scss',
})
export class LgBadgeComponent {
  readonly variant = input<BadgeVariant>('new');
  readonly label = input<string>('');

  readonly defaultLabel = computed(() => {
    const map: Record<BadgeVariant, string> = {
      new:            'New',
      discount:       'Sale',
      'out-of-stock': 'Out of Stock',
      top:            'Top',
    };
    return map[this.variant()];
  });

  readonly classes = computed(() => {
    const map: Record<BadgeVariant, string> = {
      new:            'bg-[#F9F1E7] text-[#333333] border border-[#E8E8E8]',
      discount:       'bg-[#B88E2F] text-white',
      'out-of-stock': 'bg-[#E8E8E8] text-[#7A6F65]',
      top:            'bg-[#1A1A18] text-white',
    };
    return map[this.variant()];
  });
}
