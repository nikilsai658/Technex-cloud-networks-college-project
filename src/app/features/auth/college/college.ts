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
        this.colleges = [
            { name: 'Jain University', code: 'AU'},
            {name:'HINDUSTHAN COLLEGE OF ENGINEERING',code:'HECT'},
            {name:'RVS COLLEGE OF ENGINEERING',code:'RVS'},
            {name:'CMS COLLEGE OF SCIENCE & COMMERCE',code:'CMS'}
        ];
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
