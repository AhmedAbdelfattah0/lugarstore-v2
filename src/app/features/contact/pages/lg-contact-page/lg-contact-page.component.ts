import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ContactService } from '../../services/contact.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LgNavbarComponent } from '../../../../shared/components/navigation/lg-navbar/lg-navbar.component';
import { LgFooterComponent } from '../../../../shared/components/navigation/lg-footer/lg-footer.component';
import { LgBreadcrumbComponent } from '../../../../shared/components/navigation/lg-breadcrumb/lg-breadcrumb.component';
import { LgSpinnerComponent } from '../../../../shared/components/ui/lg-spinner/lg-spinner.component';
import { BreadcrumbItem } from '../../../../shared/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'lg-contact-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LgNavbarComponent,
    LgFooterComponent,
    LgBreadcrumbComponent,
    LgSpinnerComponent,
  ],
  templateUrl: './lg-contact-page.component.html',
  styleUrl: './lg-contact-page.component.scss',
})
export class LgContactPageComponent {
  private readonly contactService = inject(ContactService);
  private readonly toast          = inject(ToastService);
  private readonly meta           = inject(Meta);
  private readonly title          = inject(Title);

  protected readonly breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home',    route: '/' },
    { label: 'Contact', route: '/contact' },
  ];

  protected readonly whatsappHref = `https://wa.me/${environment.whatsappPhone}`;

  protected readonly isSubmitting = signal(false);

  protected readonly form = new FormGroup({
    name:    new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email:   new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone:   new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(20)] }),
  });

  constructor() {
    this.title.setTitle('Contact Us — Lugar Furniture');
    this.meta.updateTag({ name: 'description', content: 'Get in touch with the Lugar Furniture atelier in Cairo. Visit us, send a message, or reach us via WhatsApp.' });
  }

  protected fieldError(controlName: keyof typeof this.form.controls): string {
    const ctrl = this.form.controls[controlName];
    if (!ctrl.invalid || !ctrl.touched) return '';
    if (ctrl.errors?.['required'])   return 'This field is required';
    if (ctrl.errors?.['email'])      return 'Please enter a valid email';
    if (ctrl.errors?.['minlength'])  return 'Message must be at least 20 characters';
    return 'Invalid value';
  }

  protected onSubmit(): void {
    if (this.isSubmitting()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const v = this.form.getRawValue();

    this.contactService.sendMessage(v).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toast.show('Message sent successfully', 'success');
        this.form.reset();
      },
      error: () => {
        this.isSubmitting.set(false);
        this.toast.show('Failed to send message. Please try again.', 'error');
      },
    });
  }
}
