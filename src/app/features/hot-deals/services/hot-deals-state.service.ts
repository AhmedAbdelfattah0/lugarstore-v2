import { Injectable, inject, signal, computed } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { CategoryService } from '../../products/services/category.service';
import { Product, Category } from '../../../shared/models';

const PAGE_SIZE = 12;

@Injectable()
export class HotDealsStateService {
  private readonly productService  = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  private readonly _allProducts = signal<Product[]>([]);
  private readonly _categories  = signal<Category[]>([]);
  private readonly _isLoading   = signal(false);
  private readonly _error       = signal<string | null>(null);

  // Filter state — isolated from PLP's FilterStateService
  readonly activeCategory = signal<number | null>(null);
  readonly sort           = signal<'newest' | 'priceAsc' | 'priceDesc'>('newest');
  readonly page           = signal<number>(1);

  readonly allProducts = this._allProducts.asReadonly();
  readonly categories  = this._categories.asReadonly();
  readonly isLoading   = this._isLoading.asReadonly();
  readonly error       = this._error.asReadonly();

  readonly filteredProducts = computed(() => {
    const products = this._allProducts();
    const category = this.activeCategory();
    const sort     = this.sort();

    const filtered = category !== null
      ? products.filter(p => p.categoryId === category)
      : products;

    return this.sortProducts(filtered, sort);
  });

  readonly totalCount = computed(() => this.filteredProducts().length);
  readonly totalPages = computed(() => Math.ceil(this.totalCount() / PAGE_SIZE));

  readonly paginatedProducts = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filteredProducts().slice(start, start + PAGE_SIZE);
  });

  constructor() {
    this.loadData();
  }

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
  }

  private loadData(): void {
    this._isLoading.set(true);
    forkJoin({
      products:   this.productService.getDiscountedProducts(),
      categories: this.categoryService.getCategories(),
    }).subscribe({
      next: ({ products, categories }) => {
        this._allProducts.set(products);
        this._categories.set(categories);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('Failed to load deals. Please try again.');
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
