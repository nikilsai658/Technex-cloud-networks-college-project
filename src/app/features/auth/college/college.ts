import { Component, OnInit } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import { Logo } from '../../../shared/logo/logo';
import { FormBuilder, FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
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
  constructor(private fb:FormBuilder, private router:Router) {
   this.form=this.fb.group({
    college:['',Validators.required]
   })
  }
    ngOnInit() {
        this.colleges = [
            { name: 'Jain University', code: 'AU', image: 'assets/jain.png' },
            { name: 'JNTUA college of Engineering Kalikiri', code: 'BR', image: 'assets/jntua.png' },
            { name: 'China', code: 'CN', image: 'assets/china.png' },
            { name: 'Egypt', code: 'EG', image: 'assets/egypt.png' },
            { name: 'France', code: 'FR', image: 'assets/france.png' },
            { name: 'Germany', code: 'DE', image: 'assets/germany.png' },
            { name: 'India', code: 'IN', image: 'assets/india.png' },
            { name: 'Japan', code: 'JP', image: 'assets/japan.png' },
            { name: 'Spain', code: 'ES', image: 'assets/spain.png' },
            { name: 'United States', code: 'US', image: 'assets/united-states.png' }
        ];
    }
    onSubmit(){
      if(this.form.valid){
        localStorage.setItem('college',this.form.value.college.name);
          console.log(this.form.value);
        this.router.navigate(['auth/login']);
      }
    }
}
