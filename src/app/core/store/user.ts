import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {

  accessToken: string;
  refreshToken: string;

  userId: string;
  name: string;
  email: string;
  role: string;

  isFirstLogin: boolean;
  profileCompleted: boolean;

  permissions: any[];

  collegeId: number;
  collegeName: string;

  departmentId: number;
  departmentName: string;

  branchId: number;
  branchName: string;

  yearId: number;
  yearNumber: number;

  semester: number;

}

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  private _user = signal<User | null>(null);

  user = this._user.asReadonly();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this._user.set(JSON.parse(stored));
      }
    }
  }

  setUser(user: User) {
    this._user.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  clearUser() {
    this._user.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

}