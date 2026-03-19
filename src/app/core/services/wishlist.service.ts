import { Injectable, signal, computed, inject } from '@angular/core';
import { STORAGE_KEYS } from '../../shared/models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly storage = inject(StorageService);

  private readonly _ids = signal<number[]>(this.loadFromStorage());

  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  private loadFromStorage(): number[] {
    try {
      const raw = this.storage.get(STORAGE_KEYS.WISHLIST);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    this.storage.set(STORAGE_KEYS.WISHLIST, JSON.stringify(this._ids()));
  }

  add(id: number): void {
    if (this.isInWishlist(id)) return;
    this._ids.update(ids => [...ids, id]);
    this.save();
  }

  remove(id: number): void {
    this._ids.update(ids => ids.filter(i => i !== id));
    this.save();
  }

  isInWishlist(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    this.isInWishlist(id) ? this.remove(id) : this.add(id);
  }

  clear(): void {
    this._ids.set([]);
    this.storage.remove(STORAGE_KEYS.WISHLIST);
  }
}
