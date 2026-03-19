import { Injectable, signal, computed, inject } from '@angular/core';
import { CartItem, STORAGE_KEYS } from '../../shared/models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storage = inject(StorageService);

  private readonly _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((sum, item) => sum + item.qty, 0));
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  private loadFromStorage(): CartItem[] {
    try {
      const raw = this.storage.get(STORAGE_KEYS.CART);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    this.storage.set(STORAGE_KEYS.CART, JSON.stringify(this._items()));
  }

  add(item: CartItem): void {
    this._items.update(items => {
      const existing = items.find(i => i.id === item.id);
      if (existing) {
        return items.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i);
      }
      return [...items, item];
    });
    this.save();
  }

  remove(id: number): void {
    this._items.update(items => items.filter(i => i.id !== id));
    this.save();
  }

  updateQty(id: number, qty: number): void {
    if (qty <= 0) {
      this.remove(id);
      return;
    }
    this._items.update(items => items.map(i => i.id === id ? { ...i, qty } : i));
    this.save();
  }

  clear(): void {
    this._items.set([]);
    this.storage.remove(STORAGE_KEYS.CART);
  }
}
