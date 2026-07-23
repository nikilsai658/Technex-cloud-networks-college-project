import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private api:Api){}
  getDepartments(){
    return this.api.GET('Department');
  }
  getDepartmentById(id:number){
    return this.api.GET(`Department/${id}`);
  }
  createDepartment(data:any){
    return this.api.POST('Department',data);
  }
  updateDepartment(id:number,data:any){
    return this.api.PUT(`Department/${id}`,data);
  }
  deleteDepartment(id:number){
    return this.api.DELETE(`Department/${id}`);
  }
}
