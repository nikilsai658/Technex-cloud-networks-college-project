import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Superadmin } from '../../../features/services/superadmin/superadmin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadmin-student-assignments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-student-assignments.html',
  styleUrl: './superadmin-student-assignments.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperadminStudentAssignments implements OnInit {

  assignments: any[] = [];

  loading = false;

  collegeId!: number;
  domainId!: number;
  studentId!: string;

  studentName = '';
  studentEmail = '';
  domainName = '';

  constructor(
    private api: Superadmin,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Get data passed through router state
    this.collegeId = history.state.collegeId;
    this.domainId = history.state.domainId;
    this.studentId = history.state.studentId;

    // Validate IDs
    if (
      this.collegeId &&
      this.domainId &&
      this.studentId
    ) {
      this.loadStudentAssignments();
    } else {
      console.error('Required student assignment details are missing.');
    }
  }

  loadStudentAssignments(): void {

    this.loading = true;

    this.api
      .getsuperadmincollege_domain_student_assignments(
        this.collegeId,
        this.domainId,
        this.studentId
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Student Assignments Response:',
            res
          );

          this.assignments = res?.data ?? [];

          this.loading = false;

          this.cd.markForCheck();
        },

        error: (error) => {

          console.error(
            'Error loading student assignments:',
            error
          );

          this.assignments = [];

          this.loading = false;

          this.cd.markForCheck();
        }

      });
  }

  viewCode(assignment: any): void {
    this.router.navigate(
  ['/main/superadmin-student-assignment-code'],
  {
    state: {
      collegeId: this.collegeId,
      domainId: this.domainId,
      studentId: this.studentId,
      assignmentId: assignment.assignmentId
    }
  }
);
  }

}