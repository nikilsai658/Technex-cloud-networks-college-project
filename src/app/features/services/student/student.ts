import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';

@Injectable({
  providedIn: 'root',
})
export class Student {
  constructor(private api:Api){}
  getstudentdomain(){
    return this.api.GET('Student/domain');
  }
  getstudentcourse(){
    return this.api.GET('Student/courses');
  }
  getstudentcourseById(courseId:number){
    return this.api.GET(`Student/course/${courseId}/assignments`);
  }
  getstudentassignmentId(assignmentId:number){
    return this.api.GET(`Student/assignment/${assignmentId}`)
  }
}
