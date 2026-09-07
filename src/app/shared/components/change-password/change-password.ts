import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../../features/services/auth/auth-services';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePassword {

  loading = false;

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  Form: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthServices,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.Form = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatchValidator }
    );
  }

  onSubmit(): void {
    if (this.Form.invalid) {
      this.Form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const { oldPassword, newPassword, confirmPassword } = this.Form.value;

    this.auth.changepassword({ oldPassword, newPassword, confirmPassword }).subscribe({
      next: (res: any) => {
        this.loading = false;
        alert('Password changed successfully');
        this.Form.reset();
        this.router.navigate(['/main/profile']);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        console.log('Error:', err);
        alert(err?.error?.message ?? 'Failed to change password');
        this.cdr.markForCheck();
      },
    });
  }
}
