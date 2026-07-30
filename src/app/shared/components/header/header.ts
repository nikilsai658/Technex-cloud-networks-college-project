import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/auth';
import { UserStore } from '../../../core/store/user';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  username:string|undefined='';
  collegeLogo = '';
colleges = [
  {
    name: 'Jain University',
    logo: 'assets/images/jain-logo.png'
  },
  {
    name: 'HINDUSTHAN COLLEGE OF ENGINEERING',
    logo: 'assets/images/Hindusthan_college.png'
  },
  {
    name: 'RVS COLLEGE OF ENGINEERING',
    logo: 'assets/images/Rvs_college.png'
  },
  {
    name: 'CMS COLLEGE OF SCIENCE & COMMERCE',
    logo: 'assets/images/CMS_college.png'
  }
];

  constructor(private router:Router,private cookie:CookieService,public auth:Auth,private userStore:UserStore){}
  logout(){
    this.userStore.clearUser();
    this.cookie.delete('token','/');
    this.cookie.delete('refresh','/');
    this.router.navigate(['/auth/login']);
  }

  ngOnInit(): void {
     const user = this.userStore.user();

  if (!user) {
    return;
  }

  this.username = user.name;

  const selectedCollege = this.colleges.find(college =>
    college.name.trim().toLowerCase() ===
    user.collegeName.trim().toLowerCase()
  );

  if (selectedCollege) {
    this.collegeLogo = selectedCollege.logo;
  }
  }
  sidebarOpen = false;
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
