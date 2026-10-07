import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  leaving: boolean;
}

// App-wide notification tags (replaces the browser's blocking alert()).
// Rendered once by <app-toast> in app.html.
@Injectable({
  providedIn: 'root',
})
export class ToastService {

  readonly toasts = signal<Toast[]>([]);

  private nextId = 1;

  private readonly LEAVE_ANIMATION_MS = 250;

  private readonly MAX_VISIBLE = 4;

  success(message: string, duration = 3000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration = 4500): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 4000): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 3000): void {
    this.show('info', message, duration);
  }

  // Prefers the message the backend sent, falling back to our own text.
  successFrom(res: any, fallback: string): void {
    this.success(this.messageFrom(res) || fallback);
  }

  dismiss(id: number): void {

    this.toasts.update(list =>
      list.map(t => (t.id === id ? { ...t, leaving: true } : t))
    );

    setTimeout(() => {
      this.toasts.update(list => list.filter(t => t.id !== id));
    }, this.LEAVE_ANIMATION_MS);
  }

  private show(type: ToastType, message: string, duration: number): void {

    const text = (message || '').trim();

    if (!text) {
      return;
    }

    // Don't stack the exact same message twice at once
    if (this.toasts().some(t => !t.leaving && t.type === type && t.message === text)) {
      return;
    }

    const id = this.nextId++;

    this.toasts.update(list =>
      [...list, { id, type, message: text, leaving: false }].slice(-this.MAX_VISIBLE)
    );

    setTimeout(() => this.dismiss(id), duration);
  }

  private messageFrom(res: any): string {

    if (typeof res === 'string') {
      return res;
    }

    const message = res?.message ?? res?.Message;

    return typeof message === 'string' ? message : '';
  }
}
