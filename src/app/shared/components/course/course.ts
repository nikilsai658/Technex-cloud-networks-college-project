import { tokenStorage } from '../../../core/auth/token-storage';
import { Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  inject
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

import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
import { Ellipsis } from '../../directives/ellipsis';
@Component({
  selector: 'app-course',
  standalone: true,
  imports: [Ellipsis, 
    CommonModule,
    ReactiveFormsModule, FieldErrorPipe
  ],
  templateUrl: './course.html',
  styleUrls: ['./course.css']
})
export class Course implements OnInit {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);


  courses: any[] = [];

  courseForm!: FormGroup;

  isEditMode = false;

  selectedCourseId = 0;

  showModal = false;

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

      name: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(100), AppValidators.title]],

      description: ['', [...AppValidators.requiredText, Validators.minLength(10), Validators.maxLength(1000)]]

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = tokenStorage.getAccess();

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
  // Modal Controls
  //=====================================

  openAddModal(): void {

    if (!this.auth.hasPermission('CREATE_COURSE')) {
      this.toast.error('No Permission');
      return;
    }

    this.isEditMode = false;

    this.selectedCourseId = 0;

    this.courseForm.reset();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //=====================================
  // Create Course
  //=====================================

  createCourse(): void {

    if (!this.auth.hasPermission('CREATE_COURSE')) {
      this.toast.error('No Permission');
      return;
    }

    if (this.courseForm.invalid) {

      this.courseForm.markAllAsTouched();

      return;

    }

    this.api.createCourse(this.courseForm.value).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Course Added Successfully');

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
      this.toast.error('No Permission');
      return;
    }

    this.isEditMode = true;

    this.selectedCourseId = course.id;

    this.courseForm.patchValue({

      name: course.name,

      description: course.description

    });

    this.showModal = true;

  }

  //=====================================
  // Update Course
  //=====================================

  updateCourse(): void {

    if (!this.auth.hasPermission('UPDATE_COURSE')) {
      this.toast.error('No Permission');
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

      next: (res: any) => {

        this.toast.successFrom(res, 'Course Updated Successfully');

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

  async deleteCourse(id: number): Promise<void> {

    if (!this.auth.hasPermission('DELETE_COURSE')) {
      this.toast.error('No Permission');
      return;
    }

    if (!(await this.confirmDialog.confirmDelete('this course'))) {
      return;
    }

    this.api.deleteCourse(id).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Course Deleted Successfully');

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

    this.showModal = false;

  }

}