import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { TicketService } from '../../../features/services/ticket/ticket-service';

@Component({
  selector: 'app-reply-ticket',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './replyticket.html',
  styleUrl: './replyticket.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplyTicketComponent implements OnInit, OnDestroy {

  ticketId!: number;

  ticket: any = null;

  messages: any[] = [];

  message = '';

  loading = false;

  sending = false;

  lastMessageId = 0;

  private pollingId: ReturnType<typeof setInterval> | null = null;

  private readonly pollingInterval = 2000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.ticketId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Ticket ID:', this.ticketId);

    if (!this.ticketId || isNaN(this.ticketId)) {

      console.error('Invalid ticket ID');

      this.router.navigate([
        '/main/my-tickets'
      ]);

      return;
    }

    this.getTicket();

    this.startPolling();
  }

  // ==========================================
  // GET TICKET
  // ==========================================

  getTicket(): void {

    this.loading = true;

    this.ticketService
      .getTicketById(this.ticketId)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Ticket response:',
            res
          );

          this.ticket = res?.data ?? null;

          if (this.ticket?.replies?.length) {

            this.messages = [
              ...this.ticket.replies
            ];

            const lastMessage =
              this.messages[
                this.messages.length - 1
              ];

            if (lastMessage?.id) {

              this.lastMessageId =
                Number(lastMessage.id);
            }
          }

          this.loading = false;

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(
            'Error loading ticket:',
            err
          );

          this.loading = false;

          this.cdr.markForCheck();
        }

      });
  }

  // ==========================================
  // START POLLING
  // ==========================================

  startPolling(): void {

    if (this.pollingId) {
      return;
    }

    console.log(
      'HTTP polling started'
    );

    // Load immediately
    this.loadMessages();

    // Check every 2 seconds
    this.pollingId = setInterval(() => {

      this.loadMessages();

    }, this.pollingInterval);
  }

  // ==========================================
  // LOAD MESSAGES
  // ==========================================

  loadMessages(): void {

    if (!this.ticketId) {
      return;
    }

    this.ticketService
      .getMessages(
        this.ticketId,
        this.lastMessageId
      )
      .subscribe({

        next: (res: any) => {

          const newMessages =
            res?.data ?? [];

          if (!newMessages.length) {
            return;
          }

          console.log(
            'New messages:',
            newMessages
          );

          for (const newMessage of newMessages) {

            const exists =
              this.messages.some(
                msg =>
                  Number(msg.id) ===
                  Number(newMessage.id)
              );

            if (!exists) {

              this.messages.push(
                newMessage
              );
            }
          }

          const lastMessage =
            newMessages[
              newMessages.length - 1
            ];

          if (lastMessage?.id) {

            this.lastMessageId =
              Number(lastMessage.id);
          }

          this.cdr.markForCheck();

          setTimeout(() => {
            this.scrollToBottom();
          });
        },

        error: (err) => {

          console.error(
            'Error loading messages:',
            err
          );
        }

      });
  }

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  send(): void {

    const text =
      this.message.trim();

    if (!text) {
      return;
    }

    if (this.sending) {
      return;
    }

    this.sending = true;

    this.ticketService
      .replyTicket(
        this.ticketId,
        text
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Message sent:',
            res
          );

          this.message = '';

          this.sending = false;

          this.cdr.markForCheck();

          // Immediately check for the new message
          this.loadMessages();
        },

        error: (err) => {

          console.error(
            'Message send failed:',
            err
          );

          this.sending = false;

          this.cdr.markForCheck();
        }

      });
  }

  // ==========================================
  // SCROLL
  // ==========================================

  private scrollToBottom(): void {

    const container =
      document.querySelector(
        '.chat-messages'
      ) as HTMLElement | null;

    if (!container) {
      return;
    }

    container.scrollTop =
      container.scrollHeight;
  }

  // ==========================================
  // BACK
  // ==========================================

  back(): void {

    this.stopPolling();

    this.router.navigate([
      '/main/my-tickets'
    ]);
  }

  // ==========================================
  // STOP POLLING
  // ==========================================

  stopPolling(): void {

    if (this.pollingId) {

      clearInterval(
        this.pollingId
      );

      this.pollingId = null;

      console.log(
        'HTTP polling stopped'
      );
    }
  }

  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    console.log(
      'Leaving ticket:',
      this.ticketId
    );

    this.stopPolling();
  }

  // ==========================================
  // MESSAGE OWNER
  // ==========================================

  isMyMessage(msg: any): boolean {

    return String(msg.senderId) ===
      String(this.ticket?.studentId);
  }
  sendOnEnter(event: Event): void {

  const keyboardEvent = event as KeyboardEvent;

  if (keyboardEvent.shiftKey) {
    return;
  }

  event.preventDefault();

  this.send();
}
}