import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { TimerComponent } from './timer/timer.component';
import { AlarmComponent } from './alarm-components/alarm/alarm.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { TasksComponent } from './tasks/tasks.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import {
  AuthGuardService as AuthGuard
} from './auth/auth-guard.service';
import { StatisticsComponent } from './statistics/statistics.component';
import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuardFalse } from './auth/auth-guard-false.service';
import { InfoComponent } from './info/info.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AuthAdminService } from './auth/auth-admin.service';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { PasswordRecoveryDialogComponent } from './password-recovery-dialog/password-recovery-dialog.component';

const routes: Routes = [
  { path: '', redirectTo: '/stopwatch', pathMatch: 'full' },
  { path: 'confirm-email/:email/:token', component: ConfirmEmailComponent },
  { path: 'password-recovery/:email/:token', component: PasswordRecoveryDialogComponent},
  { path: 'stopwatch', component: StopwatchComponent },
  { path: 'timer', component: TimerComponent },
  { path: 'alarm', component: AlarmComponent },
  { path: 'list', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'info', component: InfoComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SigninComponent, canActivate: [AuthGuardFalse] },
  { path: 'task-management', component: TaskManagementComponent },
  { path: 'admin', component: AdminPageComponent,  canActivate: [AuthAdminService] }
];

export const appRouting = RouterModule.forRoot(routes);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
