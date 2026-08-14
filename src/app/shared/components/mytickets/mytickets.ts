import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import { TicketService } from '../../../features/services/ticket/ticket-service';

@Component({
  selector: 'app-my-ticket',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],

  templateUrl: './mytickets.html',
  styleUrl: './mytickets.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTicketComponent implements OnInit {

  // =====================================
  // TICKETS
  // =====================================

  tickets: any[] = [];

  loading = false;

  errorMessage = '';

  selectedStatus: string = 'All';

  statusOptions: string[] =
    ['All', 'Open', 'Pending', 'Resolved', 'Closed'];


  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}


  // =====================================
  // INIT
  // =====================================

  ngOnInit(): void {

    this.getMyTickets();

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

          console.log(
            'My Tickets Response:',
            res
          );


          this.tickets =
            res?.data || [];


          this.loading = false;


          console.log(
            'My Tickets:',
            this.tickets
          );


          this.cdr.markForCheck();

        },


        error: (err) => {

          console.error(
            'Error getting tickets:',
            err
          );


          this.tickets = [];

          this.loading = false;

          this.errorMessage =
            'Unable to load your tickets. Please try again.';


          this.cdr.markForCheck();

        }

      });

  }


  // =====================================
  // FILTERED TICKETS
  // =====================================

  get filteredTickets(): any[] {

    if (!this.selectedStatus || this.selectedStatus === 'All') {
      return this.tickets;
    }

    return this.tickets.filter(ticket =>
      (ticket.status || 'Open').toLowerCase() ===
      this.selectedStatus.toLowerCase()
    );

  }


  // =====================================
  // STATUS FILTER CHANGE
  // =====================================

  onStatusChange(): void {
    this.cdr.markForCheck();
  }


  // =====================================
  // OPEN TICKET
  // =====================================

  openTicket(ticketId: number): void {

    console.log(
      'Opening Ticket ID:',
      ticketId
    );


    this.router.navigate([
      '/main/replyticket',
      ticketId
    ]);

  }

}