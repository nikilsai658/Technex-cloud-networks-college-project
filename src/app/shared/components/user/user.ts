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
  ) { }

  //==========================
  // Forms
  //==========================

  userForm!: FormGroup;

  //==========================
  // Data Sources
  //==========================

  users: any[] = [];
  colleges: any[] = [];
  departments: any[] = [];
  branches: any[] = [];
  roles: any = {};

  //==========================
  // UI
  //==========================

  loading = false;
  submitted = false;
  editMode = false;

selectedUserId: number | null = null;

  //==========================
  // Filters
  //==========================

  selectedRole = '';
  selectedCollege = '';
  selectedDepartment = '';
  selectedBranch = '';
  selectedYear: number | null = null;
  selectedStatus: boolean | null = null;

  //==========================
  // Permissions
  //==========================

  permissions: string[] = [];

  //==========================
  // Search
  //==========================

  searchText = '';

  //==========================
  // Pagination
  //==========================

  page = 1;
  pageSize = 10;
  totalRecords = 0;

  //==========================
  // Sorting
  //==========================

  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  //==========================
  // Lifecycle
  //==========================

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

  get f() {
    return this.userForm.controls;
  }
  //============================================
// Initialize Form
//============================================

initializeForm(): void {

  this.userForm = this.fb.group({

    id: [0],

    firstName: ['', Validators.required],

    lastName: [''],

    userName: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    password: ['', Validators.required],

    phoneNumber: [''],

    roleName: [''],

    collegeName: [''],

    departmentName: [''],

    branchName: [''],

    yearNumber: [null],

    isActive: [true]

  });

}


//============================================
// Load Users
//============================================

loadUsers(): void {

  this.loading = true;

  const roleName = this.userForm.get('roleName')?.value || '';
  const collegeName = this.userForm.get('collegeName')?.value || '';
  const departmentName = this.userForm.get('departmentName')?.value || '';
  const branchName = this.userForm.get('branchName')?.value || '';
  const yearNumber = this.userForm.get('yearNumber')?.value;
  const isActive = this.userForm.get('isActive')?.value;

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
      finalize(() => this.loading = false)
    )
    .subscribe({

      next: (res: any) => {

        console.log('Users Response:', res);

        // IMPORTANT
        if (Array.isArray(res)) {

          this.users = res;

        } else if (Array.isArray(res.data)) {

          this.users = res.data;

        } else if (Array.isArray(res.items)) {

          this.users = res.items;

        } else {

          this.users = [];

        }

        this.totalRecords = this.users.length;

      },

      error: (err) => {

        console.error(err);

        this.users = [];

      }

    });

}
//============================================
// Load Colleges
//============================================

loadColleges(): void {
this.collegeService.getcollege().subscribe({
  next: (res: any) => {

    this.colleges = res.data || [];

  }
});

}


//============================================
// Load Departments
//============================================

loadDepartments(): void {

  this.departmentService
    .getDepartments()
    .subscribe({

      next: (res: any) => {

       this.departments = res.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

}


//============================================
// Load Branches
//============================================

loadBranches(): void {

  this.branchService
    .getBranches()
    .subscribe({

      next: (res: any) => {

        this.branches = res.data ?? [];

      },

      error: (err) => {

        console.error(err);

      }

    });

}


//============================================
// Load Roles
//============================================

loadRoles(): void {

  this.roleService
    .getRoles()
    .subscribe({

      next: (res: any) => {

        this.roles = res.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

}


//============================================
// Load Permissions
//============================================

loadPermissions(): void {

  this.permissions = this.auth.getPermissions?.() || [];

}


//============================================
// Permission Check
//============================================

hasPermission(permission: string): boolean {

  return this.permissions.includes(permission);

}
//===================================================
// Save User
//===================================================

saveUser(): void {

  this.submitted = true;

  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }

  if (this.editMode) {
    this.updateUser();
  } else {
    this.createUser();
  }

}

//===================================================
// Create User
//===================================================

createUser(): void {

  this.loading = true;

  const payload = this.userForm.value;

  this.userService
    .createUser(payload)
    .pipe(finalize(() => this.loading = false))
    .subscribe({

      next: (res: any) => {

        alert(res?.message || 'User created successfully.');

        this.resetForm();

        this.loadUsers();

      },

      error: (err) => {

        console.error(err);

        alert(err?.error?.message || 'Unable to create user.');

      }

    });

}

//===================================================
// Edit User
//===================================================

editUser(user: any): void {

  this.editMode = true;

  this.selectedUserId = user.id;

  this.userForm.patchValue({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    password: '',
    phoneNumber: user.phoneNumber,
    roleName: user.roleName,
    collegeName: user.collegeName,
    departmentName: user.departmentName,
    branchName: user.branchName,
    yearNumber: user.yearNumber,
    isActive: user.isActive
  });

}

//===================================================
// Update User
//===================================================

updateUser(): void {

  this.loading = true;
  const payload = this.userForm.value;
  if (this.selectedUserId == null) {
  return;
}
  this.userService
    .updateUser(this.selectedUserId, payload)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (res: any) => {
        alert(res?.message || 'User updated successfully.');
        this.resetForm();
        this.loadUsers();
      },

      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Unable to update user.');
      }

    });

}

//===================================================
// Delete User
//===================================================

deleteUser(id: number): void {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }

  this.loading = true;
  this.userService
    .deleteUser(id)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (res: any) => {
        alert(res?.message || 'User deleted successfully.');
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Unable to delete user.');
      }

    });

}

//===================================================
// Reset Form
//===================================================

resetForm(): void {

  this.submitted = false;

  this.editMode = false;

  this.selectedUserId = null;

  this.userForm.reset({

    id: 0,

    firstName: '',

    lastName: '',

    userName: '',

    email: '',

    password: '',

    phoneNumber: '',

    roleName: '',

    collegeName: '',

    departmentName: '',

    branchName: '',

    yearNumber: null,

    isActive: true

  });

}

//===================================================
// Cancel Edit
//===================================================

cancelEdit(): void {

  this.resetForm();

}
//====================================================
// Search Users
//====================================================

searchUsers(): void {

  const search = this.searchText?.trim().toLowerCase();

  if (!search) {
    this.loadUsers();
    return;
  }

  this.users = this.users.filter((x: any) =>
    x.firstName?.toLowerCase().includes(search) ||
    x.lastName?.toLowerCase().includes(search) ||
    x.userName?.toLowerCase().includes(search) ||
    x.email?.toLowerCase().includes(search) ||
    x.roleName?.toLowerCase().includes(search)
  );

}

//====================================================
// Sort
//====================================================

sort(column: string): void {

  if (this.sortColumn === column) {
    this.sortDirection =
      this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.users.sort((a: any, b: any) => {

    const valueA = a[column];
    const valueB = b[column];

    if (valueA < valueB)
      return this.sortDirection === 'asc' ? -1 : 1;

    if (valueA > valueB)
      return this.sortDirection === 'asc' ? 1 : -1;

    return 0;

  });

}

//====================================================
// Pagination
//====================================================

get pagedUsers(): any[] {

  const start = (this.page - 1) * this.pageSize;

  return this.users.slice(start, start + this.pageSize);

}

nextPage(): void {

  if (this.page * this.pageSize < this.users.length) {
    this.page++;
  }

}

previousPage(): void {

  if (this.page > 1) {
    this.page--;
  }

}

//====================================================
// College Changed
//====================================================

onCollegeChange(): void {

  const college = this.userForm.value.collegeName;

  this.departmentService.getDepartments()
    .subscribe({

      next: (res: any) => {

        this.departments = res;

        this.branches = [];

        this.userForm.patchValue({

          departmentName: '',
          branchName: ''

        });

      }

    });

}

//====================================================
// Department Changed
//====================================================

onDepartmentChange(): void {

  const department = this.userForm.value.departmentName;

  this.branchService.getBranches()
    .subscribe({

      next: (res: any) => {

        this.branches = res;

        this.userForm.patchValue({

          branchName: ''

        });

      }

    });

}

//====================================================
// Status Changed
//====================================================

changeStatus(user: any): void {

  const payload = {

    ...user,

    isActive: !user.isActive

  };

  this.userService
    .updateUser(user.id, payload)
    .subscribe({

      next: () => {

        user.isActive = !user.isActive;

      },

      error: (err) => {

        console.error(err);

      }

    });

}

//====================================================
// Refresh
//====================================================

refresh(): void {

  this.resetForm();

  this.loadUsers();

}

//====================================================
// TrackBy
//====================================================

trackById(index: number, item: any): number {

  return item.id;

}

//====================================================
// Clear Filters
//====================================================

clearFilters(): void {

  this.userForm.patchValue({

    roleName: '',
    collegeName: '',
    departmentName: '',
    branchName: '',
    yearNumber: null,
    isActive: true

  });

  this.loadUsers();

}

//====================================================
// Logout
//====================================================

logout() {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

}
}