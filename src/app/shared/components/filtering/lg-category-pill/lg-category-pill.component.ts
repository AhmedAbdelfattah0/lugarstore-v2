import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

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

  readonly classes = computed(() =>
    this.active()
      ? 'bg-[#B88E2F] text-white border-[#B88E2F]'
      : 'bg-transparent text-[#B88E2F] border-[#B88E2F] hover:bg-[#B88E2F] hover:text-white'
  );
}
