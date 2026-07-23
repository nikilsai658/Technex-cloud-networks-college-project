import { Component } from '@angular/core';
import { Logo } from '../../../shared/logo/logo';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthServices } from '../../services/auth/auth-services';
@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports: [Logo,FloatLabelModule,FormsModule,InputTextModule,ButtonModule,PasswordModule,CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

   Form !:FormGroup
    constructor(private auth:AuthServices,private fb:FormBuilder,private router:Router){
      this.Form=this.fb.group({
        email:['', Validators.required],
        collegeCode:['c2']
      })
    }
   OnSubmit():void{
    if(this.Form.valid){
      this.auth.forgotpassword(this.Form.value).subscribe({
        next:(res)=>{
           alert('sucessfully sent to mail')
           this.router.navigate(['/auth/login']);
        },error(err){
         console.log(err);
        }
      })
    }
   }
}
