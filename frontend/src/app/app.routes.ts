import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ElectionsComponent } from './components/elections/elections.component';
import { AnomaliesComponent } from './components/anomalies/anomalies.component';
import { ReportsComponent } from './components/reports/reports.component';
import { DiscussionsComponent } from './components/discussions/discussions.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'elections', component: ElectionsComponent, canActivate: [AuthGuard] },
    { path: 'anomalies', component: AnomaliesComponent, canActivate: [AuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
    { path: 'discussions', component: DiscussionsComponent, canActivate: [AuthGuard] },
    { path: 'admin/users', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
    { path: 'admin/elections', component: AdminComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
    { path: '**', redirectTo: '/login' }
];
