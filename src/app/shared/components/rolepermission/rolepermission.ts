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
    FormsModule
  ],
  templateUrl: './rolepermission.html',
  styleUrls: ['./rolepermission.css']
})
export class RolePermissionComponent implements OnInit {

  rolePermissionForm!: FormGroup;

  mappings: any[] = [];
  filteredMappings: any[] = [];

  roles: any[] = [];
  permissions: any[] = [];

  submitted = false;
  loading = false;

  editMode = false;
  selectedId: number | null = null;

  searchText = '';

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

  loadMappings(): void {

    this.loading = true;

    this.rolePermissionService
      .getRolepermissions()
      .pipe(finalize(() => this.loading = false))
      .subscribe({

        next: (res: any) => {

          this.mappings = res.data || [];

          this.filteredMappings = [...this.mappings];

          this.currentPage = 1;

          this.cd.detectChanges();

        },

        error: () => {

          this.mappings = [];

          this.filteredMappings = [];

        }

      });

  }

  //=====================================
  // SAVE
  //=====================================

  save(): void {

    this.submitted = true;

    if (this.rolePermissionForm.invalid) {

      this.rolePermissionForm.markAllAsTouched();

      return;

    }

    const payload = this.rolePermissionForm.value;

    this.loading = true;

    if (this.editMode) {

      if (this.selectedId == null) return;

      this.rolePermissionService
        .updateRolepermission(this.selectedId, payload)
        .pipe(finalize(() => this.loading = false))
        .subscribe({

          next: () => {

            this.loadMappings();

            this.resetForm();

          }

        });

    } else {

      this.rolePermissionService
        .createRolepermission(payload)
        .pipe(finalize(() => this.loading = false))
        .subscribe({

          next: () => {

            this.loadMappings();

            this.resetForm();

          }

        });

    }

  }

  //=====================================
  // EDIT
  //=====================================

  edit(item: any): void {

    if (!this.auth.hasPermission('UPDATE_ROLE_PERMISSION')) return;

    this.editMode = true;

    this.selectedId = item.id;

    this.rolePermissionForm.patchValue({

      roleName: item.roleName,

      permissionCode: item.permissionCode,

      canDelegate: item.canDelegate

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

    this.editMode = false;

    this.selectedId = null;

    this.rolePermissionForm.reset({

      roleName: '',

      permissionCode: '',

      canDelegate: true

    });

  }

  //=====================================
  // SEARCH
  //=====================================

  search(): void {

    const value = this.searchText.toLowerCase();

    this.filteredMappings = this.mappings.filter(x =>

      x.roleName.toLowerCase().includes(value) ||

      x.permissionCode.toLowerCase().includes(value)

    );

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