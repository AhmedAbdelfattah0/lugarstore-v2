import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FilterStateService } from '../../services/filter-state.service';
import { PlpStateService } from '../../services/plp-state.service';

@Component({
  selector: 'lg-product-sort',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-product-sort.component.html',
  styleUrl: './lg-product-sort.component.scss',
})
export class LgProductSortComponent {
  protected readonly filterState = inject(FilterStateService);
  protected readonly plpState = inject(PlpStateService);

  protected readonly sortOptions = [
    { value: 'newest'   as const, label: 'Newest First' },
    { value: 'priceAsc' as const, label: 'Price: Low–High' },
    { value: 'priceDesc' as const, label: 'Price: High–Low' },
  ];

  protected onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'newest' | 'priceAsc' | 'priceDesc';
    this.filterState.setSort(value);
  }
}
