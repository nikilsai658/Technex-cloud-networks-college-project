import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Superadmin } from '../../../features/services/superadmin/superadmin';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-superadmin',
  imports: [CommonModule],
  templateUrl: './superadmin.html',
  styleUrl: './superadmin.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class SuperAdmin implements OnInit{
 
colleges:any[]=[];
loading=false;
constructor(private api:Superadmin,
  private cd:ChangeDetectorRef,
  private router:Router,
  @Inject(PLATFORM_ID) private platformId:Object
){}
 ngOnInit(): void {
   this.loadsuperadmincolleges();
 }
 loadsuperadmincolleges():void{
  this.loading=true;
  this.api.getsuperadmincolleges().subscribe({
    next:(res:any)=>{
      this.colleges= res?.data ??[];
      this.loading=false;
      this.cd.markForCheck()
    },
    error:()=>{
      this.colleges=[];
      this.loading=false;
    }
  });
 }
 View(collegeId:number):void{
  this.router.navigate(['/main/superadmin-domains'],
    {state:{collegeId}}
  )
 }
}
