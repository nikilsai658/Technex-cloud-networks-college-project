import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../../features/services/ticket/ticket-service';

@Component({
  selector: 'app-raise-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class TicketComponent {

  loading = false;

   ticketForm: any;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    public router: Router
  ) {

    this.ticketForm = this.fb.group({
      subject: ['', Validators.required],
      description: ['', Validators.required]
    });

  }

  submit() {

    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.ticketService.createTicket(this.ticketForm.value).subscribe({
      next: (res: any) => {

        this.loading = false;

        alert('Ticket Raised Successfully');
        this.router.navigate(['/main/mytickets']);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      }
    });
  }
}