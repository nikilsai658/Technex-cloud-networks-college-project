import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class CollegedepartService {
  constructor(private api:Api){}
  getCollegedepartments(){
    return this.api.GET('CollegeDepartment');
  }
  getCollegedepartmentById(id:number){
    return this.api.GET(`CollegeDepartment/${id}`);
  }
  createCollegedepartment(data:any){
    return this.api.POST('CollegeDepartment',data);
  }
  updateCollegedepartment(id:number,data:any){
    return this.api.PUT(`CollegeDepartment/${id}`,data);
  }
  deleteCollegedepartment(id:number){
    return this.api.DELETE(`CollegeDepartment/${id}`);
  }
}
