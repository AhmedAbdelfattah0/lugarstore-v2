import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Category } from '../../../../shared/models';

@Component({
  selector: 'lg-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './lg-filter-bar.component.html',
  styleUrl: './lg-filter-bar.component.scss',
})
export class LgFilterBarComponent {
  readonly categories     = input.required<Category[]>();
  readonly activeCategory = input<number | null>(null);
  readonly sortValue      = input<string>('newest');
  readonly productCount   = input<number>(0);

  readonly categoryChange = output<number | null>();
  readonly sortChange     = output<string>();

  protected readonly sortOptions = [
    { value: 'newest',    label: 'Newest First' },
    { value: 'priceAsc',  label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
  ];

  selectCategory(id: number | null): void {
    this.categoryChange.emit(id);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(value);
  }
}
