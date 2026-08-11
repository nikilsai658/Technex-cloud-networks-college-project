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
export class ReplyTicketComponent
  implements OnInit, OnDestroy {

  ticketId!: number;

  ticket: any = null;

  messages: any[] = [];

  message = '';

  loading = false;

  messagesLoading = false;

  sending = false;

  lastMessageId = 0;

  private pollingId: ReturnType<typeof setInterval> | null = null;

  private readonly pollingInterval = 2000;

  readonly maxMessageLength = 1000;


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

    this.ticketId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Ticket ID:', this.ticketId);

    if (!this.ticketId || isNaN(this.ticketId)) {

      console.error('Invalid Ticket ID');

      this.router.navigate([
        '/main/my-tickets'
      ]);

      return;
    }

    this.loadTicket();

    this.loadMessages();

    this.startPolling();
  }


  // ==========================================
  // LOAD TICKET
  // ==========================================

  loadTicket(): void {

    this.loading = true;

    this.ticketService
      .getTicketById(this.ticketId)
      .subscribe({

        next: (res: any) => {

          console.log(
            'Ticket response:',
            res
          );

          this.ticket =
            res?.data ?? null;

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
  // LOAD MESSAGES
  // ==========================================

  loadMessages(): void {

    if (!this.ticketId) {
      return;
    }

    this.messagesLoading = true;

    this.ticketService
      .getMessages(
        this.ticketId,
        this.lastMessageId
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Messages response:',
            res
          );

          const newMessages =
            res?.data ?? [];

          if (!Array.isArray(newMessages)) {

            this.messagesLoading = false;

            this.cdr.markForCheck();

            return;
          }


          /*
           * Add only new messages.
           */
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


          /*
           * Update last message ID.
           */
          if (newMessages.length > 0) {

            const lastMessage =
              newMessages[
                newMessages.length - 1
              ];

            if (lastMessage?.id) {

              this.lastMessageId =
                Number(lastMessage.id);
            }
          }


          this.messagesLoading = false;

          this.cdr.markForCheck();


          /*
           * Scroll after Angular
           * renders messages.
           */
          setTimeout(() => {

            this.scrollToBottom();

          });

        },

        error: (err) => {

          console.error(
            'Error loading messages:',
            err
          );

          this.messagesLoading = false;

          this.cdr.markForCheck();
        }

      });
  }


  // ==========================================
  // REFRESH
  // ==========================================

  refresh(): void {

    console.log(
      'Refreshing conversation'
    );

    /*
     * Reload all messages.
     */
    this.lastMessageId = 0;

    this.messages = [];

    this.loadTicket();

    this.loadMessages();
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

    this.pollingId = setInterval(() => {

      this.loadMessages();

    }, this.pollingInterval);
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

    if (
      text.length >
      this.maxMessageLength
    ) {
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

          /*
           * Get the newly created
           * message immediately.
           */
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
  // MESSAGE POSITION
  // ==========================================

  isMyMessage(msg: any): boolean {

    const role =
      String(msg?.senderRole || '')
        .trim()
        .toLowerCase();

    /*
     * Student = YOU
     *
     * Student -> RIGHT
     *
     * Admin/Superadmin -> LEFT
     */

    return role === 'student';
  }


  // ==========================================
  // ADMIN MESSAGE
  // ==========================================

  isAdminMessage(msg: any): boolean {

    return !this.isMyMessage(msg);
  }


  // ==========================================
  // SENDER LABEL
  // ==========================================

  getSenderLabel(msg: any): string {

    /*
     * Student's own message
     */
    if (this.isMyMessage(msg)) {
      return 'You';
    }


    /*
     * Admin / Superadmin message
     */
    const senderName =
      msg?.senderName || 'Admin';

    const senderRole =
      msg?.senderRole || 'Admin';

    return `${senderName} (${senderRole})`;
  }


  // ==========================================
  // SCROLL TO BOTTOM
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
  // ENTER TO SEND
  // ==========================================

  sendOnEnter(event: Event): void {

    const keyboardEvent =
      event as KeyboardEvent;

    /*
     * Shift + Enter
     * = new line
     */
    if (keyboardEvent.shiftKey) {
      return;
    }

    /*
     * Enter
     * = send
     */
    event.preventDefault();

    this.send();
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

    this.stopPolling();
  }

}