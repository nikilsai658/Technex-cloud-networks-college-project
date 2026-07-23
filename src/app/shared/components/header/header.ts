import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(private router:Router,private cookie:CookieService){}
  logout(){
    localStorage.removeItem('user');
    this.cookie.delete('token','/');
    this.cookie.delete('refresh','/');
    this.router.navigate(['/auth/login']);
  }
}
