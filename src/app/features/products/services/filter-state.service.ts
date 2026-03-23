import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  readonly activeCategory = signal<number | null>(null);
  readonly sort = signal<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  readonly page = signal<number>(1);
  readonly searchQuery = signal<string>('');

  setCategory(id: number | null): void {
    this.activeCategory.set(id);
    this.page.set(1);
  }

  setSort(value: 'newest' | 'priceAsc' | 'priceDesc'): void {
    this.sort.set(value);
    this.page.set(1);
  }

  setPage(page: number): void {
    this.page.set(page);
  }

  reset(): void {
    this.activeCategory.set(null);
    this.sort.set('newest');
    this.page.set(1);
    this.searchQuery.set('');
  }
}
