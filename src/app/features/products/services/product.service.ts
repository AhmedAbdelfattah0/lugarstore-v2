import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { Product, normalizeProduct } from '../../../shared/models';

export interface FilterParams {
  category?: number;
  sort?: 'newest' | 'priceAsc' | 'priceDesc';
}

// Detail endpoint returns images[] array instead of imgOne/imgTwo/imgThree/imgFour
interface RawProductDetail {
  id: number;
  title: string;
  titleAr: string;
  discountedPrice: string;
  originalPrice: string;
  description: string;
  images: string[];
  videoLink: string;
  categoryId: string;
  subCategoryId: number | string;
  rating: number;
  isNew?: boolean;
  discount: number;
  reviews?: number;
  badge?: string;
  subtitle?: string;
  availability: string | number;
  qty: number;
  categoryName: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly _productsCache = signal<Product[] | null>(null);

  getProducts(filters?: FilterParams): Observable<Product[]> {
    const cached = this._productsCache();

    // Serve from cache only when no filters — PlpStateService filters via computed signals
    if (cached && !filters?.category && !filters?.sort) {
      return of(cached);
    }

    return this.http.get<any[]>('/products/get_products.php').pipe(
      map(raw => raw.map(normalizeProduct)),
      tap(products => this._productsCache.set(products)),
      map(products => {
        let result = products;

        if (filters?.category !== undefined) {
          result = result.filter(p => p.categoryId === filters.category);
        }

        return filters?.sort ? this.applySorting(result, filters.sort) : result;
      }),
    );
  }

  getDiscountedProducts(): Observable<Product[]> {
    return this.http.get<any[]>('/products/get_discounted_products.php').pipe(
      map(raw => raw.map(normalizeProduct)),
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<RawProductDetail>(`/products/get_product-v2.php/?id=${id}`).pipe(
      map(raw => this.normalizeProductDetail(raw)),
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<any[]>(`/products/get_products_by_categoryId.php/?categoryId=${categoryId}`).pipe(
      map(raw => raw.map(normalizeProduct)),
    );
  }

  clearCache(): void {
    this._productsCache.set(null);
  }

  private applySorting(products: Product[], sort: NonNullable<FilterParams['sort']>): Product[] {
    const sorted = [...products];
    switch (sort) {
      case 'newest':    return sorted.sort((a, b) => b.id - a.id);
      case 'priceAsc':  return sorted.sort((a, b) => a.price - b.price);
      case 'priceDesc': return sorted.sort((a, b) => b.price - a.price);
    }
  }

  private normalizeProductDetail(raw: RawProductDetail): Product {
    const images = (raw.images ?? []).filter(Boolean);
    return {
      id: raw.id,
      title: raw.title,
      titleAr: raw.titleAr,
      price: Number(raw.originalPrice),
      discountedPrice: Number(raw.discountedPrice),
      discount: raw.discount,
      hasDiscount: Number(raw.discountedPrice) > 0,
      images,
      primaryImage: images[0] || 'assets/images/placeholder.png',
      categoryId: Number(raw.categoryId),
      categoryName: raw.categoryName ?? '',
      subCategoryId: Number(raw.subCategoryId),
      isNew: Number(raw.subCategoryId) === 1,
      isTop: Number(raw.subCategoryId) === 5,
      isOutOfStock: raw.qty === 0 || Number(raw.availability) === 0,
      rating: raw.rating,
      reviews: raw.reviews ?? 0,
      description: raw.description,
      videoLink: raw.videoLink,
      badge: raw.badge,
      subtitle: raw.subtitle,
      qty: raw.qty,
    };
  }
}
