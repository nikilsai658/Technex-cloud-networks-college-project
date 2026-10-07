import { ChangeDetectorRef, Component, OnInit,ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Studentassignment } from '../../../features/services/studentassignment/studentassignment';
import { Auth } from '../../../core/auth/auth';
import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
import { Ellipsis } from '../../directives/ellipsis';
@Component({
  selector: 'app-student-assignment',
  standalone: true,
  imports: [Ellipsis, CommonModule, ReactiveFormsModule, FieldErrorPipe],
  templateUrl: './studentassignment.html',
  styleUrls: ['./studentassignment.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentAssignment implements OnInit {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);


  assignmentForm!: FormGroup;
  assignments: any[] = [];

  editMode = false;
  selectedId!: number;

  constructor(
    private fb: FormBuilder,
    private studentService: Studentassignment,
    private cdr: ChangeDetectorRef,
    public auth:Auth
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAssignments();
  }

  initializeForm(): void {
    this.assignmentForm = this.fb.group({
      id: [0],

      studentEmail: ['', [Validators.required, AppValidators.email]],
      courseName: ['', [...AppValidators.requiredText, Validators.maxLength(100)]],
      assignmentTitle: ['', [...AppValidators.requiredText, Validators.maxLength(200)]],
      status: ['', Validators.required],

      startedOn: [null],
      completedOn: [null],

      score: [0, [Validators.required, Validators.min(0), Validators.max(1000), AppValidators.integer]],
      attempts: [1, [Validators.required, Validators.min(0), Validators.max(1000), AppValidators.integer]],

      bestSubmissionId: [''],
      lastSubmissionId: [''],
      timeTaken: [0, [Validators.required, Validators.min(0), AppValidators.integer]],

      isPassed: [false]
    });
  }

  // Get All
  getAssignments(): void {
    this.studentService.getstudentassignment().subscribe({
      next: (res: any) => {
        this.assignments = res.data || res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // Edit
  edit(id: number): void {

    this.studentService.getstudentassignmentById(id).subscribe({
      next: (res: any) => {

        const data = res.data || res;

        this.assignmentForm.patchValue(data);

        this.selectedId = id;
        this.editMode = true;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });

  }

update(): void {

  if (this.assignmentForm.invalid) {
    this.assignmentForm.markAllAsTouched();
    return;
  }

  const formValue = this.assignmentForm.value;

  const payload = {
    id: formValue.id,
    studentEmail: formValue.studentEmail,
    courseName: formValue.courseName,
    assignmentTitle: formValue.assignmentTitle,
    status: formValue.status,
    startedOn: formValue.startedOn,
    completedOn: formValue.completedOn,
    score: formValue.score,
    attempts: formValue.attempts,
    bestSubmissionId: formValue.bestSubmissionId
      ? String(formValue.bestSubmissionId)
      : "",
    lastSubmissionId: formValue.lastSubmissionId
      ? String(formValue.lastSubmissionId)
      : "",
    timeTaken: formValue.timeTaken,
    isPassed: formValue.isPassed
  };

  console.log(payload);

  this.studentService
    .updatestudentassignment(this.selectedId, payload)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.getAssignments();
        this.cancel();
      },
      error: (err) => {
        console.log(err);
      }
    });
}
  // Delete
  async delete(id: number): Promise<void> {

    if (!(await this.confirmDialog.confirmDelete('this assignment'))) {
      return;
    }

    this.studentService
      .deletestudentassignmnet(id)
      .subscribe({
        next: (res: any) => {
          this.toast.successFrom(res, 'Assignment Deleted Successfully');
          this.getAssignments();

        },
        error: (err) => console.error(err)
      });

  }

  // Save (Create or Update)
  save(): void {
    if (this.editMode) {
      this.update();
    } else{

    }
  }

  // Reset Form
  cancel(): void {

    this.editMode = false;
    this.selectedId = 0;

    this.assignmentForm.reset();

    this.assignmentForm.patchValue({
      id: 0,
      score: 0,
      attempts: 1,
      timeTaken: 0,
      isPassed: false
    });
  }

}