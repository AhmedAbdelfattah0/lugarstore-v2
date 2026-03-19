import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LgToastComponent } from './shared/components/feedback/lg-toast/lg-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LgToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('lugar-store');
}
