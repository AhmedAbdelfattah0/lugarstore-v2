import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CustomOrderService } from '../../services/custom-order.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgBreadcrumbComponent } from '../../../../shared/components/navigation/lg-breadcrumb/lg-breadcrumb.component';
import { LgInputComponent } from '../../../../shared/components/ui/lg-input/lg-input.component';
import { LgSpinnerComponent } from '../../../../shared/components/ui/lg-spinner/lg-spinner.component';
import { BreadcrumbItem } from '../../../../shared/models';
import { environment } from '../../../../../environments/environment';

interface FilePreview {
  file:       File;
  previewUrl: string;
  name:       string;
}

@Component({
  selector: 'lg-custom-order-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LgNavbarComponent,
    LgFooterComponent,
    LgBreadcrumbComponent,
    LgInputComponent,
    LgSpinnerComponent,
  ],
  templateUrl: './lg-custom-order-page.component.html',
  styleUrl: './lg-custom-order-page.component.scss',
})
export class LgCustomOrderPageComponent {
  private readonly customOrderService = inject(CustomOrderService);
  private readonly toast              = inject(ToastService);
  private readonly meta               = inject(Meta);
  private readonly title              = inject(Title);
  private readonly platformId         = inject(PLATFORM_ID);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home',               route: '/' },
    { label: 'Commission a Piece', route: '/custom-order' },
  ];

  protected readonly whatsappHref = `https://wa.me/${environment.whatsappPhone}`;

  protected readonly isSubmitting = signal(false);
  protected readonly filePreviews = signal<FilePreview[]>([]);
  protected readonly selectedFiles = computed(() => this.filePreviews().map(p => p.file));

  protected readonly form = new FormGroup({
    name:    new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phone:   new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email:   new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    city:    new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.title.setTitle('Commission a Piece — Lugar Furniture');
    this.meta.updateTag({ name: 'description', content: 'Commission a custom handcrafted furniture piece from Lugar\'s Cairo atelier. Tell us your vision and our team will bring it to life.' });
  }

  protected fieldError(controlName: keyof typeof this.form.controls): string {
    const ctrl = this.form.controls[controlName];
    if (!ctrl.invalid || !ctrl.touched) return '';
    if (ctrl.errors?.['required']) return 'This field is required';
    if (ctrl.errors?.['email'])    return 'Please enter a valid email';
    return 'Invalid value';
  }

  protected onFilesChange(files: File[]): void {
    // Revoke previous object URLs to free memory
    this.filePreviews().forEach(p => {
      if (isPlatformBrowser(this.platformId)) URL.revokeObjectURL(p.previewUrl);
    });

    const previews: FilePreview[] = files.map(file => ({
      file,
      name: file.name,
      previewUrl: isPlatformBrowser(this.platformId)
        ? URL.createObjectURL(file)
        : '',
    }));
    this.filePreviews.set(previews);
  }

  protected removeFile(index: number): void {
    const current = this.filePreviews();
    if (isPlatformBrowser(this.platformId)) {
      URL.revokeObjectURL(current[index].previewUrl);
    }
    this.filePreviews.set(current.filter((_, i) => i !== index));
  }

  private clearPreviews(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.filePreviews().forEach(p => URL.revokeObjectURL(p.previewUrl));
    }
    this.filePreviews.set([]);
  }

  protected onSubmit(): void {
    if (this.isSubmitting()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const v     = this.form.getRawValue();
    const files = this.selectedFiles();

    const uploads$ = files.length
      ? forkJoin(files.map(f => this.customOrderService.uploadImage(f)))
      : of<string[]>([]);

    uploads$.pipe(
      switchMap(imageUrls =>
        this.customOrderService.submitOrder({ ...v, imageUrls }),
      ),
    ).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toast.show('Request submitted! Our team will contact you within 24 hours.', 'success');
        this.form.reset();
        this.clearPreviews();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toast.show('Failed to submit request. Please try again.', 'error');
      },
    });
  }
}
