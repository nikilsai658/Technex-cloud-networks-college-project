import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthServices } from '../services/auth/auth-services';
@Component({
  selector: 'app-changepassword',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,FloatLabelModule,ButtonModule,PasswordModule],
  templateUrl: './changepassword.html',
  styleUrl: './changepassword.css',
})
export class Changepassword {
  Form !:FormGroup;
  constructor(private router:Router,private api:AuthServices, private fb:FormBuilder,private cookie:CookieService){
    this.Form=this.fb.group({
      oldPassword:['',Validators.required],
      newPassword:['',Validators.required],
      confirmPassword:['',Validators.required]
    })
  }
  
  onSubmit(){
      if(this.Form.valid){
        this.api.changepassword(this.Form.value).subscribe({
          next:(res)=>{
            alert('sucessfully changed password');
            this.router.navigate(['/profile']);
          },
          error: (err) => {
         console.log('Error:', err);
         alert(JSON.stringify(err.error));
        }
        }
        )      
      }else{
        alert('fill the form');
      }
  }
}
