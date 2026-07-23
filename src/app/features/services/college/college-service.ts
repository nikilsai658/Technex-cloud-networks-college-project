import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  constructor(private api:Api){}
 getcollege(){
    return this.api.GET('College');
  }
  getcollegebyid(id:any){
    return this.api.GET(`College/${id}`);
  }
  createcollege(data:any){
    return this.api.POST('College',data);
  }
  updatecollege(id:any,data:any){
    return this.api.PUT(`College/${id}`,data);
  }
  deletecollege(id:any){
    return this.api.DELETE(`College/${id}`);
  }
}
