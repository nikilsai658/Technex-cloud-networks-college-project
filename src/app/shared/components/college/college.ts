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
import { CollegeService } from '../../../features/services/college/college-service';

@Component({
  selector: 'app-college',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './college.html',
  styleUrls: ['./college.css']
})
export class College implements OnInit {

  colleges: any[] = [];

  collegeForm!: FormGroup;

  isEditMode = false;

  selectedCollegeId = 0;

  constructor(
    private api: CollegeService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    // Create Form
    this.collegeForm = this.fb.group({

      name: ['', Validators.required],

      code: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      phoneNumber: ['', Validators.required]

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = this.cookie.get('token');

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }

    // Permission Based View
    if (this.auth.hasPermission('VIEW_COLLEGE')) {

      this.loadColleges();

    }

  }

  //=====================================
  // Load Colleges
  //=====================================

  loadColleges(): void {

    this.api.getcollege().subscribe({

      next: (res: any) => {

        console.log('College Response', res);

        if (Array.isArray(res)) {

          this.colleges = res;

        }

        else if (Array.isArray(res.data)) {

          this.colleges = res.data;

        }

        else if (Array.isArray(res.result)) {

          this.colleges = res.result;

        }

        else {

          this.colleges = [];

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error(err);

        this.colleges = [];

      }

    });

  }

  //=====================================
  // Create College
  //=====================================

  createCollege(): void {

    if (!this.auth.hasPermission('CREATE_COLLEGE')) {

      alert('You do not have permission to create colleges.');

      return;

    }

    if (this.collegeForm.invalid) {

      this.collegeForm.markAllAsTouched();

      return;

    }

    this.api.createcollege(this.collegeForm.value).subscribe({

      next: () => {

        alert('College Created Successfully');

        this.resetForm();

        this.loadColleges();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Edit College
  //=====================================

  editCollege(college: any): void {

    if (!this.auth.hasPermission('UPDATE_COLLEGE')) {

      alert('You do not have permission to edit.');

      return;

    }

    this.isEditMode = true;

    this.selectedCollegeId = college.id;

    this.collegeForm.patchValue({

      name: college.name,

      code: college.code,

      email: college.email,

      phoneNumber: college.phoneNumber

    });

  }

  //=====================================
  // Update College
  //=====================================

  updateCollege(): void {

    if (!this.auth.hasPermission('UPDATE_COLLEGE')) {

      alert('You do not have permission to update.');

      return;

    }

    if (this.collegeForm.invalid) {

      this.collegeForm.markAllAsTouched();

      return;

    }

    this.api.updatecollege(

      this.selectedCollegeId,

      this.collegeForm.value

    ).subscribe({

      next: () => {

        alert('College Updated Successfully');

        this.resetForm();

        this.loadColleges();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Delete College
  //=====================================

  deleteCollege(id: number): void {

    if (!this.auth.hasPermission('DELETE_COLLEGE')) {

      alert('You do not have permission to delete.');

      return;

    }

    if (!confirm('Are you sure you want to delete this college?')) {

      return;

    }

    this.api.deletecollege(id).subscribe({

      next: () => {

        alert('College Deleted Successfully');

        this.loadColleges();

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

    this.collegeForm.reset();

    this.isEditMode = false;

    this.selectedCollegeId = 0;

  }

}