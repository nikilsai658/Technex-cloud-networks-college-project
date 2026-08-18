import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';

@Injectable({
  providedIn: 'root',
})
export class Superadmin {
  constructor(private api:Api){}
  getsuperadmincolleges(){
    return this.api.GET('SuperAdmin/colleges');
  }
  getsuperadmincollege_domain(collegeId:number){
    return this.api.GET(`SuperAdmin/college/${collegeId}/domains`)
  }
  getsuperadmincollege_domain_students(collegeId:number,domainId:number){
    return this.api.GET(`SuperAdmin/college/${collegeId}/domain/${domainId}/students`)
  }
  getsuperadmincollege_domain_student_assignments(collegeId:number,domainId:number,studentId:any){
    return this.api.GET(`SuperAdmin/college/${collegeId}/domain/${domainId}/student/${studentId}/assignments`)
  }
}
