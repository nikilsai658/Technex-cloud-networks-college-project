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
import { BranchService } from '../../../features/services/branch/branch-service';

import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
import { Ellipsis } from '../../directives/ellipsis';
@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [Ellipsis, 
    CommonModule,
    ReactiveFormsModule, FieldErrorPipe
  ],
  templateUrl: './branch.html',
  styleUrls: ['./branch.css']
})
export class Branch implements OnInit {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);


  branches: any[] = [];

  departments: any[] = [];

  branchForm!: FormGroup;

  isEditMode = false;

  selectedBranchId = 0;

  showModal = false;

  searchText = '';

  get filteredBranches(): any[] {

    const term = this.searchText.trim().toLowerCase();

    if (!term)
      return this.branches;

    return this.branches.filter(b =>
      (b.name ?? '').toString().toLowerCase().includes(term) ||
      (b.code ?? '').toString().toLowerCase().includes(term)
    );

  }

  onSearch(event: Event): void {

    this.searchText = (event.target as HTMLInputElement).value;

  }

  constructor(
    private api: BranchService,
    private fb: FormBuilder,
    private cookie: CookieService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.branchForm = this.fb.group({

      name: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(100), AppValidators.title]],

      code: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(30), AppValidators.code]],

    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = tokenStorage.getAccess();

    if (!token) {

      this.router.navigate(['/auth/login']);

      return;

    }

    if (this.auth.hasPermission('VIEW_BRANCH')) {

      this.loadBranches();

    }

  }

  //=====================================
  // Load Branches
  //=====================================

  loadBranches(): void {

    this.api.getBranches().subscribe({

      next: (res: any) => {

        console.log('Branch Response', res);

        if (Array.isArray(res)) {

          this.branches = res;

        }

        else if (Array.isArray(res.data)) {

          this.branches = res.data;

        }

        else if (Array.isArray(res.result)) {

          this.branches = res.result;

        }

        else {

          this.branches = [];

        }

        this.cd.detectChanges();

      },

      error: (err) => {

        console.error(err);

        this.branches = [];

      }

    });

  }

  //=====================================
  // Modal Controls
  //=====================================

  openAddModal(): void {

    this.isEditMode = false;

    this.selectedBranchId = 0;

    this.branchForm.reset();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //=====================================
  // Create Branch
  //=====================================

  createBranch(): void {

    if (this.branchForm.invalid) {

      this.branchForm.markAllAsTouched();

      return;

    }

    this.api.createBranch(this.branchForm.value).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Branch Added Successfully');

        this.branchForm.reset();

        this.showModal = false;

        this.loadBranches();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Edit Branch
  //=====================================

  editBranch(branch: any): void {

    this.isEditMode = true;

    this.selectedBranchId = branch.id;

    this.branchForm.patchValue({

      name: branch.name,

      code: branch.code,

      departmentId: branch.departmentId

    });

    this.showModal = true;

  }

  //=====================================
  // Update Branch
  //=====================================

  updateBranch(): void {

    if (this.branchForm.invalid) {

      this.branchForm.markAllAsTouched();

      return;

    }

    this.api.updateBranch(

      this.selectedBranchId,

      this.branchForm.value

    ).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Branch Updated Successfully');

        this.branchForm.reset();

        this.isEditMode = false;

        this.selectedBranchId = 0;

        this.showModal = false;

        this.loadBranches();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=====================================
  // Delete Branch
  //=====================================

  async deleteBranch(id: number): Promise<void> {

    if (!(await this.confirmDialog.confirmDelete('this branch'))) {

      return;

    }

    this.api.deleteBranch(id).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Branch Deleted Successfully');

        this.loadBranches();

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

    this.branchForm.reset();

    this.isEditMode = false;

    this.selectedBranchId = 0;

    this.showModal = false;

  }

}