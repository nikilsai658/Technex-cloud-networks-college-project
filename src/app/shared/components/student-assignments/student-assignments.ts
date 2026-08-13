import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Student } from '../../../features/services/student/student';

@Component({
  selector: 'app-student-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-assignments.html',
  styleUrl: './student-assignments.css'
})
export class StudentAssignments implements OnInit {

  courseId!: number;
  assignments:any[]=[];
  constructor(private route: ActivatedRoute,private api:Student,private cd:ChangeDetectorRef, private router:Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.courseId = history.state.courseId;
      this.loadAssignments();
    }
  }
  loadAssignments():void{
   this.api.getstudentcourseById(this.courseId).subscribe({
    next:(res:any)=>{
      console.log(res.data)
        this.assignments=res?.data??[];
        this.cd.detectChanges();
    },error:(err:any)=>{
       this.assignments = [];
       console.log(err);
    }
   })
  }
  startAssignment(Id:number):void{
  this.router.navigate([`/main/student-assignment`],{state:{Id}});
  }


















































  
}