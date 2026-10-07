import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { Router } from '@angular/router';

import { TicketService } from '../../../features/services/ticket/ticket-service';
import { Ellipsis } from '../../directives/ellipsis';
import { TICKET_STATUSES, normalizeTicketStatus, ticketStatusLabel } from '../../models/ticket-status';

interface KanbanColumn {
  status: string;
  label: string;
  tickets: any[];
}

@Component({
  selector: 'app-my-ticket',
  standalone: true,

  imports: [Ellipsis, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ],

  templateUrl: './mytickets.html',
  styleUrl: './mytickets.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTicketComponent implements OnInit, OnDestroy {

  // =====================================
  // TICKETS
  // =====================================

  tickets: any[] = [];

  loading = false;

  errorMessage = '';

  statusOptions: string[] = [...TICKET_STATUSES];

  columns: KanbanColumn[] = [];

  connectedDropListIds: string[] = [];

  // Background refresh so status changes made by the admin show up
  // without reloading the page.
  private pollHandle: ReturnType<typeof setInterval> | null = null;

  private readonly POLL_INTERVAL_MS = 5000;

  private refreshing = false;

  private dragging = false;

  private pendingUpdates = 0;


  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  // =====================================
  // INIT
  // =====================================

  ngOnInit(): void {

    this.connectedDropListIds =
      this.statusOptions.map(status => `drop-list-${status}`);

    this.getMyTickets();

    this.pollHandle = setInterval(
      () => this.refreshTickets(),
      this.POLL_INTERVAL_MS
    );

  }

  ngOnDestroy(): void {

    if (this.pollHandle) {

      clearInterval(this.pollHandle);

      this.pollHandle = null;

    }

  }


  // =====================================
  // SILENT REFRESH
  // =====================================

  // Unlike getMyTickets() this never shows the loading spinner, and it
  // skips while a card is being dragged or a move is still saving.
  private refreshTickets(): void {

    if (
      this.loading ||
      this.refreshing ||
      this.dragging ||
      this.pendingUpdates > 0
    ) {
      return;
    }

    this.refreshing = true;

    this.ticketService
      .getticketmy(true)
      .subscribe({

        next: (res: any) => {

          this.refreshing = false;

          if (this.dragging || this.pendingUpdates > 0) {
            return;
          }

          const latest: any[] = res?.data || [];

          if (!this.ticketsChanged(latest)) {
            return;
          }

          this.tickets = latest;

          this.buildColumns();

          this.cdr.markForCheck();

        },

        error: () => {

          this.refreshing = false;

        }

      });

  }

  private ticketsChanged(latest: any[]): boolean {

    if (latest.length !== this.tickets.length) {
      return true;
    }

    const current = new Map(
      this.tickets.map(t => [t.id, t.status])
    );

    return latest.some(t => current.get(t.id) !== t.status);

  }

  onDragStarted(): void {
    this.dragging = true;
  }

  onDragEnded(): void {
    this.dragging = false;
  }


  // =====================================
  // GET MY TICKETS
  // =====================================

  getMyTickets(): void {

    this.loading = true;

    this.errorMessage = '';

    this.cdr.markForCheck();


    this.ticketService
      .getticketmy()
      .subscribe({

        next: (res: any) => {

          this.tickets =
            res?.data || [];

          this.buildColumns();

          this.loading = false;

          this.cdr.markForCheck();

        },


        error: (err) => {

          console.error(
            'Error getting tickets:',
            err
          );


          this.tickets = [];

          this.columns = [];

          this.loading = false;

          this.errorMessage =
            'Unable to load your tickets. Please try again.';


          this.cdr.markForCheck();

        }

      });

  }


  // =====================================
  // BUILD KANBAN COLUMNS
  // =====================================

  private buildColumns(): void {

    this.columns = this.statusOptions.map(status => ({

      status,

      label: ticketStatusLabel(status),

      tickets: this.tickets.filter(ticket =>
        normalizeTicketStatus(ticket.status) === status
      )

    }));

  }


  // =====================================
  // DRAG & DROP — STATUS CHANGE
  // =====================================

  dropListId(status: string): string {
    return `drop-list-${status}`;
  }

  onDrop(event: CdkDragDrop<any[]>, column: KanbanColumn): void {

    if (event.previousContainer === event.container) {
      return;
    }

    const ticket = event.previousContainer.data[event.previousIndex];
    const previousStatus = ticket.status;

    // Only an admin can reopen a closed ticket
    if (previousStatus?.toLowerCase() === 'closed') {
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    ticket.status = column.status;

    this.cdr.markForCheck();

    this.pendingUpdates++;


    this.ticketService
      .updateTicketstatus(ticket.id, { status: column.status })
      .subscribe({

        next: () => {
          // status change persisted
          this.pendingUpdates--;
        },

        error: (err) => {

          this.pendingUpdates--;

          console.error(
            'Error updating ticket status:',
            err
          );

          ticket.status = previousStatus;

          this.buildColumns();

          this.errorMessage =
            'Unable to move ticket. Please try again.';

          this.cdr.markForCheck();

        }

      });

  }


  // =====================================
  // OPEN TICKET
  // =====================================

  openTicket(ticketId: number): void {

    this.router.navigate([
      '/main/replyticket',
      ticketId
    ]);

  }
  Raise_ticket(): void {
    this.router.navigate(['/main/ticket']);
  }
}
