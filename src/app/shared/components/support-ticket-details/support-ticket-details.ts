import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
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

import {
  TICKET_STATUSES,
  normalizeTicketStatus,
  ticketStatusLabel
} from '../../models/ticket-status';


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
  implements OnInit, OnDestroy, AfterViewChecked {

  // The chat box sits inside *ngIf="!loading && ticket", so it can appear
  // after the messages have already loaded. Scroll to the latest message
  // as soon as it is rendered.
  private chatContainerRef?: ElementRef<HTMLDivElement>;

  private pendingScroll = false;

  @ViewChild('chatScrollContainer')
  set chatScrollContainer(ref: ElementRef<HTMLDivElement> | undefined) {

    const appeared = !this.chatContainerRef && !!ref;

    this.chatContainerRef = ref;

    if (appeared) {
      this.scrollToBottom();
    }

  }

  get chatScrollContainer(): ElementRef<HTMLDivElement> | undefined {
    return this.chatContainerRef;
  }

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

  readonly statusOptions = TICKET_STATUSES;

  readonly statusLabel = ticketStatusLabel;


  // ==========================================
  // LAST MESSAGE ID
  // ==========================================

  lastMessageId = 0;


  // ==========================================
  // POLLING
  // ==========================================

  private pollHandle: any = null;

  private polling = false;

  private statusPolling = false;

  // Bumped on every local status change so an in-flight poll that started
  // before the change can't overwrite the new status with the old one.
  private statusVersion = 0;

  private readonly POLL_INTERVAL_MS = 3000;


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

      this.startPolling();

    });

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.stopPolling();

  }


  // ==========================================
  // START / STOP POLLING
  // ==========================================

  startPolling(): void {

    this.stopPolling();

    this.pollHandle = setInterval(() => {

      this.pollMessages();

      this.pollTicketStatus();

    }, this.POLL_INTERVAL_MS);

  }

  stopPolling(): void {

    if (this.pollHandle) {

      clearInterval(this.pollHandle);

      this.pollHandle = null;

    }

  }


  // ==========================================
  // POLL FOR NEW MESSAGES
  // ==========================================

  pollMessages(): void {

    if (
      this.polling ||
      !this.ticketId ||
      this.messagesLoading
    ) {

      return;

    }

    this.polling = true;

    this.ticketService
      .getMessages(this.ticketId, this.lastMessageId)
      .subscribe({

        next: (res: any) => {

          const newMessages =
            res?.data || res || [];

          if (Array.isArray(newMessages) && newMessages.length) {

            // Only follow new messages if the admin is already at the
            // bottom, so reading older history isn't interrupted.
            const followNew = this.isNearBottom();

            this.messages = [
              ...this.messages,
              ...newMessages
            ];

            this.updateLastMessageId();

            if (followNew) {
              this.scrollToBottom();
            }

            this.cdr.markForCheck();

          }

          this.polling = false;

        },

        error: (error) => {

          console.error(
            'Poll messages error:',
            error
          );

          this.polling = false;

        }

      });

  }


  // ==========================================
  // SCROLL TO BOTTOM
  // ==========================================

  // Only flags the scroll. The actual scroll happens in ngAfterViewChecked,
  // once the new messages are really in the DOM — a timer can fire before
  // the view has rendered and leave the chat stuck at the top.
  scrollToBottom(): void {

    this.pendingScroll = true;

    this.cdr.markForCheck();

  }

  ngAfterViewChecked(): void {

    if (!this.pendingScroll) {
      return;
    }

    const el = this.chatScrollContainer?.nativeElement;

    // Chat box not rendered yet — keep the flag and retry on the next check
    if (!el) {
      return;
    }

    this.pendingScroll = false;

    el.scrollTop = el.scrollHeight;

  }

  private isNearBottom(): boolean {

    const el = this.chatScrollContainer?.nativeElement;

    if (!el) {
      return true;
    }

    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;

  }


  // ==========================================
  // POLL TICKET STATUS
  // ==========================================

  // Silent refresh — never toggles `loading`, which would hide the page.
  pollTicketStatus(): void {

    if (
      this.statusPolling ||
      this.updatingStatus ||
      !this.ticketId ||
      !this.ticket
    ) {
      return;
    }

    this.statusPolling = true;

    const versionAtStart = this.statusVersion;

    this.ticketService
      .getTicketById(this.ticketId, true)
      .subscribe({

        next: (res: any) => {

          this.statusPolling = false;

          const latest = res?.data || res;

          if (
            !latest?.status ||
            this.updatingStatus ||
            versionAtStart !== this.statusVersion
          ) {
            return;
          }

          if (latest.status !== this.ticket?.status) {

            this.ticket = { ...this.ticket, status: latest.status };

            this.selectedStatus = normalizeTicketStatus(latest.status);

            this.cdr.markForCheck();

          }

        },

        error: () => {

          this.statusPolling = false;

        }

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
            normalizeTicketStatus(this.ticket?.status);


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

          this.scrollToBottom();


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
  // ENTER TO SEND
  // ==========================================

  // Enter sends the reply; Shift+Enter inserts a new line.
  onReplyKeydown(e: Event): void {

    const event = e as KeyboardEvent;

    // Ignore Enter while an IME (e.g. Hindi/Tamil keyboard) is composing text
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) {
      return;
    }

    event.preventDefault();

    this.sendReply();

  }


  // ==========================================
  // CHANGE STATUS
  // ==========================================

  changeStatus(status: string): void {

    if (
      !status ||
      this.updatingStatus ||
      status === this.ticket?.status
    ) {

      return;

    }

    this.applyStatus(status);

  }


  // ==========================================
  // APPLY STATUS (optimistic)
  // ==========================================

  // Shows the new status straight away, then saves it. If the save fails
  // the previous status is put back.
  private applyStatus(status: string): void {

    const previousStatus =
      this.ticket?.status || 'Open';

    this.statusVersion++;

    this.updatingStatus = true;

    this.selectedStatus = status;

    if (this.ticket) {

      // New object reference so OnPush views re-render immediately
      this.ticket = { ...this.ticket, status };

    }

    if (status.toLowerCase() === 'closed') {

      this.message = '';

    }

    this.cdr.markForCheck();


    this.ticketService
      .updateTicketstatus(
        this.ticketId,
        { status }
      )
      .subscribe({

        next: (res: any) => {

          const saved = res?.data?.status;

          if (saved && this.ticket && saved !== this.ticket.status) {

            this.ticket = { ...this.ticket, status: saved };

            this.selectedStatus = normalizeTicketStatus(saved);

          }

          this.updatingStatus = false;

          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Status update error:',
            error
          );

          this.statusVersion++;

          this.selectedStatus = normalizeTicketStatus(previousStatus);

          if (this.ticket) {

            this.ticket = { ...this.ticket, status: previousStatus };

          }

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

    this.applyStatus('Closed');

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