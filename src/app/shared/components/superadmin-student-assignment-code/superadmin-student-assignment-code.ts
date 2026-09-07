import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { Superadmin } from '../../../features/services/superadmin/superadmin';

@Component({
  selector: 'app-superadmin-student-assignment-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-student-assignment-code.html',
  styleUrl: './superadmin-student-assignment-code.css',
})
export class SuperadminStudentAssignmentCode implements OnInit {

  collegeId!: number;
  domainId!: number;
  studentId!: string;
  assignmentId!: number;

  assignmentCode: any = null;

  loading = false;
  error = '';
  copied = false;

  constructor(
    private api: Superadmin,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Get values from router state
    this.collegeId = history.state.collegeId;
    this.domainId = history.state.domainId;
    this.studentId = history.state.studentId;
    this.assignmentId = history.state.assignmentId;

    console.log('College ID:', this.collegeId);
    console.log('Domain ID:', this.domainId);
    console.log('Student ID:', this.studentId);
    console.log('Assignment ID:', this.assignmentId);

    this.getAssignmentCode();
  }

  getAssignmentCode(): void {

    if (
      !this.collegeId ||
      !this.domainId ||
      !this.studentId ||
      !this.assignmentId
    ) {
      this.error = 'Required assignment information is missing.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.api
      .getsuperadmincollege_domain_student_assignment_code(
        this.collegeId,
        this.domainId,
        this.studentId,
        this.assignmentId
      )
      .subscribe({
        next: (response) => {

          console.log('Assignment Code Response:', response);

          this.assignmentCode = response;

          this.loading = false;
          this.cd.markForCheck();
        },

        error: (err) => {

          console.error('Failed to load assignment code:', err);

          this.error = 'Failed to load assignment code.';
          this.loading = false;

          this.cd.markForCheck();
        }
      });
  }

  copyCode(): void {

    const sourceCode = this.assignmentCode?.data?.sourceCode;

    if (!sourceCode) {
      return;
    }

    navigator.clipboard.writeText(sourceCode).then(() => {

      this.copied = true;
      this.cd.markForCheck();

      setTimeout(() => {
        this.copied = false;
        this.cd.markForCheck();
      }, 2000);
    });
  }
}