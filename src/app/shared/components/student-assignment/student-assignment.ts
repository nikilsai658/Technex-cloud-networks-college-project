import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Student } from '../../../features/services/student/student';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CodeEditorComponent } from '../code-editor/code-editor';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-assignment',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CodeEditorComponent, RouterLink],
  templateUrl: './student-assignment.html',
  styleUrl: './student-assignment.css',
})
export class StudentAssignment implements OnInit{
  assignmentId!:number;
  assignment: any = null;
  constructor(private route:ActivatedRoute, private router:Router,private api:Student,private cd:ChangeDetectorRef,private location:Location){}
  ngOnInit(): void {
     this.assignmentId = history.state.Id;
    this.loadAssignment();
    
  }
  loadAssignment():void{
    this.api.getstudentassignmentId(this.assignmentId).subscribe({
         next:(res:any)=>{
        this.assignment = res.data?.[0] ?? null;
        this.cd.detectChanges();
    },error:(err:any)=>{
        this.assignment = null;
       console.log(err);
    }
    })
  }
  goBack(): void {
  this.location.back();
}
 
  
}
