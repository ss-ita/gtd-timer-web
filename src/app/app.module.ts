import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppMaterialModule} from '../app/app-material.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { TimerComponent } from './timer/timer.component';
import { AlarmComponent } from './alarm/alarm.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { TaskManagementComponent } from './task-management/task-management.component';
import { CompareValidatorDirective } from './compare-validator.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    SigninComponent,
    NavBarComponent,
    TimerComponent,
    AlarmComponent,
    TaskManagementComponent,
    CompareValidatorDirective
  ],
  imports: [
    BrowserModule,
    AppMaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SignupComponent]
})
export class AppModule { }
