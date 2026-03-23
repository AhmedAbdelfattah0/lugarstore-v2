import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProductService } from './product.service';
import { CategoryService } from './category.service';
import { FilterStateService } from './filter-state.service';
import { Product, Category } from '../../../shared/models';

const PAGE_SIZE = 12;

@Injectable({ providedIn: 'root' })
export class PlpStateService {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly filterState = inject(FilterStateService);

  private readonly _allProducts = signal<Product[]>([]);
  private readonly _categories  = signal<Category[]>([]);
  private readonly _isLoading   = signal<boolean>(false);
  private readonly _error       = signal<string | null>(null);

  readonly allProducts = this._allProducts.asReadonly();
  readonly categories  = this._categories.asReadonly();
  readonly isLoading   = this._isLoading.asReadonly();
  readonly error       = this._error.asReadonly();

  readonly filteredProducts = computed(() => {
    const products = this._allProducts();
    const category = this.filterState.activeCategory();
    const sort     = this.filterState.sort();

    const filtered = category !== null
      ? products.filter(p => p.categoryId === category)
      : products;

    return this.sortProducts(filtered, sort);
  });

  readonly totalCount = computed(() => this.filteredProducts().length);

  readonly totalPages = computed(() => Math.ceil(this.totalCount() / PAGE_SIZE));

  readonly paginatedProducts = computed(() => {
    const start = (this.filterState.page() - 1) * PAGE_SIZE;
    return this.filteredProducts().slice(start, start + PAGE_SIZE);
  });

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this._isLoading.set(true);

    forkJoin({
      products:   this.productService.getProducts(),
      categories: this.categoryService.getCategories(),
    }).subscribe({
      next: ({ products, categories }) => {
        this._allProducts.set(products);
        this._categories.set(categories);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('Failed to load collections. Please try again.');
        this._isLoading.set(false);
      },
    });
  }

  private sortProducts(products: Product[], sort: string): Product[] {
    switch (sort) {
      case 'priceAsc':  return [...products].sort((a, b) => a.price - b.price);
      case 'priceDesc': return [...products].sort((a, b) => b.price - a.price);
      default:          return [...products].sort((a, b) => b.id - a.id);
    }
  }
}
