import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category } from '../../../shared/models';

interface RawCategory {
  id: number;
  title: string;
  titleAr: string;
  imgOne: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<RawCategory[]>('/categories/get_categories.php').pipe(
      map(raw => raw.map(c => ({
        id: c.id,
        title: c.title,
        titleAr: c.titleAr,
        image: c.imgOne,
      }))),
    );
  }
}
