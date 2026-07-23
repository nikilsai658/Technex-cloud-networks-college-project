import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private api:Api){}
  getBranches(){
    return this.api.GET('Branch');
  }
  getBranchById(id:number){
    return this.api.GET(`Branch/${id}`);
  }
  createBranch(data:any){
    return this.api.POST('Branch',data);
  }
  updateBranch(id:number,data:any){
    return this.api.PUT(`Branch/${id}`,data);
  }
  deleteBranch(id:number){
    return this.api.DELETE(`Branch/${id}`);
  }
}