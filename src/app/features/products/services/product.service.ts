import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  subCategoryId: number;
  rating: number;
  isNew?: boolean;
  discount: number;
  reviews?: number;
  badge?: string;
  subtitle?: string;
  availability: string;
  qty: number;
  categoryName: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(filters?: FilterParams): Observable<Product[]> {
    return this.http.get<any[]>('/products/get_products.php').pipe(
      map(raw => {
        let products = raw.map(normalizeProduct);

        if (filters?.category !== undefined) {
          products = products.filter(p => p.categoryId === filters.category);
        }

        if (filters?.sort) {
          products = this.applySorting(products, filters.sort);
        }

        return products;
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

  private applySorting(products: Product[], sort: NonNullable<FilterParams['sort']>): Product[] {
    const sorted = [...products];
    switch (sort) {
      case 'newest':   return sorted.sort((a, b) => b.id - a.id);
      case 'priceAsc': return sorted.sort((a, b) => a.price - b.price);
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
      categoryName: raw.categoryName,
      subCategoryId: raw.subCategoryId,
      isNew: raw.subCategoryId === 1,
      isTop: raw.subCategoryId === 5,
      isOutOfStock: raw.availability !== 'in_stock',
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
