import {Routes} from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {authGuard} from "./core/guards/auth.guard";
import {HomeComponent} from "./pages/home/home.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {notLoggedInGuard} from "./core/guards/not-logged-in.guard";

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [notLoggedInGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]}
];
