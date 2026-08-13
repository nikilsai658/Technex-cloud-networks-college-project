import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Student } from '../../../features/services/student/student';
import { ReactiveFormsModule } from '@angular/forms';
import { CodeEditorComponent, CodeSubmission } from '../code-editor/code-editor';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-assignment',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, CodeEditorComponent, RouterLink],
  templateUrl: './student-assignment.html',
  styleUrl: './student-assignment.css',
})
export class StudentAssignment implements OnInit{
  assignmentId!:number;
  assignment: any = null;

  get sampleTestCases(): any[] {
    return (this.assignment?.testCases ?? []).filter((tc: any) => tc.isSample);
  }

  isRunning = false;
  isSubmitting = false;

  runResult: any = null;
  submitResult: any = null;

  runError: string | null = null;
  submitError: string | null = null;

  constructor(private route:ActivatedRoute, private router:Router,private api:Student,private cd:ChangeDetectorRef,private location:Location, @Inject(PLATFORM_ID) private platformId: Object){}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.assignmentId = history.state.Id;
      this.loadAssignment();
    }
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

  onRunCode(submission: CodeSubmission): void {

    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.runResult = null;
    this.submitResult = null;
    this.runError = null;

    this.api
      .runCode(
        submission.sourceCode,
        submission.languageId,
        submission.stdin,
        this.assignment?.questionId
      )
      .subscribe({

        next: (res: any) => {

          this.runResult = res?.data ?? null;

          this.isRunning = false;

          this.cd.detectChanges();
        },

        error: (err: any) => {

          this.runError = err?.error?.message || 'Failed to run code.';

          this.isRunning = false;

          this.cd.detectChanges();
        }

      });
  }

  onSubmitCode(submission: CodeSubmission): void {

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submitResult = null;
    this.runResult = null;
    this.submitError = null;

    this.api
      .submitCode(
        this.assignmentId,
        submission.sourceCode,
        submission.languageId,
        submission.stdin,
        this.assignment?.questionId
      )
      .subscribe({

        next: (res: any) => {

          this.submitResult = res?.data ?? null;

          if (this.submitResult && this.assignment) {
            this.assignment.score = this.submitResult.score;
          }

          this.isSubmitting = false;

          this.cd.detectChanges();
        },

        error: (err: any) => {

          this.submitError = err?.error?.message || 'Failed to submit code.';

          this.isSubmitting = false;

          this.cd.detectChanges();
        }

      });
  }

}
