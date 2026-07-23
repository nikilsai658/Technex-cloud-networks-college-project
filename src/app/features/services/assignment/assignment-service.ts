import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  constructor(private api:Api){}
  getAssign(){
    return this.api.GET('Assignment');
  }
  getAssignById(id: number){
    return this.api.GET(`Assignment/${id}`);
  }
  createAssign(data:any){
    return this.api.POST('Assignment',data);
  }
  updateAssign(id:number,data:any){
    return this.api.PUT(`Assignment/${id}`,data);
  }
  deleteAssign(id:number){
    return this.api.DELETE(`Assignment/${id}`);
  }
}
