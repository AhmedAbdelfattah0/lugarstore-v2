import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Banner, ApiResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class BannerService {
  private readonly http = inject(HttpClient);

  getBanners(): Observable<Banner[]> {
    return this.http.get<ApiResponse<Banner[]>>('/banners/get_banners.php').pipe(
      map(res => {
        const active = res.data.filter(b => b.visible === true && b.selected === true);
        const hasOrder = active.some(b => b.order !== undefined);
        return hasOrder ? active.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : active;
      }),
    );
  }
}
