import { Component,
  OnInit,
  OnDestroy,
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
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { finalize, forkJoin, Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { Router } from '@angular/router';

import { Auth } from '../../../core/auth/auth';
import { UserService } from '../../../features/services/user/user-service';
import { CollegeService } from '../../../features/services/college/college-service';
import { DepartmentService } from '../../../features/services/department/department-service';
import { BranchService } from '../../../features/services/branch/branch-service';
import { RoleService } from '../../../features/services/role/role-service';
import { Superadmin } from '../../../features/services/superadmin/superadmin';

import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
import { Ellipsis } from '../../directives/ellipsis';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [Ellipsis, 
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FieldErrorPipe
  ],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class UserComponent implements OnInit, OnDestroy {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);

  Math = Math;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private collegeService: CollegeService,
    private departmentService: DepartmentService,
    private branchService: BranchService,
    private roleService: RoleService,
    private superadmin: Superadmin,
    public auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ==========================
  // Form
  // ==========================

  userForm!: FormGroup;

  showPassword = false;

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
  // Bulk Upload Results
  // ==========================

  uploadId: string | null = null;
  uploadResultsLoading = false;
  showUploadResults = false;
  successUsers: any[] = [];
  failedUsers: any[] = [];

  // ==========================
  // Bulk Upload Progress
  // ==========================

  uploadProgress: any = null;
  uploadErrors: string[] = [];
  uploadFileName = '';
  activeResultTab: 'success' | 'failed' = 'success';
  private progressSub: Subscription | null = null;

  // ==========================
  // UI
  // ==========================

  loading = false;

  // Separate from `loading` so the user-list fetch doesn't lock the form buttons.
  saving = false;
  submitted = false;
  editMode = false;
  showModal = false;

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

  // Unfiltered copy of loaded users, so search never loses rows
  allUsers: any[] = [];

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

    this.loadPermissions();

    this.loadColleges();

    this.loadDepartments();

    this.loadBranches();

    this.loadRoles();

    this.loadUsers();

    if (isPlatformBrowser(this.platformId)) {

      this.userForm.get('roleName')?.valueChanges.subscribe(() => {
        this.loadUsers();
      });

      this.userForm.get('collegeName')?.valueChanges.subscribe(() => {
        this.loadUsers();
      });

      this.userForm.get('departmentName')?.valueChanges.subscribe(() => {
        this.loadUsers();
      });

      this.userForm.get('branchName')?.valueChanges.subscribe(() => {
        this.loadUsers();
      });

      this.userForm.get('yearNumber')?.valueChanges.subscribe(() => {
        this.loadUsers();
      });

      this.userForm.get('isActive')?.valueChanges.subscribe(() => {
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
  // Modal Controls
  // ==========================

  openAddModal(): void {

    this.resetForm();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  // ==========================
  // Initialize Form
  // ==========================

  initializeForm(): void {

    this.userForm = this.fb.group({

      fullName: [
        '',
        [
          ...AppValidators.requiredText,
          Validators.minLength(3),
          Validators.maxLength(100),
          AppValidators.personName
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          AppValidators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          AppValidators.strongPassword
        ]
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

      yearNumber: [null, [Validators.min(1), Validators.max(4), AppValidators.integer]],

      semester: [null, [Validators.min(1), Validators.max(8), AppValidators.integer]],

      phoneNumber: [null, AppValidators.phone],

      registerNumber: [null, [Validators.maxLength(20), AppValidators.registerNumber]],

      isActive: [true]

    });

  }

  // ==========================
  // Load Users
  // ==========================

  loadUsers(): void {

    this.loading = true;

    const roleName =
      this.userForm?.get('roleName')?.value || '';

    const collegeName =
      this.userForm?.get('collegeName')?.value || '';

    const departmentName =
      this.userForm?.get('departmentName')?.value || '';

    const branchName =
      this.userForm?.get('branchName')?.value || '';

    const yearNumber =
      this.userForm?.get('yearNumber')?.value;

    const isActive =
      this.userForm?.get('isActive')?.value;

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

          this.allUsers = this.extractArray(res);

          this.allUsers.forEach((user: any) => {

            user.isLocked = false;

          });

          this.users = this.filterBySearch(this.allUsers);

          this.loadLockedStudents();

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

          this.allUsers = [];

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
  // Toggle Password Visibility
  // ==========================

  togglePasswordVisibility(): void {

    this.showPassword = !this.showPassword;

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

    this.saving = true;

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

          this.saving = false;
          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Create User Response:',
            res
          );

          this.toast.success(
            res?.message ||
            'User Added Successfully'
          );

          this.resetForm();

          this.loadUsers();

        },

        error: (err) => {

          console.error(
            'Create User Error:',
            err
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
     * Password is optional during edit —
     * drop the required validator so a
     * blank password doesn't block the form.
     */

    // Still validate strength if a new password is typed.
    this.userForm.get('password')?.setValidators([AppValidators.strongPassword]);
    this.userForm.get('password')?.updateValueAndValidity();

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

    this.showModal = true;

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

      payload.newPassword =
        formValue.password;

    }

    console.log(
      'Update User Payload:',
      payload
    );

    this.saving = true;

    this.userService
      .updateUser(
        this.selectedUserId,
        payload
      )
      .pipe(
        finalize(() => {

          this.saving = false;
          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Update User Response:',
            res
          );

          this.toast.success(
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

        }

      });

  }

  // ==========================
  // Delete User
  // ==========================

  async deleteUser(id: number): Promise<void> {

    if (
      !(await this.confirmDialog.confirmDelete('this user'))
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

          this.toast.success(
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

    /*
     * Back to create mode —
     * password is required again.
     */

    this.userForm.get('password')?.setValidators([Validators.required, AppValidators.strongPassword]);
    this.userForm.get('password')?.updateValueAndValidity();

    this.editMode = false;

    this.selectedUserId = null;

    this.submitted = false;

    this.showModal = false;

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

    this.users =
      this.filterBySearch(this.allUsers);

    this.totalRecords =
      this.users.length;

    this.page = 1;

  }

  private filterBySearch(list: any[]): any[] {

    const search =
      (this.searchText ?? '')
        .trim()
        .toLowerCase();

    if (!search) {

      return [...(list ?? [])];

    }

    return (list ?? []).filter((x: any) => {

      const combinedName =
        `${x?.firstName ?? ''} ${x?.lastName ?? ''}`;

      const fields = [
        x?.firstName,
        x?.lastName,
        combinedName,
        x?.fullName,
        x?.name,
        x?.userName,
        x?.username,
        x?.email,
        x?.roleName,
        x?.role?.name
      ];

      return fields.some(
        (value: any) =>
          value != null &&
          String(value)
            .toLowerCase()
            .includes(search)
      );

    });

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

  get totalPages(): number {

    return Math.max(
      1,
      Math.ceil(
        this.totalRecords /
        this.pageSize
      )
    );

  }

  get visiblePages(): (number | '...')[] {

    const total = this.totalPages;
    const current = this.page;
    const pages: (number | '...')[] = [];

    for (let i = 1; i <= total; i++) {

      const isEdge = i === 1 || i === total;
      const isNearCurrent = i >= current - 1 && i <= current + 1;

      if (isEdge || isNearCurrent) {

        pages.push(i);

      } else if (pages[pages.length - 1] !== '...') {

        pages.push('...');

      }

    }

    return pages;

  }

  get rangeStart(): number {

    return this.totalRecords === 0
      ? 0
      : (this.page - 1) * this.pageSize + 1;

  }

  get rangeEnd(): number {

    return Math.min(
      this.page * this.pageSize,
      this.totalRecords
    );

  }

  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages) return;

    this.page = page;

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
  // Load Locked Students
  // ==========================
  // Source of truth for lock state comes from
  // SuperAdmin/students/locked — cross-reference
  // its ids against the loaded users so locked
  // students show "Unlock" and the rest show "Lock".
  // ==========================

  loadLockedStudents(): void {

    this.superadmin.student1ocked().subscribe({

      next: (res: any) => {

        console.log('Locked Students Response:', res);

        const lockedIds = this.extractIds(res, ['studentId', 'StudentId', 'id', 'Id', 'userId', 'UserId']);

        this.users.forEach((user: any) => {

          const userId = user?.id ?? user?.userId ?? user?.studentId;

          user.isLocked = lockedIds.has(this.normalizeId(userId));

        });

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error('Load Locked Students Error:', err);

      }

    });

  }

  // ==========================
  // Response Helpers
  // ==========================

  extractArray(res: any): any[] {

    if (Array.isArray(res)) {
      return res;
    }

    if (Array.isArray(res?.data)) {
      return res.data;
    }

    if (Array.isArray(res?.items)) {
      return res.items;
    }

    if (Array.isArray(res?.result)) {
      return res.result;
    }

    if (Array.isArray(res?.students)) {
      return res.students;
    }

    if (Array.isArray(res?.lockedStudents)) {
      return res.lockedStudents;
    }

    return [];

  }

  extractIds(res: any, keys: string[]): Set<string> {

    const ids = this.extractArray(res)
      .map((item: any) => {

        if (item && typeof item === 'object') {

          for (const key of keys) {

            if (item[key] !== undefined && item[key] !== null) {
              return item[key];
            }

          }

          return undefined;

        }

        return item;

      })
      .filter((id: any) => id !== undefined && id !== null);

    return new Set(ids.map((id: any) => this.normalizeId(id)));

  }

  // Ids may be numeric (colleges) or GUID strings (students) —
  // compare as trimmed lowercase strings so both shapes match.
  normalizeId(id: any): string {

    return String(id).trim().toLowerCase();

  }

  // ==========================
  // Lock / Unlock Student
  // ==========================

  async lockUser(user: any): Promise<void> {

    if (
      !(await this.confirmDialog.confirm({ title: 'Lock user', message: `Lock "${user?.fullName || user?.email}"? This user will lose access.`, okLabel: 'Lock', tone: 'danger' }))
    ) {

      return;

    }

    this.superadmin
      .studentlock(user.id, {})
      .subscribe({

        next: (res: any) => {

          user.isLocked = true;

          this.toast.successFrom(res, 'User Locked Successfully');

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Lock User Error:',
            err
          );

        }

      });

  }

  async unlockUser(user: any): Promise<void> {

    if (
      !(await this.confirmDialog.confirm({ title: 'Unlock user', message: `Unlock "${user?.fullName || user?.email}"? This user will regain access.`, okLabel: 'Unlock', tone: 'default' }))
    ) {

      return;

    }

    this.superadmin
      .studentunlock(user.id, {})
      .subscribe({

        next: (res: any) => {

          user.isLocked = false;

          this.toast.successFrom(res, 'User Unlocked Successfully');

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Unlock User Error:',
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

    this.userForm.patchValue({

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

      this.toast.warning(
        'Please select a file'
      );

      return;

    }

    this.loading = true;

    this.showUploadResults = false;

    this.successUsers = [];

    this.failedUsers = [];

    this.stopProgressPolling();

    this.uploadErrors = [];

    this.uploadFileName = this.selectedFile.name;

    // Show the panel right away while the file is being sent
    this.uploadProgress = {
      status: 'Uploading',
      stage: 'Uploading file',
      totalRows: 0,
      processedRows: 0,
      successCount: 0,
      failedCount: 0,
      percentComplete: 0,
      message: 'Sending file to server...'
    };

    this.userService
      .uploadUsers(
        this.selectedFile
      )
      .pipe(
        finalize(() => {

          this.loading = false;

        })
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Upload Response:',
            res
          );

          const uploadId =
            res?.jobId ??
            res?.data?.jobId ??
            res?.uploadId ??
            res?.data?.uploadId ??
            res?.id ??
            res?.data?.id ??
            null;

          this.selectedFile = null;

          if (uploadId) {

            this.uploadId = uploadId;

            this.startProgressPolling(
              uploadId
            );

          }
          else {

            this.uploadProgress = null;

            this.loadUsers();

            this.toast.successFrom(res, 'File Uploaded Successfully');

          }

        },

        error: (err) => {

          console.error(
            'Upload Error:',
            err
          );

          this.uploadProgress = null;

          this.cdr.detectChanges();

        }

      });

  }

  // ==========================
  // Poll Bulk Upload Progress
  // ==========================

  startProgressPolling(
    jobId: string
  ): void {

    this.stopProgressPolling();

    this.progressSub = timer(0, 1000)
      .pipe(
        switchMap(() =>
          this.userService.progress(jobId)
        ),
        takeWhile(
          (res: any) => !this.isUploadFinished(res?.data),
          true
        )
      )
      .subscribe({

        next: (res: any) => {

          const data = res?.data;

          if (!data) {
            return;
          }

          this.uploadProgress = data;

          this.uploadErrors =
            data?.result?.errors ?? [];

          if (this.isUploadFinished(data)) {

            this.onUploadFinished(
              jobId,
              data
            );

          }

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'Upload Progress Error:',
            err
          );

          this.uploadProgress = {
            ...this.uploadProgress,
            status: 'Failed',
            message: 'Could not read upload progress.'
          };

          this.cdr.detectChanges();

        }

      });

  }

  stopProgressPolling(): void {

    this.progressSub?.unsubscribe();

    this.progressSub = null;

  }

  isUploadFinished(data: any): boolean {

    const status =
      (data?.status ?? '').toLowerCase();

    return status === 'completed' || status === 'failed';

  }

  onUploadFinished(
    jobId: string,
    data: any
  ): void {

    this.loadUsers();

    this.activeResultTab =
      data?.successCount ? 'success' : 'failed';

    if ((data?.status ?? '').toLowerCase() === 'failed') {

      this.toast.error(data?.message || 'Bulk upload failed');

    }
    else if (data?.failedCount) {

      this.toast.warning(
        `${data.successCount} users created, ${data.failedCount} failed`
      );

    }
    else {

      this.toast.success(
        `${data?.successCount ?? 0} users uploaded successfully`
      );

    }

    this.loadUploadResults(jobId);

  }

  get progressPercent(): number {

    const p = this.uploadProgress;

    if (!p) {
      return 0;
    }

    if (typeof p.percentComplete === 'number') {
      return Math.min(100, Math.max(0, Math.round(p.percentComplete)));
    }

    return p.totalRows
      ? Math.round((p.processedRows / p.totalRows) * 100)
      : 0;

  }

  // Width of the green / red segments inside the progress bar
  get successBarWidth(): number {

    const p = this.uploadProgress;

    return p?.totalRows
      ? (p.successCount / p.totalRows) * 100
      : 0;

  }

  get failedBarWidth(): number {

    const p = this.uploadProgress;

    return p?.totalRows
      ? (p.failedCount / p.totalRows) * 100
      : 0;

  }

  get uploadStatusKey(): string {

    return (this.uploadProgress?.status ?? '').toLowerCase();

  }

  ngOnDestroy(): void {

    this.stopProgressPolling();

  }

  // ==========================
  // Load Bulk Upload Results
  // ==========================

  loadUploadResults(
    uploadId: string
  ): void {

    this.uploadResultsLoading = true;

    forkJoin({

      success:
        this.userService.successusers(
          uploadId
        ),

      failed:
        this.userService.failedusers(
          uploadId
        )

    })
      .pipe(
        finalize(() => {

          this.uploadResultsLoading = false;

          this.showUploadResults = true;

        })
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Upload Results:',
            res
          );

          this.successUsers =
            this.extractList(
              res.success
            );

          this.failedUsers =
            this.extractList(
              res.failed
            );

        },

        error: (err) => {

          console.error(
            'Load Upload Results Error:',
            err
          );

          this.successUsers = [];

          this.failedUsers = [];

        }

      });

  }

  // ==========================
  // Extract List Helper
  // ==========================

  extractList(res: any): any[] {

    if (Array.isArray(res)) {

      return res;

    }

    if (Array.isArray(res?.data)) {

      return res.data;

    }

    if (Array.isArray(res?.items)) {

      return res.items;

    }

    return [];

  }

  // ==========================
  // Close Upload Results
  // ==========================

  closeUploadResults(): void {

    this.stopProgressPolling();

    this.uploadProgress = null;

    this.uploadErrors = [];

    this.showUploadResults = false;

    this.successUsers = [];

    this.failedUsers = [];

    this.uploadId = null;

  }
  printSuccessUsers(): void {
  if (!this.successUsers?.length) {
    return;
  }

  const rows = this.successUsers.map((user: any) => `
    <tr>
      <td>${this.escapeHtml(user?.fullName ?? user?.name ?? '-')}</td>
      <td>${this.escapeHtml(user?.email ?? '-')}</td>
      <td>${this.escapeHtml(user?.roleName ?? user?.role ?? '-')}</td>
    </tr>
  `).join('');

  const printWindow = window.open('', '_blank', 'width=1000,height=700');

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Successfully Created Users</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #2F3E46;
        }

        h1 {
          margin-bottom: 5px;
        }

        .subtitle {
          color: #666;
          margin-bottom: 25px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        th {
          background: #2F3E46;
          color: white;
        }

        .success {
          color: #15803d;
          font-weight: bold;
        }

        @media print {
          body {
            padding: 10px;
          }
        }
      </style>
    </head>

    <body>

      <h1>Successfully Created Users</h1>

      <div class="subtitle">
        Total Successful Users:
        <strong class="success">
          ${this.successUsers.length}
        </strong>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

    </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}


printFailedUsers(): void {
  if (!this.failedUsers?.length) {
    return;
  }

  const rows = this.failedUsers.map((user: any) => `
    <tr>
      <td>${this.escapeHtml(user?.fullName ?? user?.name ?? '-')}</td>
      <td>${this.escapeHtml(user?.email ?? '-')}</td>
      <td>${this.escapeHtml(
        user?.reason ??
        user?.error ??
        user?.errorMessage ??
        user?.message ??
        '-'
      )}</td>
    </tr>
  `).join('');

  const printWindow = window.open('', '_blank', 'width=1000,height=700');

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Failed Users</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #2F3E46;
        }

        h1 {
          margin-bottom: 5px;
        }

        .subtitle {
          color: #666;
          margin-bottom: 25px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
          vertical-align: top;
        }

        th {
          background: #2F3E46;
          color: white;
        }

        .failed {
          color: #dc2626;
          font-weight: bold;
        }

        @media print {
          body {
            padding: 10px;
          }
        }
      </style>
    </head>

    <body>

      <h1>Failed Users</h1>

      <div class="subtitle">
        Total Failed Users:
        <strong class="failed">
          ${this.failedUsers.length}
        </strong>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Reason</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

    </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}


/**
 * Prevent HTML/content from breaking the print page.
 */
private escapeHtml(value: any): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

}