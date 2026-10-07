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
import { YearService } from '../../../features/services/year/year-service';

import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
@Component({
  selector: 'app-year',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, FieldErrorPipe
  ],
  templateUrl: './year.html',
  styleUrls: ['./year.css']
})
export class Year implements OnInit {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);


  years: any[] = [];

  yearForm!: FormGroup;

  isEditMode = false;

  selectedYearId = 0;

  showModal = false;

  constructor(
    private api: YearService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

    this.yearForm = this.fb.group({

      yearNumber: ['', [Validators.required, Validators.min(1), Validators.max(4), AppValidators.integer]],

      semester: ['', Validators.required]

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = tokenStorage.getAccess();

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }

    if (this.auth.hasPermission('VIEW_YEAR')) {

      this.loadYears();

    }

  }

  //==============================
  // Load Years
  //==============================

  loadYears(): void {

    this.api.getYears().subscribe({

      next: (res: any) => {

        if (Array.isArray(res)) {

          this.years = res;

        }

        else if (Array.isArray(res.data)) {

          this.years = res.data;

        }

        else if (Array.isArray(res.result)) {

          this.years = res.result;

        }

        else {

          this.years = [];

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error(err);

        this.years = [];

      }

    });

  }

  //==============================
  // Modal Controls
  //==============================

  openAddModal(): void {

    if (!this.auth.hasPermission('CREATE_YEAR')) {

      this.toast.error('Permission Denied');

      return;

    }

    this.isEditMode = false;

    this.selectedYearId = 0;

    this.yearForm.reset();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //==============================
  // Create Year
  //==============================

  createYear(): void {

    if (!this.auth.hasPermission('CREATE_YEAR')) {

      this.toast.error('Permission Denied');

      return;

    }

    if (this.yearForm.invalid) {

      this.yearForm.markAllAsTouched();

      return;

    }

    this.api.createYear(this.yearForm.value).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Year Added Successfully');

        this.resetForm();

        this.loadYears();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //==============================
  // Edit
  //==============================

  editYear(year: any): void {

    if (!this.auth.hasPermission('UPDATE_YEAR')) {

      this.toast.error('Permission Denied');

      return;

    }

    this.isEditMode = true;

    this.selectedYearId = year.id;

    this.yearForm.patchValue({

      yearNumber: year.yearNumber,

      semester: year.semester

    });

    this.showModal = true;

  }

  //==============================
  // Update
  //==============================

  updateYear(): void {

    if (!this.auth.hasPermission('UPDATE_YEAR')) {

      this.toast.error('Permission Denied');

      return;

    }

    if (this.yearForm.invalid) {

      this.yearForm.markAllAsTouched();

      return;

    }

    this.api.updateYear(

      this.selectedYearId,

      this.yearForm.value

    ).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Year Updated Successfully');

        this.resetForm();

        this.loadYears();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //==============================
  // Delete
  //==============================

  async deleteYear(id: number): Promise<void> {

    if (!this.auth.hasPermission('DELETE_YEAR')) {

      this.toast.error('Permission Denied');

      return;

    }

    if (!(await this.confirmDialog.confirmDelete('this year'))) {

      return;

    }

    this.api.deleteYear(id).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Year Deleted Successfully');

        this.loadYears();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //==============================
  // Reset
  //==============================

  resetForm(): void {

    this.yearForm.reset({

      yearNumber: 1,

      semester: 1

    });

    this.isEditMode = false;

    this.selectedYearId = 0;

    this.showModal = false;

  }

}