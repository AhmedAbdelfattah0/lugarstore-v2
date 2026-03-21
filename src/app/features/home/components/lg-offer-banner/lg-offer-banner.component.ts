import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const DISMISS_KEY = 'offerBannerDismissed';
// Sale ends 7 days from first view
const SALE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'lg-offer-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-offer-banner.component.html',
  styleUrl: './lg-offer-banner.component.scss',
})
export class LgOfferBannerComponent implements OnInit, OnDestroy {
  private readonly platformId  = inject(PLATFORM_ID);
  private readonly storage     = inject(StorageService);

  protected readonly visible    = signal(true);
  protected readonly timeLeft   = signal<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 });

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private endTime = 0;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const dismissed = this.storage.get(DISMISS_KEY);
    if (dismissed === 'true') {
      this.visible.set(false);
      return;
    }

    const storedEnd = this.storage.get('offerBannerEnd');
    if (storedEnd) {
      this.endTime = Number(storedEnd);
    } else {
      this.endTime = Date.now() + SALE_DURATION_MS;
      this.storage.set('offerBannerEnd', String(this.endTime));
    }

    this.tick();
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) clearInterval(this.intervalId);
  }

  private tick(): void {
    const diff = Math.max(0, this.endTime - Date.now());
    const totalSeconds = Math.floor(diff / 1000);
    const hours   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    this.timeLeft.set({ hours, minutes, seconds });
    if (diff <= 0 && this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected dismiss(): void {
    this.visible.set(false);
    this.storage.set(DISMISS_KEY, 'true');
  }
}
