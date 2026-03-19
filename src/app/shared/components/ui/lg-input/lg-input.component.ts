import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
} from '@angular/core';

export type InputVariant = 'text' | 'textarea' | 'select' | 'file-upload';

let _inputIdCounter = 0;

@Component({
  selector: 'lg-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lg-input.component.html',
  styleUrl: './lg-input.component.scss',
})
export class LgInputComponent {
  readonly type        = input<InputVariant>('text');
  readonly label       = input<string>('');
  readonly placeholder = input<string>('');
  readonly value       = input<string>('');
  readonly disabled    = input<boolean>(false);
  readonly error       = input<string>('');
  readonly required    = input<boolean>(false);
  readonly multiple    = input<boolean>(false);
  readonly options     = input<{ value: string; label: string }[]>([]);

  readonly valueChange = output<string>();
  readonly filesChange = output<File[]>();

  protected readonly inputId  = `lg-input-${++_inputIdCounter}`;
  protected readonly hasError = computed(() => !!this.error());
  protected readonly isDragging = signal(false);

  protected onValueChange(event: Event): void {
    const el = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.valueChange.emit(el.value);
  }

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);
    this.filesChange.emit(files);
    this.valueChange.emit(
      files.length === 1 ? files[0].name : `${files.length} files selected`,
    );
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(): void {
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (!files?.length) return;
    const arr = Array.from(files);
    this.filesChange.emit(arr);
    this.valueChange.emit(
      arr.length === 1 ? arr[0].name : `${arr.length} files selected`,
    );
  }
}
