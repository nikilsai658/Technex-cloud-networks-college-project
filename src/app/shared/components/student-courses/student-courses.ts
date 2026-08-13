import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { Student } from '../../../features/services/student/student';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-courses',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './student-courses.html',
  styleUrl: './student-courses.css',
})
export class StudentCourses {
   courses: any[] = [];
  loading = false;

  constructor(
    private api: Student,
    private cd: ChangeDetectorRef,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loadstudentcourse();
  }

  loadstudentcourse(): void {

    this.loading = true;

    this.api.getstudentcourse().subscribe({

      next: (res: any) => {

        this.courses = res?.data ?? [];
        this.loading = false;
        this.cd.detectChanges();

      },

      error: () => {

        this.courses = [];
        this.loading = false;

      }

    });

  }
  view(courseId: number): void {
  this.router.navigate(['/main/student-assignments'], {
    state: { courseId }
  });
}
}
