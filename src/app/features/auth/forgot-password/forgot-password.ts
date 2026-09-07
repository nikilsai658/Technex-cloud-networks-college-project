import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Logo } from '../../../shared/logo/logo';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PasswordModule} from 'primeng/password';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthServices } from '../../services/auth/auth-services';
@Component({
  selector: 'app-forgot-password',
  standalone:true,
  imports: [Logo,FloatLabelModule,FormsModule,InputTextModule,ButtonModule,PasswordModule,CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit {

   Form !:FormGroup
   collegecode:any;
    constructor(private auth:AuthServices,private fb:FormBuilder,private router:Router,@Inject(PLATFORM_ID) private platformId: Object){
      this.Form=this.fb.group({
        email:['', Validators.required],
        collegeCode:['', Validators.required]
      })
    }
    ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.collegecode = localStorage.getItem('collegecode');

        if (this.collegecode) {
          this.Form.patchValue({ collegeCode: this.collegecode });
        }
      }
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
