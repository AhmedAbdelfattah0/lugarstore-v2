import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { Category } from '../../../shared/models';

interface RawCategory {
  id: number | string;
  title: string;
  titleAr: string;
  imgOne: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly _cache = signal<Category[] | null>(null);

  getCategories(): Observable<Category[]> {
    const cached = this._cache();
    if (cached) {
      return of(cached);
    }

    return this.http.get<RawCategory[]>('/categories/get_categories.php').pipe(
      map(raw => raw.map(c => ({
        id: Number(c.id),
        title: c.title,
        titleAr: c.titleAr,
        image: c.imgOne,
      } as Category))),
      tap(categories => this._cache.set(categories)),
    );
  }

  clearCache(): void {
    this._cache.set(null);
  }
}
