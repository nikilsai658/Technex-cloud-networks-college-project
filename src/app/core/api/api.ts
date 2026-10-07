import { tokenStorage } from '../auth/token-storage';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, throwError ,catchError} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from '../toast/toast-service';
@Injectable({
  providedIn: 'root',
})
export class Api {
  constructor(private http: HttpClient,private cookie:CookieService,private router:Router, @Inject(PLATFORM_ID) private platformId: Object, private toast: ToastService){

  }
  private getHeaders(): HttpHeaders {

  if (!isPlatformBrowser(this.platformId)) {
    return new HttpHeaders();
  }

  const token = tokenStorage.getAccess();

  if (!token) {
    // No token yet (e.g. the pre-login college-select page) — send the
    // request without an Authorization header instead of redirecting;
    // a 401 from the backend is still handled by handleError().
    return new HttpHeaders();
  }

  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}

private showAlert(message: string): void {
  if (isPlatformBrowser(this.platformId)) {
    this.toast.error(message);
  }
}

// Pulls the human-readable message out of the backend's error body.
// Handles { message }, plain strings, and ASP.NET ProblemDetails
// ({ title, detail, errors: { Field: ["..."] } }).
private extractMessage(err: any): string {
  const body = err?.error;

  if (typeof body === 'string' && body.trim()) {
    return body.trim();
  }

  if (body && typeof body === 'object') {
    if (typeof body.message === 'string' && body.message.trim()) {
      return body.message.trim();
    }
    if (typeof body.Message === 'string' && body.Message.trim()) {
      return body.Message.trim();
    }
    if (body.errors && typeof body.errors === 'object') {
      const messages = Object.values(body.errors)
        .flat()
        .filter((m): m is string => typeof m === 'string' && !!m.trim());
      if (messages.length) {
        return messages.join('\n');
      }
    }
    if (typeof body.detail === 'string' && body.detail.trim()) {
      return body.detail.trim();
    }
    if (typeof body.title === 'string' && body.title.trim()) {
      return body.title.trim();
    }
  }

  return '';
}

private handleError(err: any, silent = false, method = 'GET') {

  // Silent mode: the caller renders its own inline error UI, so skip
  // the blocking alert(s) — still clear stale auth on a 401 though.
  if (silent) {
    if (err.status === 401) {
      tokenStorage.clear();
    }
    return throwError(() => err);
  }

  const serverMessage = this.extractMessage(err);

  if (err.status === 401) {
    tokenStorage.clear();
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/auth/login']);
    }
  } else if (err.status === 404 && method === 'GET') {
    // A 404 on a "get my records" style endpoint usually just means
    // "nothing found yet" — let the calling component's own error
    // handler decide how to render that instead of interrupting the
    // user with a blocking alert.
  } else if (serverMessage) {
    // e.g. 409 "Role already exists" — show exactly what the server said
    this.showAlert(serverMessage);
  } else if (err.status === 0) {
    this.showAlert('Unable to reach the server. Please check your connection.');
  } else if (err.status === 403) {
    this.showAlert('You do not have permission to perform this action.');
  } else if (err.status === 404) {
    this.showAlert('The requested record was not found.');
  } else if (err.status === 409) {
    this.showAlert('This record already exists.');
  } else if (err.status >= 500) {
    this.showAlert('Internal Server Error');
  } else {
    this.showAlert('Request failed. Please try again.');
  }

  return throwError(() => err);
}

 POST(url: string, payload: any, options?: { silent?: boolean }) {

  return this.http.post(
    `http://localhost:5000/api/${url}`,
    payload,
    { headers: this.getHeaders() }
  ).pipe(

    catchError((err) => this.handleError(err, options?.silent, 'POST'))

  );

}
GET(url: string, params?: any, options?: { silent?: boolean }) {
  return this.http.get(`http://localhost:5000/api/${url}`, {
    headers: this.getHeaders(),
    params: params
  }).pipe(
    catchError((err) => this.handleError(err, options?.silent))
  );
}
  PUT(url: string, payload: any) {
    return this.http.put(`http://localhost:5000/api/${url}`,payload,{  headers: this.getHeaders()  }).pipe(
      catchError((err) => this.handleError(err, false, 'PUT'))
    )
  }

  DELETE(url: string) {
    return this.http.delete(`http://localhost:5000/api/${url}`,{  headers: this.getHeaders()  }).pipe(
      catchError((err) => this.handleError(err, false, 'DELETE'))
    )

  }
}
