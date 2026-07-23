import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class StudentdomaincoursemapService {
  constructor(private api:Api){}
  getStudentdomaincoursemap(){
    return this.api.GET('StudentDomainCourseMap');
  }
  getStudentdomaincoursemapById(id:number){
    return this.api.GET(`StudentDomainCourseMap/${id}`);
  }
  createStudentdomaincoursemap(data:any){
    return this.api.POST('StudentDomainCourseMap',data);
  }
  updateStudentdomaincoursemap(id:number,data:any){
    return this.api.PUT(`StudentDomainCourseMap/${id}`,data);
  }
  deleteStudentdomaincoursemap(id:number){
    return this.api.DELETE(`StudentDomainCourseMap/${id}`);
  }
}