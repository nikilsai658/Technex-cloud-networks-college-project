import { Injectable } from '@angular/core';
import { UserStore } from '../store/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private userStore: UserStore) {}

  getUser() {

    return this.userStore.user();

  }

  getPermissions(): any[] {

    return this.userStore.user()?.permissions ?? [];

  }

  hasPermission(permission: string): boolean {

    return this.getPermissions().some(
      p => p.code === permission
    );

  }

}