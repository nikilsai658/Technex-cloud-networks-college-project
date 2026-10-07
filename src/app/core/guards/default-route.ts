import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getStoredPermissions } from './permission-guard';

// Landing pages under /main, in the same order as the sidebar menu.
// The first one the user has permission for is where /main sends them.
// SuperAdmin goes first: that role also holds VIEW_STUDENT_DOMAIN, so it
// would otherwise land on the student page.
const LANDING_ROUTES: { path: string; permission: string }[] = [
  { path: 'superamin-colleges', permission: 'VIEW_SUPERADMIN_COLLEGES' },
  { path: 'student-domain', permission: 'VIEW_STUDENT_DOMAIN' },
  { path: 'ticket', permission: 'CREATE_TICKET' },
  { path: 'alltickets', permission: 'VIEW_ALL_TICKETS' },
  { path: 'college-management', permission: 'UPDATE_COLLEGE' },
  { path: 'department-management', permission: 'VIEW_DEPARTMENT' },
  { path: 'branch-management', permission: 'UPDATE_BRANCH' },
  { path: 'domain', permission: 'VIEW_DOMAIN' },
  { path: 'course', permission: 'VIEW_COURSE' },
  { path: 'role', permission: 'VIEW_ROLE' },
  { path: 'permission', permission: 'VIEW_PERMISSION' },
  { path: 'year', permission: 'VIEW_YEAR' },
  { path: 'year-updation', permission: 'UPDATE_YEAR' },
  { path: 'assignment', permission: 'UPDATE_ASSIGNMENT' },
  { path: 'college-department-mapping', permission: 'VIEW_COLLEGE_DEPARTMENT' },
  { path: 'department-branch-mapping', permission: 'VIEW_DEPARTMENT_BRANCH' },
  { path: 'domain-course-mapping', permission: 'VIEW_DOMAIN_COURSE_MAP' },
  { path: 'course-assignment-mapping', permission: 'VIEW_COURSE_ASSIGNMENT_MAP' },
  { path: 'student-domain-course-mapping', permission: 'VIEW_STUDENT_DOMAIN_COURSE_MAP' },
  { path: 'role-permission-mapping', permission: 'VIEW_ROLE_PERMISSION' },
  { path: 'student-assignment-scores', permission: 'UPDATE_STUDENT_ASSIGNMENT' },
];

// Used as redirectTo for the empty /main child route.
export function defaultMainRoute(): string {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return 'student-domain';
  }

  const codes = new Set(getStoredPermissions().map((p: any) => p.code));

  const match = LANDING_ROUTES.find(r => codes.has(r.permission));

  // Every user can reach their profile, so it's the safe fallback.
  return match?.path ?? 'profile';
}
