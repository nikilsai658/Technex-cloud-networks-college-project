import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUser(): any {

    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  getPermissions(): any[] {

    const user = this.getUser();

    if (!user) {
      return [];
    }

    return user.data?.permissions || [];
  }

  hasPermission(permission: string): boolean {

    return this.getPermissions().some(
      (p: any) => p.code === permission
    );

  }

}