import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {SigninComponent} from './signin/signin.component';
import { TimerComponent } from './timer/timer.component';
import { AlarmComponent } from './alarm/alarm.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { TasksComponent } from './tasks/tasks.component';
import { 
  AuthGuardService as AuthGuard 
} from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/stopwatch', pathMatch: 'full' },
  { path: 'stopwatch', component:  HomeComponent},
  { path: 'timer', component:  TimerComponent},
  { path: 'alarm', component:  AlarmComponent},
  { path: 'tasks', component:  TasksComponent, canActivate:[AuthGuard]},
  { path: 'signin', component:  SigninComponent},
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
