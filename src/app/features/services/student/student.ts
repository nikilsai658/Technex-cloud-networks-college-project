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
  runCode(sourceCode:string, languageId:number, stdin:string|null, questionId:number){
    return this.api.POST('Student/run', { sourceCode, languageId, stdin, questionId });
  }
  submitCode(assignmentId:number, sourceCode:string, languageId:number, stdin:string|null, questionId:number){
    return this.api.POST('Student/submit', { assignmentId, sourceCode, languageId, stdin, questionId });
  }
}
