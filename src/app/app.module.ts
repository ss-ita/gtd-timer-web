import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppMaterialModule} from '../app/app-material.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { TimerComponent } from './timer/timer.component';
import { AlarmComponent } from './alarm/alarm.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CompareValidatorDirective } from './compare-validator/compare-validator.directive';
import {MatDialogModule, MatDialog, MatDialogRef, MatSnackBarModule} from "@angular/material";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http'
import { CapslockDetectorDirective } from './capslock-detector/capslock-detector.directive';
import { ToasterService } from './services/toaster.service';
import { JwtModule } from '@auth0/angular-jwt';
import { TasksComponent } from './tasks/tasks.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ArchiveComponent } from './archive/archive.component';
import { SettingsComponent } from './settings/settings.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    NavBarComponent,
    TimerComponent,
    AlarmComponent,
    TaskManagementComponent,
    CompareValidatorDirective,
    CapslockDetectorDirective,
    CapslockDetectorDirective,
    TasksComponent,
    StopwatchComponent,
    StatisticsComponent,
    ArchiveComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RoundProgressModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDialogModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return     localStorage.getItem('access_token');},
        whitelistedDomains: [
          'http://localhost:4200',
          'https://localhost:44398'
      ],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [
    AuthGuardService,
    AuthService,
    MatDialog,
    { provide: MatDialogRef, useValue: {} }, 
    UserService,
    ToasterService
  ],
  bootstrap: [AppComponent],
  entryComponents: [SignupComponent]
})
export class AppModule { }
