import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../../features/services/ticket/ticket-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-all-tickets',
  templateUrl: './alltickets.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./alltickets.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllTicketsComponent implements OnInit {

  tickets: any[] = [];

  loading = false;
  errorMessage = '';

  selectedStatus: string = 'All';
  statusOptions: string[] = ['All', 'Open', 'Pending', 'Closed'];

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTickets();
  }

  // Get all tickets
  getTickets(): void {

    this.loading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({

      next: (res: any) => {

        console.log('Tickets response:', res);

        // If API returns { data: [...] }
        this.tickets = res?.data || [];

        this.loading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {

        console.error('Get tickets error:', error);

        this.errorMessage =
          'Unable to load tickets. Please try again.';

        this.loading = false;
      }

    });

  }


  // Tickets filtered by the selected status
  get filteredTickets(): any[] {

    if (!this.selectedStatus || this.selectedStatus === 'All') {
      return this.tickets;
    }

    return this.tickets.filter(ticket =>
      (ticket.status || 'Open').toLowerCase() ===
      this.selectedStatus.toLowerCase()
    );

  }


  // Open selected ticket
  openTicket(ticketId: number): void {

  console.log('Opening ticket:', ticketId);

  this.router.navigate([
    '/main/support-ticket-details',
    ticketId
  ]);

}

}