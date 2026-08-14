import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Logo } from '../../../shared/logo/logo';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import {FormBuilder,Validators} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServices } from '../../services/auth/auth-services'
import { UserStore } from '../../../core/store/user';
@Component({
  selector: 'app-login',
  standalone:true,
  imports: [Logo, FloatLabelModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{
  Form !:FormGroup;
  collegecode:any;
   constructor(private fb: FormBuilder, private router:Router,private cookie:CookieService,private auth:AuthServices,private userStore:UserStore,@Inject(PLATFORM_ID) private platformId: Object){
    if (isPlatformBrowser(this.platformId)) {
      this.collegecode = localStorage.getItem('collegecode');
    }

    this.Form=this.fb.group({
      userNameOrEmail: ['',Validators.required],
      password: ['',Validators.required],
      collegeCode: [this.collegecode || "HECT", Validators.required]
    });

   }
    ngOnInit(): void {
  }
     
   onSubmit(){
    if(this.Form.valid){
      this.auth.login(this.Form.value).subscribe({
        next:(res :any)=>{
          const token=res.data.accessToken;
          const refresh=res.data.refreshToken;
         localStorage.setItem('user', JSON.stringify(res.data));
          this.userStore.setUser(res.data);
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