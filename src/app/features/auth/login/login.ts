import { Component } from '@angular/core';
import { Logo } from '../../../shared/logo/logo';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import {FormBuilder,Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServices } from '../../services/auth/auth-services'
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [Logo, FloatLabelModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  Form !:FormGroup;
   constructor(private fb: FormBuilder, private router:Router,private cookie:CookieService,private auth:AuthServices){
    this.Form=this.fb.group({
      userNameOrEmail: ['',Validators.required],
      password: ['',Validators.required],
      collegeCode:['c1']
    });
   }
   onSubmit(){
    if(this.Form.valid){
      this.auth.login(this.Form.value).subscribe({
        next:(res :any)=>{
          const token=res.data.accessToken;
          const refresh=res.data.refreshToken;
          localStorage.setItem('user', JSON.stringify(res));
          this.cookie.set('token', token, 7, '/');
          this.cookie.set('refresh', refresh, 7, '/');
         if(res.data.isFirstLogin=== true ){
          this.router.navigate(['/changepassword']);
         }else if(res.data.isFirstLogin=== false && res.profileCompleted=== false){
           this.router.navigate(['/profile']);
         }else{
         this.router.navigate(['/main']);
         }  
        },error:(err)=>{
          console.log(err);
        }
      })
    }
   }
}