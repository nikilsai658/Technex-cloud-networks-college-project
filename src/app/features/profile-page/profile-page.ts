import { Logo } from '../../shared/logo/logo';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthServices } from '../services/auth/auth-services';
import { ToastService } from '../../core/toast/toast-service';
import { AppValidators } from '../../shared/validators/app-validators';
import { FieldErrorPipe } from '../../shared/validators/field-error.pipe';
@Component({
  selector: 'app-profile-page',
  imports: [Logo,CommonModule,ReactiveFormsModule,InputTextModule,FloatLabelModule,ButtonModule,FieldErrorPipe],
  templateUrl: './profile-page.html',
  styleUrls: ['../../shared/styles/auth-card.css', './profile-page.css'],
})
export class ProfilePage {

  private toast = inject(ToastService);

  Form !:FormGroup;
  constructor(private fb:FormBuilder,private router:Router, private cookie:CookieService,private auth:AuthServices){
    this.Form=this.fb.group({
      fullName: ['',[...AppValidators.requiredText, Validators.minLength(3), Validators.maxLength(100), AppValidators.personName]],
  firstName: ['',[...AppValidators.requiredText, Validators.maxLength(50), AppValidators.personName]],
  middleName: ['',[Validators.maxLength(50), AppValidators.personName]],
  lastName: ['',[...AppValidators.requiredText, Validators.maxLength(50), AppValidators.personName]],
  phoneNumber:['',[Validators.required, AppValidators.phone]],
  alternatePhoneNumber: ['',AppValidators.phone],
  alternateEmail:['',AppValidators.email]
    })
  }

  onSubmit(){
    this.Form.markAllAsTouched();
    if(this.Form.valid){
    this.auth.profileupdate(this.Form.value).subscribe({
      next:(res)=>{
        this.router.navigate(['/main']).then(() =>
          this.toast.successFrom(res, 'Profile Updated Successfully')
        );
      },error:(err)=>{
       console.log(err);
      }
    })
    }else{
      this.toast.warning('Please correct the highlighted fields');
    }
  }
}
