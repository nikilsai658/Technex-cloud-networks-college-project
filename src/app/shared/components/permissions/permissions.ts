import { tokenStorage } from '../../../core/auth/token-storage';
import { Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
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
import { PermissionService } from '../../../features/services/permission/permission-service';

import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
import { Ellipsis } from '../../directives/ellipsis';
@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [Ellipsis, 
    CommonModule,
    ReactiveFormsModule, FieldErrorPipe
  ],
  templateUrl: './permissions.html',
  styleUrls: ['./permissions.css']
})
export class Permission implements OnInit {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);


  permissions: any[] = [];

  permissionForm!: FormGroup;

  isEditMode = false;

  selectedPermissionId = 0;

  showModal = false;

  searchText = '';

  get filteredPermissions(): any[] {

    const term = this.searchText.trim().toLowerCase();

    if (!term)
      return this.permissions;

    return this.permissions.filter(p =>
      (p.name ?? '').toString().toLowerCase().includes(term) ||
      (p.code ?? '').toString().toLowerCase().includes(term)
    );

  }

  onSearch(event: Event): void {

    this.searchText = (event.target as HTMLInputElement).value;

  }

  constructor(
    private api: PermissionService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.permissionForm = this.fb.group({

      name: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(100), AppValidators.title]],

      code: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(30), AppValidators.code]]

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = tokenStorage.getAccess();

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }

    if (this.auth.hasPermission('VIEW_PERMISSION')) {

      this.loadPermissions();

    }

  }

  //============================
  // Load
  //============================

  loadPermissions(): void {

    this.api.getPermissions().subscribe({

      next: (res: any) => {

        if (Array.isArray(res))
          this.permissions = res;

        else if (Array.isArray(res.data))
          this.permissions = res.data;

        else if (Array.isArray(res.result))
          this.permissions = res.result;

        else
          this.permissions = [];

        this.cd.detectChanges();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Modal Controls
  //============================

  openAddModal(): void {

    if (!this.auth.hasPermission('CREATE_PERMISSION')) {
      this.toast.error('No Permission');
      return;
    }

    this.isEditMode = false;

    this.selectedPermissionId = 0;

    this.permissionForm.reset();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //============================
  // Create
  //============================

  createPermission(): void {

    if (!this.auth.hasPermission('CREATE_PERMISSION')) {
      this.toast.error('No Permission');
      return;
    }

    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    this.api.createPermission(this.permissionForm.value).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Permission Added Successfully');

        this.resetForm();

        this.loadPermissions();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Edit
  //============================

  editPermission(permission: any): void {

    if (!this.auth.hasPermission('UPDATE_PERMISSION')) {
      this.toast.error('No Permission');
      return;
    }

    this.isEditMode = true;

    this.selectedPermissionId = permission.id;

    this.permissionForm.patchValue({

      name: permission.name,

      code: permission.code

    });

    this.showModal = true;

  }

  //============================
  // Update
  //============================

  updatePermission(): void {

    if (!this.auth.hasPermission('UPDATE_PERMISSION')) {
      this.toast.error('No Permission');
      return;
    }

    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    this.api.updatePermission(

      this.selectedPermissionId,

      this.permissionForm.value

    ).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Permission Updated Successfully');

        this.resetForm();

        this.loadPermissions();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Delete
  //============================

  async deletePermission(id: number): Promise<void> {

    if (!this.auth.hasPermission('DELETE_PERMISSION')) {
      this.toast.error('No Permission');
      return;
    }

    if (!(await this.confirmDialog.confirmDelete('this permission')))
      return;

    this.api.deletePermission(id).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Permission Deleted Successfully');

        this.loadPermissions();

      },

      error: err => console.error(err)

    });

  }

  //============================
  // Reset
  //============================

  resetForm(): void {

    this.permissionForm.reset({

      name: '',

      code: ''

    });

    this.isEditMode = false;

    this.selectedPermissionId = 0;

    this.showModal = false;

  }

}