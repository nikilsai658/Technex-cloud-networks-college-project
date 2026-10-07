import { ChangeDetectorRef, Component ,ChangeDetectionStrategy, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../../features/services/ticket/ticket-service';
import { ToastService } from '../../../core/toast/toast-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';

@Component({
  selector: 'app-raise-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FieldErrorPipe],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketComponent {

  private toast = inject(ToastService);

  loading = false;

   ticketForm: any;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.ticketForm = this.fb.group({
      subject: ['', [...AppValidators.requiredText, Validators.minLength(5), Validators.maxLength(150)]],
      description: ['', [...AppValidators.requiredText, Validators.minLength(10), Validators.maxLength(2000)]]
    });

  }

  resetForm() {

    this.ticketForm.reset();
    this.cdr.markForCheck();

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
        this.cdr.markForCheck();

        // The toast lives at the app root, so it stays visible after navigating
        this.router.navigate(['/main/mytickets']).then(() =>
          this.toast.successFrom(res, 'Ticket Raised Successfully')
        );
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      }
    });
  }
}