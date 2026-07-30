import { Injectable, signal } from '@angular/core';

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

  setUser(user: User) {
    this._user.set(user);
  }

  clearUser() {
    this._user.set(null);
  }

}