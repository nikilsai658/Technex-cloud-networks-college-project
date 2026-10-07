import { Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';

// Cuts long text off with "…" and shows the full text as a tooltip,
// but only when it is actually cut off.
//
//   Table cell (one line):  <td><span appEllipsis>{{ item.name }}</span></td>
//   Card text (N lines):    <p appEllipsis="2">{{ item.description }}</p>
//
// Inside a table, put it on an element inside the <td> — browsers ignore
// max-width on table cells themselves.
@Directive({
  selector: '[appEllipsis]',
  host: {
    '[style.display]': 'lines() > 1 ? "-webkit-box" : "block"',
    '[style.overflow]': '"hidden"',
    '[style.text-overflow]': 'lines() > 1 ? null : "ellipsis"',
    '[style.white-space]': 'lines() > 1 ? null : "nowrap"',
    '[style.max-width]': 'lines() > 1 ? null : maxWidth()',
    '[style.-webkit-line-clamp]': 'lines() > 1 ? lines() : null',
    '[style.-webkit-box-orient]': 'lines() > 1 ? "vertical" : null',
    '[style.overflow-wrap]': 'lines() > 1 ? "anywhere" : null',
    '(mouseenter)': 'updateTitle()',
    '(focusin)': 'updateTitle()',
  },
})
export class Ellipsis {

  // Number of visible lines; '' (bare attribute) means 1
  readonly lines = input(1, {
    alias: 'appEllipsis',
    transform: (value: unknown) => numberAttribute(value, 1) || 1,
  });

  // Width limit for single-line text (mainly table cells)
  readonly maxWidth = input('260px', { alias: 'ellipsisMaxWidth' });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  updateTitle(): void {

    const node = this.el.nativeElement;

    const isCut =
      node.scrollWidth > node.clientWidth + 1 ||
      node.scrollHeight > node.clientHeight + 1;

    if (isCut) {
      node.title = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
    } else {
      node.removeAttribute('title');
    }
  }
}
