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
import { StudentdomaincoursemapService } from '../../../features/services/studentdomaincourse/studentdomaincoursemap-ser';
import { DomainServices } from '../../../features/services/domain/domain-services';

@Component({
  selector: 'app-studentdomainmap',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './studentdomaincourse.html',
  styleUrls: ['./studentdomaincourse.css']
})
export class StudentDomainMapComponent implements OnInit {

  mappings: any[] = [];

  students: any[] = [];

  domains: any[] = [];

  studentDomainForm!: FormGroup;

  loading = false;

  isEditMode = false;

  selectedId = 0;

  constructor(
    private fb: FormBuilder,
    private api: StudentdomaincoursemapService,
    private domainService: DomainServices,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.studentDomainForm = this.fb.group({

      studentEmail: ['', Validators.required],

      domainName: ['', Validators.required]

    });

    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.cookie.get('token');

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }


    this.loadDomains();

    this.loadMappings();

  }

  //============================
  // Load Domains
  //============================

  loadDomains() {

    this.domainService.getDomains().subscribe({

      next: (res: any) => {

        this.domains = res.data || res.result || res || [];

      },

      error: err => console.log(err)

    });

  }

  //============================
  // Load Mapping List
  //============================

  loadMappings() {

    this.loading = true;

    this.api.getStudentdomaincoursemap().subscribe({

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

    if (!this.auth.hasPermission('CREATE_STUDENT_DOMAIN_COURSE_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (this.studentDomainForm.invalid) {

      this.studentDomainForm.markAllAsTouched();

      return;

    }

    this.api.createStudentdomaincoursemap(this.studentDomainForm.value)

      .subscribe({

        next: () => {

          alert('Mapping Created Successfully');

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

    this.studentDomainForm.patchValue({

      studentEmail: item.studentEmail,

      domainName: item.domainName

    });

  }

  //============================
  // UPDATE
  //============================

  updateMapping() {

    if (!this.auth.hasPermission('UPDATE_STUDENT_DOMAIN_COURSE_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (this.studentDomainForm.invalid) {

      this.studentDomainForm.markAllAsTouched();

      return;

    }

    this.api.updateStudentdomaincoursemap(

      this.selectedId,

      this.studentDomainForm.value

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

    if (!this.auth.hasPermission('DELETE_STUDENT_DOMAIN_COURSE_MAP')) {

      alert('Permission Denied');

      return;

    }

    if (!confirm('Delete this Mapping?')) {

      return;

    }

    this.api.deleteStudentdomaincoursemap(id)

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

    this.studentDomainForm.reset({

      studentEmail: '',

      domainName: ''

    });

  }

}