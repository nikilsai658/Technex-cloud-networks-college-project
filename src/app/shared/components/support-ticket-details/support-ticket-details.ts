import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
  TicketService
} from '../../../features/services/ticket/ticket-service';


@Component({
  selector: 'app-support-ticket-details',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],

  templateUrl: './support-ticket-details.html',

  styleUrls: ['./support-ticket-details.css'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportTicketDetailsComponent
  implements OnInit {

  // ==========================================
  // TICKET
  // ==========================================

  ticketId!: number;

  ticket: any = null;


  // ==========================================
  // MESSAGES
  // ==========================================

  messages: any[] = [];

  message = '';


  // ==========================================
  // LOADING
  // ==========================================

  loading = false;

  messagesLoading = false;

  sending = false;

  updatingStatus = false;


  // ==========================================
  // ERROR
  // ==========================================

  errorMessage = '';


  // ==========================================
  // STATUS
  // ==========================================

  selectedStatus = '';


  // ==========================================
  // LAST MESSAGE ID
  // ==========================================

  lastMessageId = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = Number(params.get('id'));

      if (!id) {

        this.errorMessage =
          'Invalid ticket ID.';

        this.cdr.markForCheck();

        return;
      }

      this.ticketId = id;

      this.getTicket();

      this.getMessages();

    });

  }


  // ==========================================
  // GET TICKET
  // ==========================================

  getTicket(): void {

    this.loading = true;

    this.errorMessage = '';

    this.cdr.markForCheck();


    this.ticketService
      .getTicketById(this.ticketId)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Ticket response:',
            res
          );

          this.ticket =
            res?.data || res;


          this.selectedStatus =
            this.ticket?.status || 'Open';


          this.loading = false;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Get ticket error:',
            error
          );

          this.errorMessage =
            'Unable to load ticket details.';

          this.loading = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // GET MESSAGES
  // ==========================================

  getMessages(): void {

    this.messagesLoading = true;

    this.cdr.markForCheck();


    this.ticketService
      .getMessages(this.ticketId, 0)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Messages response:',
            res
          );


          this.messages =
            res?.data || res || [];


          console.log(
            'Conversation messages:',
            this.messages
          );


          this.updateLastMessageId();


          this.messagesLoading = false;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Get messages error:',
            error
          );

          this.messagesLoading = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // LAST MESSAGE ID
  // ==========================================

  updateLastMessageId(): void {

    if (!this.messages.length) {

      this.lastMessageId = 0;

      return;

    }


    const ids = this.messages
      .map(item => Number(item.id))
      .filter(id => !isNaN(id));


    if (ids.length) {

      this.lastMessageId =
        Math.max(...ids);

    }

  }


  // ==========================================
  // SEND REPLY
  // ==========================================

  sendReply(): void {

    // Don't allow reply if ticket is closed
    if (
      this.ticket?.status
        ?.toLowerCase() === 'closed'
    ) {

      return;

    }


    const text =
      this.message.trim();


    if (!text || this.sending) {

      return;

    }


    this.sending = true;

    this.cdr.markForCheck();


    this.ticketService
      .replyTicket(
        this.ticketId,
        text
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Reply response:',
            res
          );


          this.message = '';

          this.sending = false;


          // Reload messages
          this.getMessages();

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Send reply error:',
            error
          );


          this.sending = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CHANGE STATUS
  // ==========================================

  changeStatus(status: string): void {

    if (
      !status ||
      this.updatingStatus
    ) {

      return;

    }


    this.updatingStatus = true;

    this.cdr.markForCheck();


    const data = {
      status: status
    };


    this.ticketService
      .updateTicketstatus(
        this.ticketId,
        data
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Status updated:',
            res
          );


          this.selectedStatus =
            status;


          if (this.ticket) {

            this.ticket.status =
              status;

          }


          this.updatingStatus = false;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Status update error:',
            error
          );


          this.updatingStatus = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // CLOSE TICKET
  // ==========================================

  closeTicket(): void {

    if (
      this.updatingStatus ||
      this.ticket?.status
        ?.toLowerCase() === 'closed'
    ) {

      return;

    }


    this.updatingStatus = true;

    this.cdr.markForCheck();


    const data = {
      status: 'Closed'
    };


    this.ticketService
      .updateTicketstatus(
        this.ticketId,
        data
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Ticket closed:',
            res
          );


          this.selectedStatus =
            'Closed';


          if (this.ticket) {

            this.ticket.status =
              'Closed';

          }


          this.message = '';

          this.updatingStatus = false;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Close ticket error:',
            error
          );


          this.updatingStatus = false;

          this.cdr.markForCheck();

        }

      });

  }


  // ==========================================
  // REFRESH
  // ==========================================

  refreshMessages(): void {

    this.getMessages();

  }


  // ==========================================
  // BACK
  // ==========================================

  back(): void {

    this.router.navigate([
      '/main/alltickets'
    ]);

  }

}