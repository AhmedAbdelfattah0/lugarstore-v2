import { Pipe, PipeTransform } from '@angular/core';

/**
 * Recreates AddSpaceAfterCurrencyPipe from the old project.
 * Formats a number as "EGP 2,500" — space between code and amount.
 */
@Pipe({
  name: 'lgCurrencyEgp',
  standalone: true,
})
export class CurrencyEgpPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '';
    const formatted = new Intl.NumberFormat('en-US').format(value);
    return `EGP ${formatted}`;
  }
}
