import { Routes } from '@angular/router';
import { Dashboard } from '../app/features/dashboard/dashboard';
import { Home } from './features/home/home';
import { Admin } from './features/admin/admin';
import { Changepassword } from './features/changepassword/changepassword';
import { ProfilePage } from './features/profile-page/profile-page';

export const routes: Routes = [
    {
      path:'',redirectTo:'home',pathMatch:'full'
    },
    {
        path:'home',component:Home
    },
    {
        path:'auth',loadChildren:()=>import('../app/features/auth/auth-module').then(m =>m.AuthModule)
    },
    {
        path:'main',component:Admin
    },
    {
     path:'changepassword', component:Changepassword
    },
    {
        path:'profile', component:ProfilePage
    }
];
 