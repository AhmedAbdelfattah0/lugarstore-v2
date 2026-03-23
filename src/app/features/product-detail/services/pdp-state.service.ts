import { Injectable, inject, signal, computed } from '@angular/core';
import { ProductService } from '../../products/services/product.service';
import { Product, BreadcrumbItem } from '../../../shared/models';

const RELATED_LIMIT = 3;

@Injectable({ providedIn: 'root' })
export class PdpStateService {
  private readonly productService = inject(ProductService);

  private readonly _product          = signal<Product | null>(null);
  private readonly _relatedProducts  = signal<Product[]>([]);
  private readonly _isLoading        = signal<boolean>(false);
  private readonly _error            = signal<string | null>(null);
  private readonly _qty              = signal<number>(1);
  private readonly _selectedImageIdx = signal<number>(0);

  readonly product          = this._product.asReadonly();
  readonly relatedProducts  = this._relatedProducts.asReadonly();
  readonly isLoading        = this._isLoading.asReadonly();
  readonly error            = this._error.asReadonly();
  readonly qty              = this._qty.asReadonly();
  readonly selectedImageIdx = this._selectedImageIdx.asReadonly();

  readonly activeImage = computed(() => {
    const product = this._product();
    if (!product) return '';
    return product.images[this._selectedImageIdx()] ?? product.primaryImage;
  });

  readonly activePrice = computed(() => {
    const p = this._product();
    if (!p) return 0;
    return p.hasDiscount ? p.discountedPrice : p.price;
  });

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const product = this._product();
    return [
      { label: 'Collections', route: '/products' },
      ...(product
        ? [
            { label: product.categoryName },
            { label: product.title },
          ]
        : []),
    ];
  });

  loadProduct(id: number): void {
    this._isLoading.set(true);
    this._error.set(null);
    this._product.set(null);
    this._relatedProducts.set([]);
    this._qty.set(1);
    this._selectedImageIdx.set(0);

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this._product.set(product);
        this.loadRelated(product.categoryId, product.id);
      },
      error: () => {
        this._error.set('Failed to load product. Please try again.');
        this._isLoading.set(false);
      },
    });
  }

  selectImage(index: number): void {
    this._selectedImageIdx.set(index);
  }

  setQty(qty: number): void {
    this._qty.set(Math.max(1, qty));
  }

  reset(): void {
    this._product.set(null);
    this._relatedProducts.set([]);
    this._isLoading.set(false);
    this._error.set(null);
    this._qty.set(1);
    this._selectedImageIdx.set(0);
  }

  private loadRelated(categoryId: number, excludeId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this._relatedProducts.set(
          products.filter(p => p.id !== excludeId).slice(0, RELATED_LIMIT),
        );
        this._isLoading.set(false);
      },
      error: () => {
        this._isLoading.set(false);
      },
    });
  }
}
