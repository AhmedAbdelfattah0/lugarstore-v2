import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'lg-category-pill',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-category-pill.component.html',
  styleUrl: './lg-category-pill.component.scss',
})
export class LgCategoryPillComponent {
  readonly label  = input.required<string>();
  readonly active = input<boolean>(false);

  readonly pillClick = output<void>();
}
