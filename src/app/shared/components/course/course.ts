import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { Auth } from '../../../core/auth/auth';
import { CourseService } from '../../../features/services/course/course-service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './course.html',
  styleUrls: ['./course.css']
})
export class Course implements OnInit {

  courses: any[] = [];

  courseForm!: FormGroup;

  isEditMode = false;

  selectedCourseId = 0;

  constructor(
    private api: CourseService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.courseForm = this.fb.group({

      name: ['', Validators.required],

      description: ['', Validators.required]

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.cookie.get('token');

    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.auth.hasPermission('VIEW_COURSE')) {
      this.loadCourses();
    }

  }

  //=====================================
  // Load Courses
  //=====================================

  loadCourses(): void {

    this.api.getCourses().subscribe({

      next: (res: any) => {

        if (Array.isArray(res)) {
          this.courses = res;
        }
        else if (Array.isArray(res.data)) {
          this.courses = res.data;
        }
        else if (Array.isArray(res.result)) {
          this.courses = res.result;
        }
        else {
          this.courses = [];
        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error(err);

        this.courses = [];

      }

    });

  }

  //=====================================
  // Create Course
  //=====================================

  createCourse(): void {

    if (!this.auth.hasPermission('CREATE_COURSE')) {
      alert('No Permission');
      return;
    }

    if (this.courseForm.invalid) {

      this.courseForm.markAllAsTouched();

      return;

    }

    this.api.createCourse(this.courseForm.value).subscribe({

      next: () => {

        alert('Course Created Successfully');

        this.resetForm();

        this.loadCourses();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Edit Course
  //=====================================

  editCourse(course: any): void {

    if (!this.auth.hasPermission('UPDATE_COURSE')) {
      alert('No Permission');
      return;
    }

    this.isEditMode = true;

    this.selectedCourseId = course.id;

    this.courseForm.patchValue({

      name: course.name,

      description: course.description

    });

  }

  //=====================================
  // Update Course
  //=====================================

  updateCourse(): void {

    if (!this.auth.hasPermission('UPDATE_COURSE')) {
      alert('No Permission');
      return;
    }

    if (this.courseForm.invalid) {

      this.courseForm.markAllAsTouched();

      return;

    }

    this.api.updateCourse(

      this.selectedCourseId,

      this.courseForm.value

    ).subscribe({

      next: () => {

        alert('Course Updated Successfully');

        this.resetForm();

        this.loadCourses();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Delete Course
  //=====================================

  deleteCourse(id: number): void {

    if (!this.auth.hasPermission('DELETE_COURSE')) {
      alert('No Permission');
      return;
    }

    if (!confirm('Delete this Course?')) {
      return;
    }

    this.api.deleteCourse(id).subscribe({

      next: () => {

        alert('Course Deleted Successfully');

        this.loadCourses();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Reset Form
  //=====================================

  resetForm(): void {

    this.courseForm.reset({

      name: '',

      description: ''

    });

    this.isEditMode = false;

    this.selectedCourseId = 0;

  }

}