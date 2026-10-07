import { tokenStorage } from '../../../core/auth/token-storage';
import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { Auth } from '../../../core/auth/auth';
import { DomaincourseService } from '../../../features/services/domaincourse/domaincourse-service';
import { DomainServices } from '../../../features/services/domain/domain-services';
import { CourseService } from '../../../features/services/course/course-service';
import { Ellipsis } from '../../directives/ellipsis';

@Component({
  selector: 'app-domaincoursemap',
  standalone: true,
  imports: [Ellipsis, 
    CommonModule,
    ReactiveFormsModule, FieldErrorPipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './domaincourse.html',
  styleUrls: ['./domaincourse.css']
})
export class DomainCourseMapComponent implements OnInit {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);

  domainCourseForm!: FormGroup;

  mappings: any[] = [];
  filteredMappings: any[] = [];

  domains: any[] = [];

  courses: any[] = [];

  submitted = false;
  editMode = false;
  showModal = false;

  selectedId: number | null = null;

  loading = false;

  searchText = '';

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

    this.buildForm();

    if (!isPlatformBrowser(this.platformId)) return;

    if (!tokenStorage.getAccess()) {

      this.router.navigate(['/auth/login']);

      return;

    }

    this.loadDomains();

    this.loadCourses();

    this.loadMappings();

  }

  buildForm(): void {

    this.domainCourseForm = this.fb.group({

      domainName: ['', Validators.required],

      courseName: ['', Validators.required],

      yearNumber: [1, [Validators.required, Validators.min(1), Validators.max(4), AppValidators.integer]],

      semester: [1, [Validators.required, Validators.min(1), Validators.max(2), AppValidators.integer]]

    });

  }

  //==========================
  // MODAL
  //==========================

  openAddModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  //========================
  // Load Domains
  //========================

  loadDomains() {

    this.domainService.getDomains().subscribe({

      next: (res: any) => {

        this.domains = res.data || res.result || res || [];

        this.cd.detectChanges();

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

        this.cd.detectChanges();

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

        this.filteredMappings = [...this.mappings];

        this.cd.detectChanges();

      },

      error: err => {

        this.loading = false;

        console.log(err);

      }

    });

  }

  //==========================
  // SAVE
  //==========================

  save(): void {

    this.submitted = true;

    if (this.editMode) {

      if (!this.auth.hasPermission('UPDATE_DOMAIN_COURSE_MAP')) return;

    } else {

      if (!this.auth.hasPermission('CREATE_DOMAIN_COURSE_MAP')) return;

    }

    if (this.domainCourseForm.invalid) {

      this.domainCourseForm.markAllAsTouched();

      return;

    }

    const payload = this.domainCourseForm.value;

    if (this.editMode) {

      if (this.selectedId == null) return;

      this.api.updateDomaincourse(this.selectedId, payload).subscribe({

        next: (res: any) => {

          this.toast.successFrom(res, 'Domain Course Updated Successfully');

          this.loadMappings();

          this.closeModal();

        },

        error: err => console.log(err)

      });

    } else {

      this.api.createDomaincourse(payload).subscribe({

        next: (res: any) => {

          this.toast.successFrom(res, 'Domain Course Added Successfully');

          this.loadMappings();

          this.closeModal();

        },

        error: err => console.log(err)

      });

    }

  }

  //========================
  // EDIT
  //========================

  edit(item: any) {

    if (!this.auth.hasPermission('UPDATE_DOMAIN_COURSE_MAP')) return;

    this.editMode = true;

    this.selectedId = item.id;

    this.domainCourseForm.patchValue({

      domainName: item.domainName,

      courseName: item.courseName,

      yearNumber: item.yearNumber,

      semester: item.semester

    });

    this.showModal = true;

  }

  //========================
  // DELETE
  //========================

  async delete(id: number): Promise<void> {

    if (!this.auth.hasPermission('DELETE_DOMAIN_COURSE_MAP')) return;

    if (!(await this.confirmDialog.confirmDelete('this mapping'))) return;

    this.api.deleteDomaincourse(id).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Domain Course Deleted Successfully');

        this.loadMappings();

      },

      error: err => console.log(err)

    });

  }

  //========================
  // RESET
  //========================

  resetForm() {

    this.submitted = false;

    this.editMode = false;

    this.selectedId = null;

    this.domainCourseForm.reset({

      domainName: '',

      courseName: '',

      yearNumber: 1,

      semester: 1

    });

  }

  //==========================
  // SEARCH
  //==========================

  search(): void {

    const value = this.searchText.toLowerCase();

    this.filteredMappings = this.mappings.filter(x =>

      x.domainName.toLowerCase().includes(value) ||

      x.courseName.toLowerCase().includes(value)

    );

  }

}
