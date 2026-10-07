import { Logo } from '../../shared/logo/logo';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServices } from '../services/auth/auth-services';
import { ToastService } from '../../core/toast/toast-service';
import { AppValidators } from '../../shared/validators/app-validators';
import { FieldErrorPipe } from '../../shared/validators/field-error.pipe';
@Component({
  selector: 'app-changepassword',
  standalone:true,
  imports: [Logo,CommonModule,ReactiveFormsModule,FloatLabelModule,ButtonModule,PasswordModule,FieldErrorPipe],
  templateUrl: './changepassword.html',
  styleUrls: ['../../shared/styles/auth-card.css', './changepassword.css'],
})
export class Changepassword {

  private toast = inject(ToastService);

  Form !:FormGroup;
  constructor(private router:Router,private api:AuthServices, private fb:FormBuilder,private cookie:CookieService){
    this.Form=this.fb.group({
      oldPassword:['',Validators.required],
      newPassword:['',[Validators.required, AppValidators.strongPassword]],
      confirmPassword:['',Validators.required]
    }, { validators: AppValidators.match('newPassword', 'confirmPassword') })
  }

  onSubmit(){
      this.Form.markAllAsTouched();
      if(this.Form.valid){
        this.api.changepassword(this.Form.value).subscribe({
          next:(res)=>{
            this.toast.successFrom(res, 'sucessfully changed password');
            this.router.navigate(['/profile']);
          },
          
          error: (err) => {
         console.log('Error:', err);
        }
        }
        )      
      }else{
        this.toast.warning('fill the form');
      }
  }
}
