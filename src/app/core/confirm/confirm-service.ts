import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title?: string;
  message: string;
  okLabel?: string;
  cancelLabel?: string;
  // 'danger' paints the OK button red (deletes); 'default' uses the brand colour
  tone?: 'danger' | 'default';
}

interface ConfirmState extends Required<ConfirmOptions> {
  resolve: (result: boolean) => void;
}

// App-wide confirmation dialog (replaces the browser's blocking confirm()).
// Rendered once by <app-confirm-dialog> in app.html.
//
//   if (!(await this.confirmDialog.confirm({ message: 'Delete this Year?' }))) return;
@Injectable({
  providedIn: 'root',
})
export class ConfirmService {

  readonly state = signal<ConfirmState | null>(null);

  confirm(options: ConfirmOptions): Promise<boolean> {

    // Only one dialog at a time — a new request cancels the open one
    this.state()?.resolve(false);

    return new Promise<boolean>(resolve => {
      this.state.set({
        title: options.title ?? 'Are you sure?',
        message: options.message,
        okLabel: options.okLabel ?? 'OK',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        tone: options.tone ?? 'danger',
        resolve,
      });
    });
  }

  // Shortcut for the common "Are you sure you want to delete …?" case
  confirmDelete(what = 'this record'): Promise<boolean> {
    return this.confirm({
      title: 'Delete confirmation',
      message: `Are you sure you want to delete ${what}?`,
      tone: 'danger',
    });
  }

  close(result: boolean): void {

    const current = this.state();

    if (!current) {
      return;
    }

    this.state.set(null);
    current.resolve(result);
  }
}
