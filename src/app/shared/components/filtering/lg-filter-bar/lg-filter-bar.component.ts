import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { LgCategoryPillComponent } from '../lg-category-pill/lg-category-pill.component';

@Component({
  selector: 'lg-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgCategoryPillComponent],
  templateUrl: './lg-filter-bar.component.html',
  styleUrl: './lg-filter-bar.component.scss',
})
export class LgFilterBarComponent {
  readonly categories    = input.required<string[]>();
  readonly activeCategory = input<string | null>(null);
  readonly sortValue     = input<string>('newest');
  readonly productCount  = input<number>(0);

  readonly categoryChange = output<string | null>();
  readonly sortChange     = output<string>();

  protected readonly sortOptions = [
    { value: 'newest',   label: 'Newest' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
  ];

  selectCategory(cat: string | null): void {
    this.categoryChange.emit(cat);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(value);
  }
}
