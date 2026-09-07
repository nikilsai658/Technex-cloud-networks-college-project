import { Component, OnInit } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import { Logo } from '../../../shared/logo/logo';
import { FormBuilder, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CollegeService } from '../../services/college/college-service';
@Component({
  selector: 'app-college',
  imports: [Logo,ButtonModule,FormsModule,SelectModule,ReactiveFormsModule],
  templateUrl: './college.html',
  styleUrl: './college.css',
})
export class College implements OnInit {
  form !:FormGroup;
   colleges: any[] | undefined;
    selectedcollege: any | undefined ;
  constructor(private fb:FormBuilder, private router:Router,private api:CollegeService) {
   this.form=this.fb.group({
    college:['',Validators.required]
   })
  }
    ngOnInit() {
        this.api.getcollege().subscribe({
          next: (res: any) => {
            if (Array.isArray(res)) {
              this.colleges = res;
            } else if (Array.isArray(res?.data)) {
              this.colleges = res.data;
            } else if (Array.isArray(res?.result)) {
              this.colleges = res.result;
            } else {
              this.colleges = [];
            }
          },
          error: (err) => {
            console.error(err);
            this.colleges = [];
          }
        });
    }
    onSubmit(){
      if(this.form.valid){
        localStorage.setItem('college',this.form.value.college.name);
         localStorage.setItem('collegecode',this.form.value.college.code);
          console.log(this.form.value);
        this.router.navigate(['auth/login']);
      }
    }
}
