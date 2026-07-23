import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class DomaincourseService {
  constructor(private api:Api){}
  getDomaincourses(){
    return this.api.GET('DomainCourseMap');
  }
  getDomaincourseById(id:number){
    return this.api.GET(`DomainCourseMap/${id}`);
  }
  createDomaincourse(data:any){
    return this.api.POST('DomainCourseMap',data);
  }
  updateDomaincourse(id:number,data:any){
    return this.api.PUT(`DomainCourseMap/${id}`,data);
  }
  deleteDomaincourse(id:number){
    return this.api.DELETE(`DomainCourseMap/${id}`);
  }
}
