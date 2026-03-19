import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'lg-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-pagination.component.html',
  styleUrl: './lg-pagination.component.scss',
})
export class LgPaginationComponent {
  readonly total    = input.required<number>();
  readonly page     = input.required<number>();
  readonly pageSize = input<number>(12);

  readonly pageChange = output<number>();

  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  readonly hasPrev = computed(() => this.page() > 1);
  readonly hasNext = computed(() => this.page() < this.totalPages());

  readonly isVisible = computed(() => this.totalPages() > 1);

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.pageChange.emit(page);
  }

  prev(): void {
    this.goTo(this.page() - 1);
  }

  next(): void {
    this.goTo(this.page() + 1);
  }
}
