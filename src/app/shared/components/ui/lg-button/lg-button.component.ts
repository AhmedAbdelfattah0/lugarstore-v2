import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { LgSpinnerComponent } from '../lg-spinner/lg-spinner.component';

export type ButtonVariant = 'primary' | 'outlined' | 'ghost' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lg-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LgSpinnerComponent],
  templateUrl: './lg-button.component.html',
  styleUrl: './lg-button.component.scss',
  host: {
    '[class.lg-full]': 'full()',
  },
})
export class LgButtonComponent {
  readonly variant  = input<ButtonVariant>('primary');
  readonly size     = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading  = input<boolean>(false);
  readonly type     = input<'button' | 'submit' | 'reset'>('button');
  readonly full     = input<boolean>(false);

  readonly buttonClass = computed(() => {
    const v = this.variant();
    const s = this.size();
    const isDisabled = this.disabled() || this.loading();

    const base = [
      'inline-flex items-center justify-center gap-2',
      'border outline-none transition-colors duration-200',
      'font-[Montserrat] font-light uppercase tracking-[0.15em]',
    ].join(' ');

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    const variants: Record<ButtonVariant, string> = {
      primary:  'bg-[#B88E2F] text-white border-[#B88E2F] hover:bg-[#9A7A32] hover:border-[#9A7A32]',
      outlined: 'bg-transparent text-[#B88E2F] border-[#B88E2F] hover:bg-[#B88E2F] hover:text-white',
      ghost:    'bg-transparent text-white border-white hover:bg-white hover:text-[#1A1A18]',
      text:     'bg-transparent text-[#B88E2F] border-transparent !px-0 hover:text-[#9A7A32]',
    };

    const disabled = isDisabled ? 'opacity-50 pointer-events-none' : '';
    const full = this.full() ? 'w-full' : '';

    return [base, sizes[s], variants[v], disabled, full].filter(Boolean).join(' ');
  });
}
