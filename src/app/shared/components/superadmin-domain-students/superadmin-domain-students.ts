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
  selector: 'app-superadmin-domain-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-domain-students.html',
  styleUrl: './superadmin-domain-students.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperadminDomainStudents implements OnInit {

  students: any[] = [];

  loading = false;

  collegeId!: number;
  domainId!: number;
  domainName = '';

  constructor(
    private api: Superadmin,
    private cd: ChangeDetectorRef,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.collegeId = history.state.collegeId;
    this.domainId = history.state.domainId;

    if (this.collegeId && this.domainId) {
      this.loadDomainStudents();
    }
  }

  loadDomainStudents(): void {

    this.loading = true;

    this.api
      .getsuperadmincollege_domain_students(
        this.collegeId,
        this.domainId
      )
      .subscribe({

        next: (res: any) => {

          console.log('Students Response:', res);

          this.students = res?.data ?? [];

          this.loading = false;

          this.cd.markForCheck();
        },

        error: (error) => {

          console.error(
            'Error loading domain students:',
            error
          );

          this.students = [];

          this.loading = false;

          this.cd.markForCheck();
        }

      });
  }
 viewAssignments(student: any): void {
  this.router.navigate(
    ['/main/superadmin-student-assignments'],
    {
      state: {
        studentId: student.studentId,
        collegeId: this.collegeId,
        domainId: this.domainId,
      }
    }
  );
}

}