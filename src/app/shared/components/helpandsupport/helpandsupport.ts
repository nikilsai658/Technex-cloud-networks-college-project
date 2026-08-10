import { ChangeDetectorRef, Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketService } from '../../../features/services/ticket/ticket-service'

@Component({
  selector: 'app-raise-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './raise-ticket.html',
  styleUrls: ['./raise-ticket.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaiseTicketComponent implements OnInit {

  ticketForm: FormGroup;
  loading = false;
  tickets: any[] = [];
  error = '';
  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private cdr:ChangeDetectorRef
  ) {

    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      description: ['', Validators.required]
    });

  }
    ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;

    this.ticketService.getticketmy().subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res.isFailure) {
          this.tickets = res.data || [];
        } else {
          this.tickets = [];
          this.error = 'Unable to load tickets';
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.error = 'Something went wrong';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open':
        return 'status-open';

      case 'Closed':
        return 'status-closed';

      case 'In Progress':
        return 'status-progress';

      default:
        return 'status-default';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'priority-high';

      case 'Medium':
        return 'priority-medium';

      case 'Low':
        return 'priority-low';

      default:
        return 'priority-default';
    }
  }

  viewConversation(ticket: any) {
    console.log(ticket);
    // this.router.navigate(['/main/ticket', ticket.id]);
  }
  submit() {

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.ticketService.createTicket(this.ticketForm.value).subscribe({
      next: () => {
        alert('Ticket Raised Successfully');
        this.ticketForm.reset();
        this.loading = false;
      },
      error: () => {
        alert('Failed to Raise Ticket');
        this.loading = false;
      }
    });

  }

}