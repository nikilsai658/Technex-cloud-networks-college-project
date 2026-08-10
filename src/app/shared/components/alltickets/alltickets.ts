import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../../features/services/ticket/ticket-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-all-tickets',
  templateUrl: './alltickets.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./alltickets.css']
})
export class AllTicketsComponent implements OnInit {

  tickets: any[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private ticketService: TicketService,
    private router: Router
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
      },

      error: (error) => {

        console.error('Get tickets error:', error);

        this.errorMessage =
          'Unable to load tickets. Please try again.';

        this.loading = false;
      }

    });

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