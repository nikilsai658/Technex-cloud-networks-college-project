import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AuthServices } from '../services/auth/auth-services';
@Component({
  selector: 'app-profile-page',
  imports: [CommonModule,ReactiveFormsModule,InputTextModule,FloatLabelModule,ButtonModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  Form !:FormGroup;
  constructor(private fb:FormBuilder,private router:Router, private cookie:CookieService,private auth:AuthServices){
    this.Form=this.fb.group({
      fullName: ['',Validators.required],
  firstName: ['',Validators.required],
  middleName: ['',Validators.required],
  lastName: ['',Validators.required],
  phoneNumber:['',Validators.required],
  alternatePhoneNumber: ['',Validators.required],
  alternateEmail:['',Validators.required]
    })
  }

  onSubmit(){
    if(this.Form.valid){
    this.auth.profileupdate(this.Form.value).subscribe({
      next:(res)=>{
        alert('updated sucessfully');
        this.router.navigate(['/main']);
      },error:(err)=>{
       alert('failed');
       console.log(err);
      }
    })
    }else{
      alert('fill the Form');
    }
  }
}
