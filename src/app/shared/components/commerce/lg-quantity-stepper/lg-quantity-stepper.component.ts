import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'lg-quantity-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-quantity-stepper.component.html',
  styleUrl: './lg-quantity-stepper.component.scss',
})
export class LgQuantityStepperComponent {
  readonly value = input.required<number>();
  readonly min   = input<number>(1);
  readonly max   = input<number>(99);

  readonly valueChange = output<number>();

  readonly atMin = computed(() => this.value() <= this.min());
  readonly atMax = computed(() => this.value() >= this.max());

  decrement(): void {
    if (this.atMin()) return;
    this.valueChange.emit(this.value() - 1);
  }

  increment(): void {
    if (this.atMax()) return;
    this.valueChange.emit(this.value() + 1);
  }
}
