import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { finalize } from 'rxjs';

import { Auth } from '../../../core/auth/auth';

import { RoleService } from '../../../features/services/role/role-service';
import { PermissionService } from '../../../features/services/permission/permission-service';
import { RolepermissionService } from '../../../features/services/rolepermission/rolepermission-service';

@Component({
  selector: 'app-rolepermission',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './rolepermission.html',
  styleUrls: ['./rolepermission.css']
})
export class RolePermissionComponent implements OnInit {

  rolePermissionForm!: FormGroup;

  rawMappings: any[] = [];
  mappings: any[] = [];
  filteredMappings: any[] = [];

  roles: any[] = [];
  permissions: any[] = [];
  roleNames: string[] = [];

  submitted = false;
  loading = false;
  showModal = false;

  searchText = '';
  roleNameFilter = '';

  //=====================================
  // PAGINATION
  //=====================================

  currentPage = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    public auth: Auth,
    private rolePermissionService:  RolepermissionService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.buildForm();

    this.loadRoles();

    this.loadPermissions();

    this.loadMappings();

  }

  buildForm(): void {

    this.rolePermissionForm = this.fb.group({

      roleName: ['', Validators.required],

      permissionCode: ['', Validators.required],

      canDelegate: [true]

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

  //=====================================
  // LOAD ROLES
  //=====================================

  loadRoles(): void {

    this.roleService.getRoles().subscribe({

      next: (res: any) => {

        this.roles = res.data || [];

        this.cd.detectChanges();

      },

      error: () => {

        this.roles = [];

      }

    });

  }

  //=====================================
  // LOAD PERMISSIONS
  //=====================================

  loadPermissions(): void {

    this.permissionService.getPermissions().subscribe({

      next: (res: any) => {

        this.permissions = res.data || [];

        this.buildMappings();

        this.cd.detectChanges();

      },

      error: () => {

        this.permissions = [];

      }

    });

  }

  //=====================================
  // LOAD MAPPINGS
  //=====================================
  // API returns mappings split into two groups
  // (adminRolePermissions / collegeRolePermissions);
  // merge them into a single flat list for display.

  loadMappings(): void {

    this.loading = true;

    this.rolePermissionService
      .getRolepermissions()
      .pipe(finalize(() => this.loading = false))
      .subscribe({

        next: (res: any) => {

          const data = res?.data || {};

          const admin = (data.adminRolePermissions || [])
            .map((x: any) => ({ ...x, groupType: 'Admin' }));

          const college = (data.collegeRolePermissions || [])
            .map((x: any) => ({ ...x, groupType: 'College' }));

          this.rawMappings = [...admin, ...college];

          this.buildMappings();

          this.cd.detectChanges();

        },

        error: () => {

          this.rawMappings = [];

          this.mappings = [];

          this.filteredMappings = [];

        }

      });

  }

  //=====================================
  // BUILD MAPPINGS (enrich + filter)
  //=====================================

  buildMappings(): void {

    this.mappings = this.rawMappings.map(item => {

      const permission = this.permissions.find(p => p.id === item.permissionId);

      return {
        ...item,
        permissionCode: item.permissionCode || permission?.code || '',
        permissionName: item.permissionName || permission?.name || item.permissionCode || ''
      };

    });

    this.roleNames = Array.from(
      new Set(this.mappings.map(m => m.roleName).filter(Boolean))
    ).sort();

    this.applyFilters();

  }

  //=====================================
  // SAVE
  //=====================================

  save(): void {

    this.submitted = true;

    if (!this.auth.hasPermission('CREATE_ROLE_PERMISSION')) return;

    if (this.rolePermissionForm.invalid) {

      this.rolePermissionForm.markAllAsTouched();

      return;

    }

    const payload = this.rolePermissionForm.value;

    this.loading = true;

    this.rolePermissionService
      .createRolepermission(payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({

        next: () => {

          this.loadMappings();

          this.closeModal();

        }

      });

  }

  //=====================================
  // DELETE
  //=====================================

  delete(id: number): void {

    if (!this.auth.hasPermission('DELETE_ROLE_PERMISSION')) return;

    if (!confirm('Delete this mapping?')) return;

    this.rolePermissionService
      .deleteRolepermission(id)
      .subscribe({

        next: () => {

          this.loadMappings();

        }

      });

  }

  //=====================================
  // RESET
  //=====================================

  resetForm(): void {

    this.submitted = false;

    this.rolePermissionForm.reset({

      roleName: '',

      permissionCode: '',

      canDelegate: true

    });

  }

  //=====================================
  // SEARCH / FILTER
  //=====================================

  search(): void {

    this.applyFilters();

  }

  onRoleFilterChange(): void {

    this.applyFilters();

  }

  applyFilters(): void {

    const value = this.searchText.toLowerCase();

    this.filteredMappings = this.mappings.filter(x => {

      const matchesSearch = !value ||
        (x.roleName || '').toLowerCase().includes(value) ||
        (x.permissionCode || '').toLowerCase().includes(value) ||
        (x.permissionName || '').toLowerCase().includes(value);

      const matchesRole = !this.roleNameFilter || x.roleName === this.roleNameFilter;

      return matchesSearch && matchesRole;

    });

    this.currentPage = 1;

  }

  //=====================================
  // PAGINATION
  //=====================================

  get totalPages(): number {

    return Math.ceil(
      this.filteredMappings.length / this.pageSize
    ) || 1;

  }

  get pageNumbers(): number[] {

    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );

  }

  get visiblePages(): (number | '...')[] {

    const total = this.totalPages;
    const current = this.currentPage;
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

    return this.filteredMappings.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;

  }

  get rangeEnd(): number {

    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredMappings.length
    );

  }

  get pagedMappings(): any[] {

    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredMappings.slice(
      start,
      start + this.pageSize
    );

  }

  goToPage(page: number): void {

    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

  }

  prevPage(): void {

    this.goToPage(this.currentPage - 1);

  }

  nextPage(): void {

    this.goToPage(this.currentPage + 1);

  }

}
