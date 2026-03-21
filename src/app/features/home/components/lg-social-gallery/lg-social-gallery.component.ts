import { Component, ChangeDetectionStrategy } from '@angular/core';

interface GalleryImage {
  src: string;
  alt: string;
}

@Component({
  selector: 'lg-social-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-social-gallery.component.html',
  styleUrl: './lg-social-gallery.component.scss',
})
export class LgSocialGalleryComponent {
  protected readonly instagramUrl = 'https://www.instagram.com/lugarfurniture.eg';

  protected readonly images: GalleryImage[] = [
    { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab8?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400', alt: 'Lugar Furniture on Instagram' },
    { src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400', alt: 'Lugar Furniture on Instagram' },
  ];
}
