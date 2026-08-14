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
import { Permission } from './shared/components/permissions/permissions';
import { AssignmentComponent } from './shared/components/assignment/assignment';
import {  StudentProfile } from './shared/components/student-profile/student-profile';
import { College } from './shared/components/college/college';
import { Leadership } from './shared/components/leadership/leadership';
import { Certificate } from './shared/components/certificate/certificate';
import { Role } from './shared/components/role/role';
import { TicketComponent } from './shared/components/ticket/ticket';
import { MyTicketComponent } from './shared/components/mytickets/mytickets';
import { ReplyTicketComponent } from './shared/components/replyticket/replyticket';
import { AllTicketsComponent } from './shared/components/alltickets/alltickets';
import { SupportTicketDetailsComponent } from './shared/components/support-ticket-details/support-ticket-details';
import { CollegeDepartmentComponent } from './shared/components/collegedepartment/collegedepartment';
import { DepartmentBranchComponent } from './shared/components/departmentbranch/departmentbranch';
import { DomainCourseMapComponent } from './shared/components/domaincourse/domaincourse';
import { CourseAssignmentMapComponent } from './shared/components/courseassignment/courseassignment';
import { RolePermissionComponent } from './shared/components/rolepermission/rolepermission';
import { StudentAssignment as StudentAssignmentscore } from './shared/components/studentassignment/studentassignment';
import { StudentDomainMapComponent } from './shared/components/studentdomaincourse/studentdomaincourse';
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
        path:'ticket',component:TicketComponent
      },
      {
      path:'mytickets',component:MyTicketComponent
      },
      {
        path:'replyticket/:id',component:ReplyTicketComponent
      },
      {
        path:'alltickets',component:AllTicketsComponent
      },
      {
        path: 'support-ticket-details/:id',component: SupportTicketDetailsComponent
      },
      {
        path:'college-department-mapping',component:CollegeDepartmentComponent
      },
      {
        path:'department-branch-mapping',component:DepartmentBranchComponent
      },
      {
        path:'domain-course-mapping',component:DomainCourseMapComponent
      },
      {
        path:'course-assignment-mapping',component:CourseAssignmentMapComponent
      },
      {
        path:'student-domain-course-mapping',component:StudentDomainMapComponent
      },
      {
        path:'role-permission-mapping',component:RolePermissionComponent
      },
      {
        path:'student-assignment-scores',component:StudentAssignmentscore
      }
    ]
  },

  {
    path: 'changepassword', component: Changepassword
  },

  {
    path: 'profile', component: ProfilePage
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
 