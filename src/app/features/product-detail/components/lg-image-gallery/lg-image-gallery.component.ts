import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'lg-image-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe],
  templateUrl: './lg-image-gallery.component.html',
  styleUrl: './lg-image-gallery.component.scss',
})
export class LgImageGalleryComponent {
  readonly images        = input.required<string[]>();
  readonly selectedIndex = input.required<number>();

  readonly selectImage = output<number>();
}
