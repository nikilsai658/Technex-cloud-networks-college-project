import { tokenStorage } from '../../../core/auth/token-storage';
import { Component, OnInit, computed, effect } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/auth';
import { UserStore } from '../../../core/store/user';
import { AuthServices } from '../../../features/services/auth/auth-services';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  username:string|undefined='';
colleges = [
  {
    name: 'Jain University',
    key: 'jain',
    logo: 'assets/images/jain-logo.png'
  },
  {
    name: 'Hindustan College of Engineering',
    key: 'hindusthan',
    logo: 'assets/images/Hindusthan_college.png'
  },
  {
    name: 'RVS COLLEGE OF ENGINEERING',
    key: 'rvs',
    logo: 'assets/images/Rvs_college.png'
  },
  {
    name: 'CMS COLLEGE OF SCIENCE & COMMERCE',
    key: 'cms',
    logo: 'assets/images/CMS_college.png'
  }
];

  constructor(private router:Router,private cookie:CookieService,public auth:Auth,private userStore:UserStore,private api:AuthServices) {
    effect(() => {
      const user = this.userStore.user();

      if (!user) {
        return;
      }

      this.username = user.name;
    });
  }

  // computed signal so the template re-renders in zoneless mode when the user changes
  collegeLogo = computed(() => {
    const user = this.userStore.user();
    const storedCollege = typeof localStorage !== 'undefined' ? localStorage.getItem('college') : null;
    const target = this.normalize(user?.collegeName || storedCollege || '');

    if (!target) {
      return '';
    }

    const selectedCollege = this.colleges.find(college => {
      const name = this.normalize(college.name);
      return name === target || target.includes(name) || name.includes(target)
        || target.includes(college.key);
    });

    return selectedCollege?.logo ?? '';
  });

  private normalize(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
  logout(){
    // Clear the local session even if the server call fails, otherwise the
    // previous user's token/permissions leak into the next login.
    const endSession = () => {
      this.userStore.clearUser();
      tokenStorage.clear();
      this.router.navigate(['/auth/login']);
    };
    this.api.logoutAll({}).subscribe({
      next:()=>endSession(),
      error:(err:any)=>{
      console.log(err);
      endSession();
      }
    })
    
  }

  ngOnInit(): void {}
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  managementOpen = false;

  toggleManagement() {
    this.managementOpen = !this.managementOpen;
  }

  managementLinks = [
    { permission: 'UPDATE_COLLEGE', route: '/main/college-management', label: 'College Management' },
    { permission: 'VIEW_DEPARTMENT', route: '/main/department-management', label: 'Department Management' },
    { permission: 'VIEW_BRANCH', route: '/main/branch-management', label: 'Branch Management' },
    { permission: 'VIEW_DOMAIN', route: '/main/domain', label: 'Domain Management' },
    { permission: 'VIEW_COURSE', route: '/main/course', label: 'Course Management' },
    { permission: 'VIEW_USER', route: '/main/user', label: 'User Management' },
    { permission: 'VIEW_ROLE', route: '/main/role', label: 'Role Management' },
    { permission: 'VIEW_PERMISSION', route: '/main/permission', label: 'Permission Management' },
    { permission: 'VIEW_YEAR', route: '/main/year', label: 'Year Management' },
    { permission: 'UPDATE_YEAR', route: '/main/year-updation', label: 'Year Promotion' },
    { permission: 'VIEW_ASSIGNMENT', route: '/main/assignment', label: 'Assignment Management' },
  ];

  get visibleManagementLinks() {
    return this.managementLinks.filter(link => this.auth.hasPermission(link.permission));
  }

  mappingOpen = false;

  toggleMapping() {
    this.mappingOpen = !this.mappingOpen;
  }

  mappingLinks = [
    { permission: 'VIEW_COLLEGE_DEPARTMENT', route: '/main/college-department-mapping', label: 'College Department Mapping' },
    { permission: 'VIEW_DEPARTMENT_BRANCH', route: '/main/department-branch-mapping', label: 'Department Branch Mapping' },
    { permission: 'VIEW_DOMAIN_COURSE_MAP', route: '/main/domain-course-mapping', label: 'Domain Course Mapping' },
    { permission: 'VIEW_COURSE_ASSIGNMENT_MAP', route: '/main/course-assignment-mapping', label: 'Course Assignment Mapping' },
    { permission: 'VIEW_STUDENT_DOMAIN_COURSE_MAP', route: '/main/student-domain-course-mapping', label: 'Student Domain Course Mapping' },
    { permission: 'VIEW_ROLE_PERMISSION', route: '/main/role-permission-mapping', label: 'Role Permission Mapping' },
  ];

  get visibleMappingLinks() {
    return this.mappingLinks.filter(link => this.auth.hasPermission(link.permission));
  }
}
