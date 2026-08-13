import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError ,catchError} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient,private cookie:CookieService,private router:Router, @Inject(PLATFORM_ID) private platformId: Object){

  }
  private getHeaders(): HttpHeaders {

  if (!isPlatformBrowser(this.platformId)) {
    return new HttpHeaders();
  }

  const token = this.cookie.get('token');

  if (!token) {
    this.router.navigate(['/auth/login']);
    return new HttpHeaders();
  }

  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}
   
 POST(url: string, payload: any) {

  return this.http.post(
    `http://localhost:5000/api/${url}`,
    payload,
    { headers: this.getHeaders() }
  ).pipe(

    catchError((err) => {

      if (err.status === 400) {
        alert(err.error.message);
      } else if (err.status === 401) {
        alert('Unauthorized');
      } else if (err.status === 403) {
        alert('Forbidden');
      } else if (err.status === 404) {
        alert('Not Found');
      } else if (err.status === 500) {
        alert('Internal Server Error');
      } else {
        alert('Something went wrong');
      }

      return throwError(() => err);

    })

  );

}
GET(url: string, params?: any) {
  return this.http.get(`http://localhost:5000/api/${url}`, {
    headers: this.getHeaders(),
    params: params
  }).pipe(
    catchError((err) => {

      if (err.status === 400) {
        alert(err.error.message);
      } else if (err.status === 401) {
        alert('Unauthorized');
      } else if (err.status === 403) {
        alert('Forbidden');
      } else if (err.status === 404) {
        alert('Not Found');
      } else if (err.status === 500) {
        alert('Internal Server Error');
      } else {
        alert('Something went wrong');
      }

      return throwError(() => err);
    })
  );
}
  PUT(url: string, payload: any) {
    return this.http.put(`http://localhost:5000/api/${url}`,payload,{  headers: this.getHeaders()  }).pipe(
      catchError((err)=>{
        if (err.status === 400) {
        alert(err.error.message);
      } else if (err.status === 401) {
        alert('Unauthorized');
      } else if (err.status === 403) {
        alert('Forbidden');
      } else if (err.status === 404) {
        alert('Not Found');
      } else if (err.status === 500) {
        alert('Internal Server Error');
      } else {
        alert('Something went wrong');
      }

      return throwError(() => err);
      })
    )
  }
  
  DELETE(url: string) {
    return this.http.delete(`http://localhost:5000/api/${url}`,{  headers: this.getHeaders()  }).pipe(
      catchError((err)=>{
        if (err.status === 400) {
        alert(err.error.message);
      } else if (err.status === 401) {
        alert('Unauthorized');
      } else if (err.status === 403) {
        alert('Forbidden');
      } else if (err.status === 404) {
        alert('Not Found');
      } else if (err.status === 500) {
        alert('Internal Server Error');
      } else {
        alert('Something went wrong');
      }

      return throwError(() => err);
      })
    )
     
  }
}
