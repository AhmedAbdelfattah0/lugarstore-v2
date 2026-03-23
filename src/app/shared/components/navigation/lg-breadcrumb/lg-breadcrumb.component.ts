import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem } from '../../../models';

@Component({
  selector: 'lg-breadcrumb',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './lg-breadcrumb.component.html',
  styleUrl: './lg-breadcrumb.component.scss',
})
export class LgBreadcrumbComponent {
  readonly items     = input.required<BreadcrumbItem[]>();
  readonly separator = input<string>('·');

  readonly links   = computed(() => this.items().slice(0, -1));
  readonly current = computed(() => this.items().at(-1) ?? null);
}
