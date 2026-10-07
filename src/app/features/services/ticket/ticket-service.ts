import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private api:Api){}
  getTickets(status?: string, collegeName?: string){

    const params: any = {};

    if (status) {
      params.status = status;
    }

    if (collegeName) {
      params.collegeName = collegeName;
    }

    return this.api.GET('Ticket', params);
  }
  // silent: skip the blocking error alert (used by background polling)
  getTicketById(id:number, silent = false){
    return this.api.GET(`Ticket/${id}`, undefined, { silent });
  }
  getticketmy(silent = false){
    return this.api.GET('Ticket/my', undefined, { silent });
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
  return this.api.POST(`Ticket/${ticketId}/reply`,{ message});
}
}
