import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem, STORAGE_KEYS } from '../../shared/models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storage = inject(StorageService);

  private readonly _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();
  // ids computed — used by lg-product-card for isWishlisted check
  readonly ids = computed(() => this._items().map(i => i.id));
  readonly count = computed(() => this._items().length);
  readonly totalValue = computed(() =>
    this._items().reduce((sum, item) => sum + item.price, 0)
  );

  private loadFromStorage(): CartItem[] {
    try {
      const raw = this.storage.get(STORAGE_KEYS.WISHLIST);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    this.storage.set(STORAGE_KEYS.WISHLIST, JSON.stringify(this._items()));
  }

  add(item: CartItem): void {
    if (this.isInWishlist(item.id)) return;
    this._items.update(items => [...items, item]);
    this.save();
  }

  remove(id: number): void {
    this._items.update(items => items.filter(i => i.id !== id));
    this.save();
  }

  isInWishlist(id: number): boolean {
    return this._items().some(i => i.id === id);
  }

  toggle(item: CartItem): void {
    this.isInWishlist(item.id) ? this.remove(item.id) : this.add(item);
  }

  clear(): void {
    this._items.set([]);
    this.storage.remove(STORAGE_KEYS.WISHLIST);
  }
}
