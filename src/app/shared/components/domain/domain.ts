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
import { DomainServices } from '../../../features/services/domain/domain-services';

import { ToastService } from '../../../core/toast/toast-service';
import { ConfirmService } from '../../../core/confirm/confirm-service';
import { AppValidators } from '../../validators/app-validators';
import { FieldErrorPipe } from '../../validators/field-error.pipe';
import { Ellipsis } from '../../directives/ellipsis';
@Component({
  selector: 'app-domain',
  standalone: true,
  imports: [Ellipsis, 
    CommonModule,
    ReactiveFormsModule, FieldErrorPipe
  ],
  templateUrl: './domain.html',
  styleUrls: ['./domain.css']
})
export class DomainComponent implements OnInit {

  private toast = inject(ToastService);
  private confirmDialog = inject(ConfirmService);


  domains: any[] = [];

  domainForm!: FormGroup;

  isEditMode = false;

  selectedId = 0;

  loading = false;

  showModal = false;

  constructor(
    private fb: FormBuilder,
    private api:DomainServices,
    private cookie: CookieService,
    private router: Router,
    public auth: Auth,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    this.domainForm = this.fb.group({
      name: ['', [...AppValidators.requiredText, Validators.minLength(2), Validators.maxLength(100), AppValidators.title]],
      description: ['', [...AppValidators.requiredText, Validators.minLength(10), Validators.maxLength(1000)]],
      eligibleFromYear: [1, [Validators.required, Validators.min(1), Validators.max(4), AppValidators.integer]],
      eligibleToYear: [1, [Validators.required, Validators.min(1), Validators.max(4), AppValidators.integer]],
      isActive: [true]
    }, { validators: AppValidators.range('eligibleFromYear', 'eligibleToYear') });

    if (!isPlatformBrowser(this.platformId)) return;

    const token = tokenStorage.getAccess();

    if (!token) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadDomains();
  }

  //=============================
  // GET ALL
  //=============================

  loadDomains(): void {

    this.loading = true;

    this.api.getDomains().subscribe({

      next: (res: any) => {

        this.loading = false;

        this.domains =
          res.data ??
          res.result ??
          res.items ??
          res;

        if (!Array.isArray(this.domains)) {
          this.domains = [];
        }

        this.cd.detectChanges();
      },

      error: (err) => {

        this.loading = false;

        console.error(err);

      }

    });

  }

  //=============================
  // MODAL CONTROLS
  //=============================

  openAddModal(): void {

    if (!this.auth.hasPermission('CREATE_DOMAIN')) {
      this.toast.error('Permission denied');
      return;
    }

    this.resetForm();

    this.showModal = true;

  }

  closeModal(): void {

    this.showModal = false;

    this.resetForm();

  }

  //=============================
  // CREATE
  //=============================

  createDomain(): void {

    if (!this.auth.hasPermission('CREATE_DOMAIN')) {
      this.toast.error('Permission denied');
      return;
    }

    if (this.domainForm.invalid) {
      this.domainForm.markAllAsTouched();
      return;
    }

    this.api.createDomain(this.domainForm.value).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Domain Added Successfully');

        this.resetForm();

        this.loadDomains();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=============================
  // EDIT
  //=============================

  editDomain(domain: any): void {

    if (!this.auth.hasPermission('UPDATE_DOMAIN')) {
      this.toast.error('Permission denied');
      return;
    }

    this.isEditMode = true;

    this.selectedId = domain.id;

    this.domainForm.patchValue({

      name: domain.name,
      description: domain.description,
      eligibleFromYear: domain.eligibleFromYear,
      eligibleToYear: domain.eligibleToYear,
      isActive: domain.isActive

    });

    this.showModal = true;

  }

  //=============================
  // UPDATE
  //=============================

  updateDomain(): void {

    if (!this.auth.hasPermission('UPDATE_DOMAIN')) {
      this.toast.error('Permission denied');
      return;
    }

    if (this.domainForm.invalid) {
      this.domainForm.markAllAsTouched();
      return;
    }

    this.api.updateDomain(
      this.selectedId,
      this.domainForm.value
    ).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Domain Updated Successfully');

        this.resetForm();

        this.loadDomains();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=============================
  // DELETE
  //=============================

  async deleteDomain(id: number): Promise<void> {

    if (!this.auth.hasPermission('DELETE_DOMAIN')) {
      this.toast.error('Permission denied');
      return;
    }

    if (!(await this.confirmDialog.confirmDelete('this domain'))) return;

    this.api.deleteDomain(id).subscribe({

      next: (res: any) => {

        this.toast.successFrom(res, 'Deleted Successfully');

        this.loadDomains();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  //=============================
  // RESET
  //=============================

  resetForm(): void {

    this.isEditMode = false;

    this.selectedId = 0;

    this.showModal = false;

    this.domainForm.reset({

      name: '',
      description: '',
      eligibleFromYear: 1,
      eligibleToYear: 1,
      isActive: true

    });

  }

}