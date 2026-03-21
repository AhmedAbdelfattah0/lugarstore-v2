import { Injectable, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, catchError, of } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { CategoryService } from '../../products/services/category.service';
import { BannerService } from '../../../core/services/banner.service';
import { Product } from '../../../shared/models/product.model';
import { Category } from '../../../shared/models/category.model';
import { Banner } from '../../../shared/models/banner.model';

@Injectable({ providedIn: 'root' })
export class HomeStateService {
  private readonly productService  = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly bannerService   = inject(BannerService);

  private readonly _isLoading = signal(true);
  private readonly _error     = signal<string | null>(null);
  private readonly _products  = signal<Product[]>([]);
  private readonly _categories = signal<Category[]>([]);
  private readonly _banners    = signal<Banner[]>([]);

  readonly isLoading = this._isLoading.asReadonly();
  readonly error     = this._error.asReadonly();

  // All products — for components that filter internally (lg-featured-collection)
  readonly allProducts = this._products.asReadonly();

  // First 6 — used only for hero featured card (firstFeatured in home page)
  readonly featuredProducts = computed(() => this._products().slice(0, 6));

  readonly newArrivals = computed(() =>
    this._products().filter(p => p.isNew).slice(0, 8)
  );

  readonly categories = this._categories.asReadonly();
  readonly banners    = this._banners.asReadonly();

  constructor() {
    this.load();
  }

  private load(): void {
    this._isLoading.set(true);
    this._error.set(null);

    forkJoin({
      products:   this.productService.getProducts().pipe(catchError(() => of([]))),
      categories: this.categoryService.getCategories().pipe(catchError(() => of([]))),
      banners:    this.bannerService.getBanners().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ products, categories, banners }) => {
   

        this._products.set(products);
        this._categories.set(categories);
        this._banners.set(banners);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('Failed to load data. Please try again.');
        this._isLoading.set(false);
      },
    });
  }
}
