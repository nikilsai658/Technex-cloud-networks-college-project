import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Logo } from '../../../shared/logo/logo';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthServices} from '../../services/auth/auth-services';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,CommonModule,Logo,InputTextModule,ButtonModule,PasswordModule,FloatLabelModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  Form !: FormGroup;
  constructor(private router:Router,private auth:AuthServices , private fb:FormBuilder, private route:ActivatedRoute,){
    this.Form=this.fb.group({
      newPassword:['',Validators.required],
      confirmPassword:['',Validators.required],
      CollegeCode:['c2']
    })
  }
   userId!:string;
  token!:string;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params=>
    {
      this.userId=params['userId'];
      this.token=params['token'];
    }
    )
  }
  onSubmit(){
   if(this.Form.valid){
    const body = {
      ...this.Form.value,
      userId: this.userId,
      token: this.token
    };
    this.auth.resetpassword(body).subscribe({
      next:(res :any)=>{
        alert('password changed sucessfully');
        this.router.navigate(['/auth/login']);
      },error:(err :any)=>{
        console.log(err);
        alert('failed')
      }
    })
   }else{
    alert('fill the form');
   }
  }
}
