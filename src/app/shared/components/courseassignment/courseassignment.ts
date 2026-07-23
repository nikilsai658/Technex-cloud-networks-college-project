import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
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
import { CourseAssignmnetService } from '../../../features/services/courseassignment/course-assignmnet-service';
import { CourseService } from '../../../features/services/course/course-service';
import { AssignmentService } from '../../../features/services/assignment/assignment-service';

@Component({
  selector: 'app-courseassignmentmap',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './courseassignment.html',
  styleUrls: ['./courseassignment.css']
})
export class CourseAssignmentMapComponent implements OnInit {

  courseAssignmentForm!: FormGroup;

  mappings: any[] = [];

  courses: any[] = [];

  assignments: any[] = [];

  loading = false;

  isEditMode = false;

  selectedId = 0;

  constructor(
    private fb: FormBuilder,
    private api: CourseAssignmnetService,
    private courseService: CourseService,
    private assignmentService: AssignmentService,
    private cookie: CookieService,
    private router: Router,
    public auth: Auth,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

    this.courseAssignmentForm = this.fb.group({

      courseName: ['', Validators.required],

      assignmentTitle: ['', Validators.required],

      sequenceNo: [1, Validators.required],

      isMandatory: [true],

      isActive: [true]

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.cookie.get('token');

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }

    this.loadCourses();

    this.loadAssignments();

    this.loadMappings();

  }

  //============================
  // Load Courses
  //============================

  loadCourses() {

    this.courseService.getCourses().subscribe({

      next: (res: any) => {

        this.courses = res.data || res.result || res || [];

      },

      error: err => console.log(err)

    });

  }

  //============================
  // Load Assignments
  //============================

  loadAssignments() {

    this.assignmentService.getAssign().subscribe({

      next: (res: any) => {

        this.assignments = res.data || res.result || res || [];

      },

      error: err => console.log(err)

    });

  }

  //============================
  // Load Mapping
  //============================

  loadMappings() {

    this.loading = true;

    this.api.getcourseassignment().subscribe({

      next: (res: any) => {

        this.loading = false;

        this.mappings = res.data || res.result || res || [];

        if (!Array.isArray(this.mappings)) {

          this.mappings = [];

        }

        this.cd.detectChanges();

      },

      error: err => {

        this.loading = false;

        console.log(err);

      }

    });

  }

  //============================
  // CREATE
  //============================

  createMapping() {

    if (!this.auth.hasPermission('CREATE_COURSE_ASSIGNMENT_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (this.courseAssignmentForm.invalid) {

      this.courseAssignmentForm.markAllAsTouched();

      return;

    }

    this.api.createcourseassignment(this.courseAssignmentForm.value)

      .subscribe({

        next: () => {

          alert('Course Assignment Mapping Created Successfully');

          this.resetForm();

          this.loadMappings();

        },

        error: err => console.log(err)

      });

  }

  //============================
  // EDIT
  //============================

  editMapping(item: any) {

    this.isEditMode = true;

    this.selectedId = item.id;

    this.courseAssignmentForm.patchValue({

      courseName: item.courseName,

      assignmentTitle: item.assignmentTitle,

      sequenceNo: item.sequenceNo,

      isMandatory: item.isMandatory,

      isActive: item.isActive

    });

  }

  //============================
  // UPDATE
  //============================

  updateMapping() {

    if (!this.auth.hasPermission('UPDATE_COURSE_ASSIGNMENT_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (this.courseAssignmentForm.invalid) {

      this.courseAssignmentForm.markAllAsTouched();

      return;

    }

    this.api.updatecourseassignment(

      this.selectedId,

      this.courseAssignmentForm.value

    ).subscribe({

      next: () => {

        alert('Updated Successfully');

        this.resetForm();

        this.loadMappings();

      },

      error: err => console.log(err)

    });

  }

  //============================
  // DELETE
  //============================

  deleteMapping(id: number) {

    if (!this.auth.hasPermission('DELETE_COURSE_ASSIGNMENT_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (!confirm('Delete this Mapping?')) {

      return;

    }

    this.api.deletecourseassignment(id)

      .subscribe({

        next: () => {

          alert('Deleted Successfully');

          this.loadMappings();

        },

        error: err => console.log(err)

      });

  }

  //============================
  // RESET
  //============================

  resetForm() {

    this.isEditMode = false;

    this.selectedId = 0;

    this.courseAssignmentForm.reset({

      courseName: '',

      assignmentTitle: '',

      sequenceNo: 1,

      isMandatory: true,

      isActive: true

    });

  }

}
