import { tokenStorage } from '../../../core/auth/token-storage';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../../features/services/department/department-service';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
import { Ellipsis } from '../../directives/ellipsis';
@Component({
  selector: 'app-department',
  standalone:true,
  imports: [Ellipsis, CommonModule,ReactiveFormsModule, FieldErrorPipe],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class Department {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);

    departments: any[] = [];

  departmentForm!: FormGroup;

  isEditMode = false;
  selectedDepartmentId = 0;
  showModal = false;

 sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  constructor(
    private api: DepartmentService,
    private fb: FormBuilder,
    private cookie:CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.departmentForm = this.fb.group({
      name: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(100), AppValidators.title]],
      code: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(30), AppValidators.code]]
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check login
    const token = tokenStorage.getAccess();

    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Load departments
    if (this.auth.hasPermission('VIEW_DEPARTMENT')) {
      this.loadDepartments();
    }
  }

  //=====================================
  // Load Departments
  //=====================================
loadDepartments(): void {

  console.log('loadDepartments called');

  this.api.getDepartments().subscribe({

    next: (res: any) => {

      console.log('Department Response:', res);

      // Case 1: API returns an array
      if (Array.isArray(res)) {
        this.departments = res;
      }

      // Case 2: API returns { data: [...] }
      else if (Array.isArray(res.data)) {
        this.departments = res.data;
      }

      // Case 3: API returns { result: [...] }
      else if (Array.isArray(res.result)) {
        this.departments = res.result;
      }

      else {
        console.error('Department API is not returning an array.', res);
        this.departments = [];
      }

      console.log('Departments Array:', this.departments);

      this.cd.detectChanges();

    },

    error: (err) => {
      console.error(err);
      this.departments = [];
    }

  });

}

  //=====================================
  // Modal Controls
  //=====================================

  openAddModal(): void {

    this.isEditMode = false;

    this.selectedDepartmentId = 0;

    this.departmentForm.reset();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.isEditMode = false;

    this.selectedDepartmentId = 0;

    this.departmentForm.reset();

  }

  //=====================================
  // Create Department
  //=====================================

  createDepartment(): void {

    if (this.departmentForm.invalid) {

      this.departmentForm.markAllAsTouched();

      return;

    }

    this.api.createDepartment(this.departmentForm.value).subscribe({

      next: (res) => {

        console.log(res);

        this.toast.successFrom(res, 'Department Added Successfully');

        this.departmentForm.reset();

        this.showModal = false;

        this.loadDepartments();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Edit
  //=====================================

  editDepartment(department: any): void {

    this.isEditMode = true;

    this.selectedDepartmentId = department.id;

    this.departmentForm.patchValue({

      name: department.name,
      code: department.code,
      collegeId: department.collegeId

    });

    this.showModal = true;

  }

  //=====================================
  // Update
  //=====================================

  updateDepartment(): void {

    if (this.departmentForm.invalid) {

      this.departmentForm.markAllAsTouched();

      return;

    }


    this.api.updateDepartment(
      this.selectedDepartmentId,
      this.departmentForm.value,

    ).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Department Updated Successfully');

        this.departmentForm.reset();

        this.isEditMode = false;

        this.selectedDepartmentId = 0;

        this.showModal = false;

        this.loadDepartments();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Delete
  //=====================================

  async deleteDepartment(id: number): Promise<void> {

    if (!(await this.confirmDialog.confirmDelete('this department'))) {
      return;
    }

    this.api.deleteDepartment(id).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Department Deleted Successfully');

        this.loadDepartments();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Reset
  //=====================================

  resetForm(): void {

    this.departmentForm.reset();

    this.isEditMode = false;

    this.selectedDepartmentId = 0;

    this.showModal = false;

  }
}