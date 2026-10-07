import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Logo } from '../../../shared/logo/logo';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import {FormBuilder,Validators} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthServices } from '../../services/auth/auth-services'
import { UserStore } from '../../../core/store/user';
import { tokenStorage } from '../../../core/auth/token-storage';
import { ToastService } from '../../../core/toast/toast-service';
import { AppValidators } from '../../../shared/validators/app-validators';
import { FieldErrorPipe } from '../../../shared/validators/field-error.pipe';
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [Logo, FloatLabelModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, ReactiveFormsModule, CommonModule, RouterLink, FieldErrorPipe],
  templateUrl: './login.html',
  styleUrls: ['../../../shared/styles/auth-card.css', './login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login implements OnInit{
  private toast = inject(ToastService);
  Form !:FormGroup;
  collegecode:any;
  errorMessage = '';
  loading = false;
   constructor(private fb: FormBuilder, private router:Router,private auth:AuthServices,private userStore:UserStore,private cd: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: Object){
    this.Form=this.fb.group({
      userNameOrEmail: ['',[...AppValidators.requiredText, AppValidators.usernameOrEmail]],
      password: ['',AppValidators.requiredText],
      collegeCode: ['', Validators.required]
    });
    
   }
    ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.collegecode = localStorage.getItem('collegecode');

      if (this.collegecode) {
        this.Form.patchValue({ collegeCode: this.collegecode });
      }
    }
  }
     
   onSubmit(){
    this.errorMessage = '';
    this.Form.markAllAsTouched();

    if(this.Form.get('collegeCode')?.invalid){
      this.errorMessage = 'Please select your college first.';
      return;
    }

    if(this.Form.valid){
      this.loading = true;
      this.cd.markForCheck();

      this.auth.login(this.Form.value).subscribe({
        next:(res :any)=>{
          this.loading = false;

          const token=res.data.accessToken;
          const refresh=res.data.refreshToken;
         localStorage.setItem('user', JSON.stringify(res.data));
          this.userStore.setUser(res.data);
          tokenStorage.clear();
          tokenStorage.set(token, refresh);
         let target = ['/main'];
         if(res.data.isFirstLogin=== true ){
          target = ['/changepassword'];
         }else if(res.data.isFirstLogin=== false && res.data.profileCompleted=== false){
           target = ['/profile'];
         }
         // Show the tag once the next page has loaded
         this.router.navigate(target).then(() =>
           this.toast.successFrom(res, 'Login Successful')
         );
        },error:(err)=>{
          console.log(err);

          this.loading = false;

          this.errorMessage = this.extractErrorMessage(err);

          this.cd.markForCheck();
        }
      })
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
      'Invalid username or password. Please try again.'
    );

   }
}