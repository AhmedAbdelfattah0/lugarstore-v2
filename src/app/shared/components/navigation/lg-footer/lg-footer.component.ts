import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'lg-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './lg-footer.component.html',
  styleUrl: './lg-footer.component.scss',
})
export class LgFooterComponent {
  protected readonly emailControl = new FormControl('', [Validators.required, Validators.email]);
  protected readonly subscribed = signal(false);

  protected readonly footerColumns = [
    {
      heading: 'The Gallery',
      links: [
        { label: 'Collections',    href: '/products' },
        { label: 'Living Rooms',   href: '/products?category=living' },
        { label: 'Bedrooms',       href: '/products?category=bedroom' },
        { label: 'Dining Rooms',   href: '/products?category=dining' },
        { label: 'Hot Deals',      href: '/hot-deals' },
      ],
    },
    {
      heading: 'Concierge',
      links: [
        { label: 'Custom Orders',  href: '/custom-order' },
        { label: 'Atelier',        href: '/atelier' },
        { label: 'Contact Us',     href: '/contact' },
        { label: 'WhatsApp',       href: 'https://wa.me/201080777114' },
      ],
    },
    {
      heading: 'The Journal',
      links: [
        { label: 'Design Stories', href: '#' },
        { label: 'Care Guides',    href: '#' },
        { label: 'Inspiration',    href: '#' },
        { label: 'Press',          href: '#' },
      ],
    },
  ];

  protected readonly socials = [
    { label: 'Instagram', href: 'https://www.instagram.com/lugarfurniture.eg/',                                        icon: 'instagram' },
    { label: 'Facebook',  href: 'https://www.facebook.com/lugarinv?mibextid=ZbWKwL',                                  icon: 'facebook' },
    { label: 'TikTok',    href: 'https://www.tiktok.com/@lugarfurnitureinv?_t=8sj2O0ysXQo&_r=1',                      icon: 'tiktok' },
    { label: 'WhatsApp',  href: 'https://wa.me/201080777114',                                                         icon: 'whatsapp' },
  ];

  protected readonly currentYear = new Date().getFullYear();

  subscribe(): void {
    if (this.emailControl.invalid) return;
    this.subscribed.set(true);
    this.emailControl.reset();
  }
}
