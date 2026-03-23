import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LgBreadcrumbComponent } from '../../../../shared/components/navigation/lg-breadcrumb/lg-breadcrumb.component';
import { BreadcrumbItem } from '../../../../shared/models';

@Component({
  selector: 'lg-plp-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgBreadcrumbComponent],
  templateUrl: './lg-plp-header.component.html',
  styleUrl: './lg-plp-header.component.scss',
})
export class LgPlpHeaderComponent {
  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', route: '/' },
    { label: 'Collections' },
  ];
}
