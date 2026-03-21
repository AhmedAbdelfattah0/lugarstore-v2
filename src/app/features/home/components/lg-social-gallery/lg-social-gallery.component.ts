import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { HomeStateService } from '../../services/home-state.service';

interface GalleryItem {
  id: number;
  image: string;
  title: string;
}

@Component({
  selector: 'lg-social-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-social-gallery.component.html',
  styleUrl: './lg-social-gallery.component.scss',
})
export class LgSocialGalleryComponent {
  private readonly homeState = inject(HomeStateService);

  protected readonly instagramUrl = 'https://www.instagram.com/lugarfurniture.eg';

  protected readonly galleryItems = computed<GalleryItem[]>(() =>
    this.homeState.allProducts()
      .slice(0, 9)
      .map(p => ({ id: p.id, image: p.primaryImage, title: p.title }))
  );
}
