import { Injectable } from '@angular/core';
import {Api} from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private api:Api){}
  getCourses(){
    return this.api.GET('Course');
  }
  getCourseById(id:number){
    return this.api.GET(`Course/${id}`);
  }
  createCourse(data:any){
    return this.api.POST('Course',data);
  }
  updateCourse(id:number,data:any){
    return this.api.PUT(`Course/${id}`,data);
  }
  deleteCourse(id:number){
    return this.api.DELETE(`Course/${id}`);
  }
}
