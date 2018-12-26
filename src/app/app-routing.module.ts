import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {SigninComponent} from './signin/signin.component';
import { TimerComponent } from './timer/timer.component';
import { AlarmComponent } from './alarm/alarm.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { TasksComponent } from './tasks/tasks.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component'
import { 
  AuthGuardService as AuthGuard 
} from './auth/auth-guard.service';
import { StatisticsComponent } from './statistics/statistics.component';
import { ArchiveComponent } from './archive/archive.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuardFalse } from './auth/auth-guard-false.service';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  { path: '', redirectTo: '/stopwatch', pathMatch: 'full' },
  { path: 'stopwatch', component:  StopwatchComponent},
  { path: 'timer', component:  TimerComponent},
  { path: 'alarm', component:  AlarmComponent},
  { path: 'tasks', component:  TasksComponent, canActivate:[AuthGuard]},
  { path: 'statistics', component:  StatisticsComponent, canActivate:[AuthGuard]},
  { path: 'sett', component:  SettingsComponent, canActivate:[AuthGuard]},
  { path: 'archive', component:  ArchiveComponent, canActivate:[AuthGuard]},
  { path: 'info', component:  InfoComponent, canActivate:[AuthGuard]},
  { path: 'signin', component:  SigninComponent,canActivate:[AuthGuardFalse]},
  { path: 'task-management', component: TaskManagementComponent}
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
