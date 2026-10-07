import { CommonModule , isPlatformBrowser} from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Logo } from '../../../shared/logo/logo';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthServices} from '../../services/auth/auth-services';
import { AppValidators } from '../../../shared/validators/app-validators';
import { FieldErrorPipe } from '../../../shared/validators/field-error.pipe';
import { ToastService } from '../../../core/toast/toast-service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule,Logo,InputTextModule,ButtonModule,PasswordModule,FloatLabelModule,FieldErrorPipe],
  templateUrl: './reset-password.html',
  styleUrls: ['../../../shared/styles/auth-card.css', './reset-password.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPassword implements OnInit {
  private toast = inject(ToastService);
  Form !: FormGroup;
  collegecode:any;
  message = '';
  messageType: 'success' | 'error' = 'error';
  constructor(private router:Router,private auth:AuthServices , private fb:FormBuilder, private route:ActivatedRoute,private cd: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: Object){
    this.Form=this.fb.group({
      newPassword:['',[Validators.required, AppValidators.strongPassword]],
      confirmPassword:['',Validators.required],
      CollegeCode:['',Validators.required]
    }, { validators: AppValidators.match('newPassword', 'confirmPassword') })
  }
 
   userId!:string;
  token!:string;
  ngOnInit(): void {
     if (isPlatformBrowser(this.platformId)) {
      this.collegecode = localStorage.getItem('collegecode');

      if (this.collegecode) {
        this.Form.patchValue({ CollegeCode: this.collegecode });
      }
    }
    this.route.queryParams.subscribe(params=>
    {
      this.userId=params['userId'];
      this.token=params['token'];
    }
    )
  }
  onSubmit(){
   this.message = '';

   if(this.Form.valid){
    const body = {
      ...this.Form.value,
      userId: this.userId,
      token: this.token
    };
    this.auth.resetpassword(body).subscribe({
      next:(res :any)=>{
        // Show the tag once the login page has loaded
        this.router.navigate(['/auth/login']).then(() =>
          this.toast.successFrom(res, 'Password reset successfully. Please login with your new password.')
        );
      },error:(err :any)=>{
        console.log(err);

        this.messageType = 'error';
        this.message = this.extractErrorMessage(err);
        this.cd.markForCheck();
      }
    })
   }else{
    this.Form.markAllAsTouched();

    this.messageType = 'error';
    this.message = this.Form.get('CollegeCode')?.invalid
      ? 'Please select your college first.'
      : 'Please correct the highlighted fields';
    this.cd.markForCheck();
   }
  }

  private extractErrorMessage(err: any): string {

    const body = err?.error;

    if (typeof body === 'string' && body.trim()) {
      return body;
    }

    return (
      body?.message ||
      body?.title ||
      body?.error ||
      body?.errorMessage ||
      'Failed to reset password. Please try again.'
    );

  }
}
