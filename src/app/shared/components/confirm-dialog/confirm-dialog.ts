import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { ConfirmService } from '../../../core/confirm/confirm-service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class ConfirmDialogComponent {

  readonly confirm = inject(ConfirmService);

  private readonly cancelButton = viewChild<ElementRef<HTMLButtonElement>>('cancelButton');

  private lastFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.confirm.state()) {
        // Focus Cancel by default so Enter never deletes by accident
        this.lastFocused = document.activeElement as HTMLElement | null;
        queueMicrotask(() => this.cancelButton()?.nativeElement.focus());
      } else if (this.lastFocused) {
        this.lastFocused.focus?.();
        this.lastFocused = null;
      }
    });
  }

  onEscape(): void {
    if (this.confirm.state()) {
      this.confirm.close(false);
    }
  }
}
