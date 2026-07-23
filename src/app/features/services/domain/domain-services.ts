import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class DomainServices {
  constructor(private api:Api){}
  getDomains(){
    return this.api.GET('Domain');
  }
  getDomainById(id:number){
    return this.api.GET(`Domain/${id}`);
  }
  createDomain(data:any){
    return this.api.POST('Domain',data);
  }
  updateDomain(id:number,data:any){
    return this.api.PUT(`Domain/${id}`,data);
  }
  deleteDomain(id:number){
    return this.api.DELETE(`Domain/${id}`);
  }
}
