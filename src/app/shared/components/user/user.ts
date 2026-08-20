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
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import { Auth } from '../../../core/auth/auth';
import { UserService } from '../../../features/services/user/user-service';
import { CollegeService } from '../../../features/services/college/college-service';
import { DepartmentService } from '../../../features/services/department/department-service';
import { BranchService } from '../../../features/services/branch/branch-service';
import { RoleService } from '../../../features/services/role/role-service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class UserComponent implements OnInit {
  Math = Math;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private collegeService: CollegeService,
    private departmentService: DepartmentService,
    private branchService: BranchService,
    private roleService: RoleService,
    public auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ==========================
  // Form
  // ==========================

  userForm!: FormGroup;
  filterForm!: FormGroup;

  // ==========================
  // Data
  // ==========================

  users: any[] = [];

  colleges: any[] = [];
  departments: any[] = [];
  branches: any[] = [];
  roles: any[] = [];

  selectedFile: File | null = null;

  // ==========================
  // UI
  // ==========================

  loading = false;
  submitted = false;
  editMode = false;

  selectedUserId: number | null = null;

  // ==========================
  // Filters
  // ==========================

  selectedRole = '';
  selectedCollege = '';
  selectedDepartment = '';
  selectedBranch = '';
  selectedYear: number | null = null;
  selectedStatus: boolean | null = null;

  // ==========================
  // Permissions
  // ==========================

  permissions: string[] = [];

  // ==========================
  // Search
  // ==========================

  searchText = '';

  // ==========================
  // Pagination
  // ==========================

  page = 1;
  pageSize = 10;
  totalRecords = 0;

  // ==========================
  // Sorting
  // ==========================

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // ==========================
  // Lifecycle
  // ==========================

  ngOnInit(): void {

    this.initializeForm();

    this.initializeFilterForm();

    this.loadPermissions();

    this.loadColleges();

    this.loadDepartments();

    this.loadBranches();

    this.loadRoles();

    this.loadUsers();

    if (isPlatformBrowser(this.platformId)) {

      this.filterForm.valueChanges.subscribe(() => {
        this.loadUsers();
      });

    }
  }

  // ==========================
  // Form Controls
  // ==========================

  get f() {
    return this.userForm.controls;
  }

  // ==========================
  // Initialize Form
  // ==========================

  initializeForm(): void {

    this.userForm = this.fb.group({

      fullName: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ],

      // IMPORTANT:
      // Backend expects roleName
      roleName: [
        '',
        Validators.required
      ],

      collegeName: [null],

      departmentName: [null],

      branchName: [null],

      yearNumber: [null],

      semester: [null],

      phoneNumber: [null],

      registerNumber: [null],

      isActive: [true]

    });

  }

  // ==========================
  // Initialize Filter Form
  // ==========================

  initializeFilterForm(): void {

    this.filterForm = this.fb.group({

      roleName: [''],

      collegeName: [''],

      departmentName: [''],

      branchName: [''],

      yearNumber: [null],

      isActive: [true]

    });

  }

  // ==========================
  // Load Users
  // ==========================

  loadUsers(): void {

    this.loading = true;

    const roleName =
      this.filterForm?.get('roleName')?.value || '';

    const collegeName =
      this.filterForm?.get('collegeName')?.value || '';

    const departmentName =
      this.filterForm?.get('departmentName')?.value || '';

    const branchName =
      this.filterForm?.get('branchName')?.value || '';

    const yearNumber =
      this.filterForm?.get('yearNumber')?.value;

    const isActive =
      this.filterForm?.get('isActive')?.value;

    this.userService
      .getUsers(
        roleName,
        collegeName,
        departmentName,
        branchName,
        yearNumber,
        isActive
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Users Response:',
            res
          );

          if (Array.isArray(res)) {

            this.users = res;

          }
          else if (Array.isArray(res?.data)) {

            this.users = res.data;

          }
          else if (Array.isArray(res?.items)) {

            this.users = res.items;

          }
          else {

            this.users = [];

          }

          this.totalRecords =
            this.users.length;

          const maxPage =
            Math.max(
              1,
              Math.ceil(
                this.totalRecords /
                this.pageSize
              )
            );

          if (this.page > maxPage) {

            this.page = maxPage;

          }

        },

        error: (err) => {

          console.error(
            'Load Users Error:',
            err
          );

          this.users = [];

          this.totalRecords = 0;

        }

      });

  }

  // ==========================
  // Load Colleges
  // ==========================

  loadColleges(): void {

    this.collegeService
      .getcollege()
      .subscribe({

        next: (res: any) => {

          this.colleges =
            Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? res
                : [];

        },

        error: (err) => {

          console.error(
            'Load Colleges Error:',
            err
          );

          this.colleges = [];

        }

      });

  }

  // ==========================
  // Load Departments
  // ==========================

  loadDepartments(): void {

    this.departmentService
      .getDepartments()
      .subscribe({

        next: (res: any) => {

          this.departments =
            Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? res
                : [];

        },

        error: (err) => {

          console.error(
            'Load Departments Error:',
            err
          );

          this.departments = [];

        }

      });

  }

  // ==========================
  // Load Branches
  // ==========================

  loadBranches(): void {

    this.branchService
      .getBranches()
      .subscribe({

        next: (res: any) => {

          this.branches =
            Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? res
                : [];

        },

        error: (err) => {

          console.error(
            'Load Branches Error:',
            err
          );

          this.branches = [];

        }

      });

  }

  // ==========================
  // Load Roles
  // ==========================

  loadRoles(): void {

    this.roleService
      .getRoles()
      .subscribe({

        next: (res: any) => {

          console.log(
            'Roles Response:',
            res
          );

          if (Array.isArray(res)) {

            this.roles = res;

          }
          else if (Array.isArray(res?.data)) {

            this.roles = res.data;

          }
          else if (Array.isArray(res?.items)) {

            this.roles = res.items;

          }
          else {

            this.roles = [];

          }

          console.log(
            'Roles:',
            this.roles
          );

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Load Roles Error:',
            err
          );

          this.roles = [];

        }

      });

  }

  // ==========================
  // Load Permissions
  // ==========================

  loadPermissions(): void {

    this.permissions =
      this.auth.getPermissions?.() || [];

  }

  // ==========================
  // Permission Check
  // ==========================

  hasPermission(
    permission: string
  ): boolean {

    return this.permissions.includes(
      permission
    );

  }

  // ==========================
  // Save User
  // ==========================

  saveUser(): void {

    this.submitted = true;

    if (this.userForm.invalid) {

      this.userForm.markAllAsTouched();

      return;

    }

    if (this.editMode) {

      this.updateUser();

    }
    else {

      this.createUser();

    }

  }

  // ==========================
  // Create User
  // ==========================

  createUser(): void {

    if (this.userForm.invalid) {

      this.userForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    const formValue =
      this.userForm.value;

    /*
     * Backend payload
     */

    const payload = {

      fullName:
        formValue.fullName,

      email:
        formValue.email,

      password:
        formValue.password,

      roleName:
        formValue.roleName,

      collegeName:
        formValue.collegeName,

      departmentName:
        formValue.departmentName,

      branchName:
        formValue.branchName,

      yearNumber:
        formValue.yearNumber,

      semester:
        formValue.semester,

      phoneNumber:
        formValue.phoneNumber,

      registerNumber:
        formValue.registerNumber

    };

    console.log(
      'Create User Payload:',
      payload
    );

    this.userService
      .createUser(payload)
      .pipe(
        finalize(() => {

          this.loading = false;

        })
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Create User Response:',
            res
          );

          alert(
            res?.message ||
            'User created successfully'
          );

          this.resetForm();

          this.loadUsers();

        },

        error: (err) => {

          console.error(
            'Create User Error:',
            err
          );

          alert(
            err?.error?.message ||
            'Unable to create user.'
          );

        }

      });

  }

  // ==========================
  // Edit User
  // ==========================

  editUser(user: any): void {

    console.log(
      'Editing User:',
      user
    );

    this.selectedUserId =
      user?.id ??
      user?.userId ??
      null;

    this.editMode = true;

    /*
     * Get role name safely.
     */

    const roleName =
      user?.roleName ??
      user?.role?.name ??
      user?.role?.roleName ??
      '';

    this.userForm.patchValue({

      fullName:
        user?.fullName ?? '',

      email:
        user?.email ?? '',

      /*
       * Password stays empty
       * during edit.
       */

      password: '',

      roleName:
        roleName,

      collegeName:
        user?.collegeName ?? null,

      departmentName:
        user?.departmentName ?? null,

      branchName:
        user?.branchName ?? null,

      yearNumber:
        user?.yearNumber ?? null,

      semester:
        user?.semester ?? null,

      phoneNumber:
        user?.phoneNumber ?? null,

      registerNumber:
        user?.registerNumber ?? null,

      isActive:
        user?.isActive ?? true

    });

    console.log(
      'Edit Role Name:',
      roleName
    );

    this.cdr.detectChanges();

  }

  // ==========================
  // Update User
  // ==========================

  updateUser(): void {

    if (
      this.selectedUserId === null
    ) {

      console.error(
        'Selected User ID is missing'
      );

      return;

    }

    const formValue =
      this.userForm.value;

    /*
     * Same structure as create.
     */

    const payload: any = {

      fullName:
        formValue.fullName,

      email:
        formValue.email,

      roleName:
        formValue.roleName,

      collegeName:
        formValue.collegeName,

      departmentName:
        formValue.departmentName,

      branchName:
        formValue.branchName,

      yearNumber:
        formValue.yearNumber,

      semester:
        formValue.semester,

      phoneNumber:
        formValue.phoneNumber,

      registerNumber:
        formValue.registerNumber

    };

    /*
     * Only send password when
     * user entered a new password.
     */

    if (
      formValue.password &&
      formValue.password.trim() !== ''
    ) {

      payload.password =
        formValue.password;

    }

    console.log(
      'Update User Payload:',
      payload
    );

    this.loading = true;

    this.userService
      .updateUser(
        this.selectedUserId,
        payload
      )
      .pipe(
        finalize(() => {

          this.loading = false;

        })
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Update User Response:',
            res
          );

          alert(
            res?.message ||
            'Updated Successfully'
          );

          this.resetForm();

          this.loadUsers();

        },

        error: (err) => {

          console.error(
            'Update User Error:',
            err
          );

          alert(
            err?.error?.message ||
            'Unable to update user.'
          );

        }

      });

  }

  // ==========================
  // Delete User
  // ==========================

  deleteUser(id: number): void {

    if (
      !confirm(
        'Are you sure you want to delete this user?'
      )
    ) {

      return;

    }

    this.loading = true;

    this.userService
      .deleteUser(id)
      .pipe(
        finalize(() => {

          this.loading = false;

        })
      )
      .subscribe({

        next: (res: any) => {

          alert(
            res?.message ||
            'User deleted successfully.'
          );

          this.loadUsers();

        },

        error: (err) => {

          console.error(
            'Delete User Error:',
            err
          );

          alert(
            err?.error?.message ||
            'Unable to delete user.'
          );

        }

      });

  }

  // ==========================
  // Reset Form
  // ==========================

  resetForm(): void {

    this.userForm.reset({

      fullName: '',

      email: '',

      password: '',

      roleName: '',

      collegeName: null,

      departmentName: null,

      branchName: null,

      yearNumber: null,

      semester: null,

      phoneNumber: null,

      registerNumber: null,

      isActive: true

    });

    this.editMode = false;

    this.selectedUserId = null;

    this.submitted = false;

  }

  // ==========================
  // Cancel Edit
  // ==========================

  cancelEdit(): void {

    this.resetForm();

  }

  // ==========================
  // Search Users
  // ==========================

  searchUsers(): void {

    const search =
      this.searchText
        ?.trim()
        .toLowerCase();

    if (!search) {

      this.loadUsers();

      return;

    }

    this.users =
      (this.users ?? []).filter(
        (x: any) =>

          x?.firstName
            ?.toLowerCase()
            .includes(search) ||

          x?.lastName
            ?.toLowerCase()
            .includes(search) ||

          x?.fullName
            ?.toLowerCase()
            .includes(search) ||

          x?.userName
            ?.toLowerCase()
            .includes(search) ||

          x?.email
            ?.toLowerCase()
            .includes(search) ||

          x?.roleName
            ?.toLowerCase()
            .includes(search)
      );

    this.totalRecords =
      this.users.length;

    this.page = 1;

  }

  // ==========================
  // Sort
  // ==========================

  sort(column: string): void {

    if (
      this.sortColumn === column
    ) {

      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

    }
    else {

      this.sortColumn = column;

      this.sortDirection = 'asc';

    }

    this.users =
      this.users ?? [];

    this.users.sort(
      (a: any, b: any) => {

        const valueA =
          a?.[column];

        const valueB =
          b?.[column];

        if (valueA < valueB) {

          return this.sortDirection === 'asc'
            ? -1
            : 1;

        }

        if (valueA > valueB) {

          return this.sortDirection === 'asc'
            ? 1
            : -1;

        }

        return 0;

      }
    );

  }

  // ==========================
  // Pagination
  // ==========================

  get pagedUsers(): any[] {

    const start =
      (this.page - 1) *
      this.pageSize;

    return (this.users ?? []).slice(
      start,
      start + this.pageSize
    );

  }

  nextPage(): void {

    const users =
      this.users ?? [];

    if (
      this.page *
      this.pageSize <
      users.length
    ) {

      this.page++;

    }

  }

  previousPage(): void {

    if (this.page > 1) {

      this.page--;

    }

  }

  // ==========================
  // College Changed
  // ==========================

  onCollegeChange(): void {

    const college =
      this.userForm.value.collegeName;

    console.log(
      'Selected College:',
      college
    );

    this.departmentService
      .getDepartments()
      .subscribe({

        next: (res: any) => {

          this.departments =
            Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? res
                : [];

          this.branches = [];

          this.userForm.patchValue({

            departmentName: '',

            branchName: ''

          });

        },

        error: (err) => {

          console.error(
            'College Change Error:',
            err
          );

        }

      });

  }

  // ==========================
  // Department Changed
  // ==========================

  onDepartmentChange(): void {

    const department =
      this.userForm.value.departmentName;

    console.log(
      'Selected Department:',
      department
    );

    this.branchService
      .getBranches()
      .subscribe({

        next: (res: any) => {

          this.branches =
            Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res)
                ? res
                : [];

          this.userForm.patchValue({

            branchName: ''

          });

        },

        error: (err) => {

          console.error(
            'Department Change Error:',
            err
          );

        }

      });

  }

  // ==========================
  // Status Changed
  // ==========================

  changeStatus(user: any): void {

    const payload = {

      ...user,

      isActive:
        !user.isActive

    };

    this.userService
      .updateUser(
        user.id,
        payload
      )
      .subscribe({

        next: () => {

          user.isActive =
            !user.isActive;

        },

        error: (err) => {

          console.error(
            'Change Status Error:',
            err
          );

        }

      });

  }

  // ==========================
  // Refresh
  // ==========================

  refresh(): void {

    this.resetForm();

    this.loadUsers();

  }

  // ==========================
  // TrackBy
  // ==========================

  trackById(
    index: number,
    item: any
  ): number {

    return item.id;

  }

  // ==========================
  // Clear Filters
  // ==========================

  clearFilters(): void {

    this.filterForm.reset({

      roleName: '',

      collegeName: '',

      departmentName: '',

      branchName: '',

      yearNumber: null,

      isActive: true

    });

    this.page = 1;

    this.loadUsers();

  }

  // ==========================
  // Logout
  // ==========================

  logout(): void {

    if (
      isPlatformBrowser(
        this.platformId
      )
    ) {

      localStorage.removeItem(
        'accessToken'
      );

      localStorage.removeItem(
        'refreshToken'
      );

    }

    this.router.navigate([
      '/login'
    ]);

  }

  // ==========================
  // File Selected
  // ==========================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedFile =
        input.files[0];

      console.log(
        this.selectedFile
      );

    }

  }

  // ==========================
  // Upload File
  // ==========================

  uploadFile(): void {

    if (!this.selectedFile) {

      alert(
        'Please select a file'
      );

      return;

    }

    this.loading = true;

    this.userService
      .uploadUsers(
        this.selectedFile
      )
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          alert(
            'File Uploaded Successfully'
          );

          this.selectedFile = null;

          this.loadUsers();

        },

        error: (err) => {

          this.loading = false;

          console.error(
            'Upload Error:',
            err
          );

        }

      });

  }

}