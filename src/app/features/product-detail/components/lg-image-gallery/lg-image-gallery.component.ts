import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  PLATFORM_ID,
  inject,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser, SlicePipe } from '@angular/common';

@Component({
  selector: 'lg-image-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe],
  templateUrl: './lg-image-gallery.component.html',
  styleUrl: './lg-image-gallery.component.scss',
})
export class LgImageGalleryComponent implements OnDestroy {
  readonly images        = input.required<string[]>();
  readonly selectedIndex = input.required<number>();
  readonly selectImage   = output<number>();

  private readonly platformId = inject(PLATFORM_ID);
  readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _isZoomed = signal<boolean>(false);
  private readonly _zoomIndex = signal<number>(0);
  readonly isZoomed  = this._isZoomed.asReadonly();
  readonly zoomIndex = this._zoomIndex.asReadonly();

  // Arrow function preserves `this` for add/removeEventListener identity
  private readonly _keyHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape')           this.closeZoom();
    else if (e.key === 'ArrowRight')  this.navigate(1);
    else if (e.key === 'ArrowLeft')   this.navigate(-1);
  };

  openZoom(index: number): void {
    this._zoomIndex.set(index);
    this._isZoomed.set(true);
    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', this._keyHandler);
    }
  }

  closeZoom(): void {
    this._isZoomed.set(false);
    if (this.isBrowser) {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this._keyHandler);
    }
  }

  navigate(direction: 1 | -1): void {
    const total = this.images().length;
    this._zoomIndex.set((this._zoomIndex() + direction + total) % total);
  }

  setZoomImage(index: number): void {
    this._zoomIndex.set(index);
  }

  ngOnDestroy(): void {
    // Guard: clean up if component is destroyed while modal is open
    if (this.isBrowser) {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this._keyHandler);
    }
  }
}
