// Access/refresh tokens live in localStorage, not cookies: browsers silently
// drop cookies over ~4KB, and the JWT embeds every permission code, so a
// SuperAdmin token (~6KB) never got stored and authGuard bounced to login.
const ACCESS_KEY = 'token';
const REFRESH_KEY = 'refresh';

function storage(): Storage | null {
  return typeof localStorage !== 'undefined' ? localStorage : null;
}

export const tokenStorage = {

  getAccess(): string {
    return storage()?.getItem(ACCESS_KEY) ?? '';
  },

  getRefresh(): string {
    return storage()?.getItem(REFRESH_KEY) ?? '';
  },

  set(access: string, refresh?: string): void {
    storage()?.setItem(ACCESS_KEY, access);
    if (refresh) {
      storage()?.setItem(REFRESH_KEY, refresh);
    }
  },

  clear(): void {
    storage()?.removeItem(ACCESS_KEY);
    storage()?.removeItem(REFRESH_KEY);
    // Expire tokens left in cookies by the old storage scheme.
    if (typeof document !== 'undefined') {
      document.cookie = `${ACCESS_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${REFRESH_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }

};
