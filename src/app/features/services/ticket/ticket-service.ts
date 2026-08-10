import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private api:Api){}
  getTickets(){
    return this.api.GET('Ticket');
  }
  getTicketById(id:number){
    return this.api.GET(`Ticket/${id}`);
  }
  getticketmy(){
    return this.api.GET('Ticket/my');
  }
  createTicket(data:any){
    return this.api.POST('Ticket',data);
  }
  updateTicketstatus(id:number,data:any){
    return this.api.PUT(`Ticket/${id}/status`,data);
  }
  getMessages(ticketId: number, afterId: number = 0) {
  return this.api.GET(
    `Ticket/${ticketId}/messages?afterId=${afterId}`
  );
}

replyTicket(ticketId: number, message: string) {
  return this.api.POST(
    `Ticket/${ticketId}/reply`,
    {
      message
    }
  );
}
}
