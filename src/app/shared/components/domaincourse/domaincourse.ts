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
import { DomaincourseService } from '../../../features/services/domaincourse/domaincourse-service';
import { DomainServices } from '../../../features/services/domain/domain-services';
import { CourseService } from '../../../features/services/course/course-service';

@Component({
  selector: 'app-domaincoursemap',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './domaincourse.html',
  styleUrls: ['./domaincourse.css']
})
export class DomainCourseMapComponent implements OnInit {

  domainCourseForm!: FormGroup;

  mappings: any[] = [];

  domains: any[] = [];

  courses: any[] = [];

  isEditMode = false;

  selectedId = 0;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: DomaincourseService,
    private domainService: DomainServices,
    private courseService: CourseService,
    private cookie: CookieService,
    private router: Router,
    public auth: Auth,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.domainCourseForm = this.fb.group({

      domainName: ['', Validators.required],

      courseName: ['', Validators.required],

      yearNumber: [1, [Validators.required, Validators.min(1)]],

      semester: [1, [Validators.required, Validators.min(1)]]

    });

    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.cookie.get('token')) {

      this.router.navigate(['/auth/login']);

      return;

    }

    this.loadDomains();

    this.loadCourses();

    this.loadMappings();

  }

  //========================
  // Load Domains
  //========================

  loadDomains() {

    this.domainService.getDomains().subscribe({

      next: (res: any) => {

        this.domains = res.data || res.result || res || [];

      }

    });

  }

  //========================
  // Load Courses
  //========================

  loadCourses() {

    this.courseService.getCourses().subscribe({

      next: (res: any) => {

        this.courses = res.data || res.result || res || [];

      }

    });

  }

  //========================
  // Load Mapping
  //========================

  loadMappings() {

    this.loading = true;

    this.api.getDomaincourses().subscribe({

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

  //========================
  // CREATE
  //========================

  createMapping() {

    if (!this.auth.hasPermission('CREATE_DOMAIN_COURSE_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (this.domainCourseForm.invalid) {

      this.domainCourseForm.markAllAsTouched();

      return;

    }

    this.api.createDomaincourse(this.domainCourseForm.value)

      .subscribe({

        next: () => {

          alert('Mapping Created Successfully');

          this.resetForm();

          this.loadMappings();

        },

        error: err => console.log(err)

      });

  }

  //========================
  // EDIT
  //========================

  editMapping(item: any) {

    this.isEditMode = true;

    this.selectedId = item.id;

    this.domainCourseForm.patchValue({

      domainName: item.domainName,

      courseName: item.courseName,

      yearNumber: item.yearNumber,

      semester: item.semester

    });

  }

  //========================
  // UPDATE
  //========================

  updateMapping() {

    if (!this.auth.hasPermission('UPDATE_DOMAIN_COURSE_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (this.domainCourseForm.invalid) {

      this.domainCourseForm.markAllAsTouched();

      return;

    }

    this.api.updateDomaincourse(

      this.selectedId,

      this.domainCourseForm.value

    ).subscribe({

      next: () => {

        alert('Updated Successfully');

        this.resetForm();

        this.loadMappings();

      },

      error: err => console.log(err)

    });

  }

  //========================
  // DELETE
  //========================

  deleteMapping(id: number) {

    if (!this.auth.hasPermission('DELETE_DOMAIN_COURSE_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (!confirm('Delete this Mapping?')) {

      return;

    }

    this.api.deleteDomaincourse(id)

      .subscribe({

        next: () => {

          alert('Deleted Successfully');

          this.loadMappings();

        },

        error: err => console.log(err)

      });

  }

  //========================
  // RESET
  //========================

  resetForm() {

    this.isEditMode = false;

    this.selectedId = 0;

    this.domainCourseForm.reset({

      domainName: '',

      courseName: '',

      yearNumber: 1,

      semester: 1

    });

  }

}