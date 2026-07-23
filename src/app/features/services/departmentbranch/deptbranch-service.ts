import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class DeptbranchService {
  constructor(private api:Api){}
  getDeptbranches(){
    return this.api.GET('DepartmentBranch');
  }
  getDeptbranchById(id:number){
    return this.api.GET(`DepartmentBranch/${id}`);
  }
  createDeptbranch(data:any){
    return this.api.POST('DepartmentBranch',data);
  }
  updateDeptbranch(id:number,data:any){
    return this.api.PUT(`DepartmentBranch/${id}`,data);
  }
  deleteDeptbranch(id:number){
    return this.api.DELETE(`DepartmentBranch/${id}`);
  }
}
