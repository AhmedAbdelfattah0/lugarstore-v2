import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart.model';

@Injectable({ providedIn: 'root' })
export class QuickViewService {
  private readonly _selectedProduct = signal<Product | null>(null);
  private readonly _selectedImageIndex = signal<number>(0);
  private readonly _qty = signal<number>(1);

  readonly selectedProduct = this._selectedProduct.asReadonly();
  readonly selectedImageIndex = this._selectedImageIndex.asReadonly();
  readonly qty = this._qty.asReadonly();

  readonly activeImage = computed(() => {
    const product = this._selectedProduct();
    if (!product) return '';
    return product.images[this._selectedImageIndex()] ?? product.primaryImage;
  });

  readonly activePrice = computed(() => {
    const product = this._selectedProduct();
    if (!product) return 0;
    return product.hasDiscount ? product.discountedPrice : product.price;
  });

  open(product: Product): void {
    this._selectedProduct.set(product);
    this._selectedImageIndex.set(0);
    this._qty.set(1);
  }

  close(): void {
    this._selectedProduct.set(null);
  }

  selectImage(index: number): void {
    this._selectedImageIndex.set(index);
  }

  setQty(qty: number): void {
    this._qty.set(qty);
  }

  buildCartItem(): CartItem | null {
    const product = this._selectedProduct();
    if (!product) return null;
    return {
      id: product.id,
      title: product.title,
      image: product.primaryImage,
      qty: this._qty(),
      price: this.activePrice(),
    };
  }
}
