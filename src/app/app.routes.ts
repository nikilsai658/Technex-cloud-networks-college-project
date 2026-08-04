import { Routes } from '@angular/router';
import { Dashboard } from '../app/features/dashboard/dashboard';
import { Home } from './features/home/home';
import { Admin } from './features/admin/admin';
import { Changepassword } from './features/changepassword/changepassword';
import { ProfilePage } from './features/profile-page/profile-page';
import { StudentDomain } from './shared/components/student-domain/student-domain';
import { StudentCourses } from './shared/components/student-courses/student-courses';
import { StudentAssignments } from './shared/components/student-assignments/student-assignments';
import { StudentAssignment } from './shared/components/student-assignment/student-assignment';
import { Department } from './shared/components/department/department';
import { Branch } from './shared/components/branch/branch';
import { DomainComponent } from './shared/components/domain/domain';
import { Course } from './shared/components/course/course';
import { Year } from './shared/components/year/year';
import { UserComponent } from './shared/components/user/user';
import { RolePermissionComponent } from './shared/components/rolepermission/rolepermission';
import { Permission } from './shared/components/permissions/permissions';
import { AssignmentComponent } from './shared/components/assignment/assignment';
import {  StudentProfile } from './shared/components/student-profile/student-profile';
import { College } from './shared/components/college/college';
import { Leadership } from './shared/components/leadership/leadership';
import { Certificate } from './shared/components/certificate/certificate';
import { FAQ } from './shared/components/faq/faq';
import { Helpandsupport } from './shared/components/helpandsupport/helpandsupport';
import { Role } from './shared/components/role/role';

export const routes: Routes = [

  {
    path: '',redirectTo: 'home',pathMatch: 'full'
  },

  {
    path: 'home',component: Home
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-module')
        .then(m => m.AuthModule)
  },

  {
    path: 'main',component: Admin,children: [

      {
        path: '',redirectTo: 'student-domain', pathMatch: 'full'
      },
      {
        path: 'student-domain', component: StudentDomain
      },

      {
        path: 'student-courses',component: StudentCourses
      },

      {
        path: 'student-assignments', component: StudentAssignments
      },
  
      {
        path: 'student-assignment',  component: StudentAssignment
      },
      {
        path:'college-management',component:College
      },
      {
        path:'department-management',component:Department
      },
      {
        path:'branch-management',component:Branch
      },
      {
        path:'domain',component:DomainComponent
      },
      {
        path:'course',component:Course
      },
      {
        path:'assignment',component:AssignmentComponent
      },
      {
        path:'year',component:Year
      },
      {
        path:'user',component:UserComponent
      },
      {
        path:'role',component:Role
      },
      {
        path:'permission',component:Permission
      },
      {
        path:'profile',component:StudentProfile
      },
      {
       path:'leadership',component:Leadership
      },
      {
        path:'certificate',component:Certificate
      },
      {
         path:'faq',component:FAQ
      },
      {
        path:'helpandsupport',component:Helpandsupport
      }
    ]
  },

  {
    path: 'changepassword', component: Changepassword
  },

  {
    path: 'profile', component: ProfilePage
  },

  // Optional 404 route
  {
    path: '**',
    redirectTo: 'home'
  }

];
 