import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class YearService {
  constructor(private api:Api){}
  getYears(){
    return this.api.GET('Year');
  }
  getYearById(id:number){
    return this.api.GET(`Year/${id}`);
  }
  createYear(data:any){
    return this.api.POST('Year',data);
  }
  updateYear(id:number,data:any){
    return this.api.PUT(`Year/${id}`,data);
  }
  deleteYear(id:number){
    return this.api.DELETE(`Year/${id}`);
  }
}
