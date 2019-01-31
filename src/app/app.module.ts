import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../app/app-material.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { TimerComponent } from './timer/timer.component';
import { AlarmComponent } from './alarm-components/alarm/alarm.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompareValidatorDirective } from './compare-validator/compare-validator.directive';
import { MatDialogModule, MatDialog, MatDialogRef, MatSnackBarModule } from '@angular/material';
import { MatSidenavModule, MatExpansionModule, MatNativeDateModule } from '@angular/material';
import { MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatRadioModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from './services/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CapslockDetectorDirective } from './capslock-detector/capslock-detector.directive';
import { ToasterService } from './services/toaster.service';
import { JwtModule } from '@auth0/angular-jwt';
import { TasksComponent } from './tasks/tasks.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { RoundProgressComponent } from './round-progress/round-progress.component';
import { LineProgressComponent } from './line-progress/line-progress.component';
import { AuthGuardFalse } from './auth/auth-guard-false.service';
import { InfoComponent } from './info/info.component';
import { PresetComponent } from './preset/preset.component';
import { RecordInfoComponent } from './record-info/record-info.component';
import { FilterPipe } from './filter.pipe';
import { FilterEmailPipe } from './filter-email.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { SocialAuthService } from './services/social-auth.service';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { ProgressComponent } from './progress/progress.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { PresetDialogComponent } from './preset-dialog/preset-dialog.component';
import { AlarmDialogComponent } from './alarm-components/alarm-dialog/alarm-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { RepeatAlarmDialogComponent } from './alarm-components/repeat-alarm-dialog/repeat-alarm-dialog.component';
import { AlarmDialogNotificationComponent } from './alarm-components/alarm-dialog-notification/alarm-dialog-notification.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { RoleService } from './services/role.service';
import { HttpTokenInterceptor } from './services/http-interceptor.service';
import { StopwatchDialogComponent } from './stopwatch-dialog/stopwatch-dialog.component';

export function jwtTokenGetter() {
  return localStorage.getItem('access_token');
}
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
    TasksComponent,
    StopwatchComponent,
    StatisticsComponent,
    HistoryComponent,
    SettingsComponent,
    RoundProgressComponent,
    LineProgressComponent,
    InfoComponent,
    SignupDialogComponent,
    ProgressComponent,
    PresetComponent,
    FilterPipe,
    FilterEmailPipe,
    ConfirmationDialogComponent,
    PresetDialogComponent,
    RecordInfoComponent,
    AlarmDialogComponent,
    AlarmDialogNotificationComponent,
    RepeatAlarmDialogComponent,
    AlarmDialogNotificationComponent,
    AdminPageComponent,
    StopwatchDialogComponent
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
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatSidenavModule,
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter,
        whitelistedDomains: [
          'http://localhost:4200',
          'https://localhost:44398'
        ],
        blacklistedRoutes: []
      }
    }),

  ],
  providers: [
    AuthGuardService,
    AuthGuardFalse,
    AuthService,
    MatDialog,
    MatDatepickerModule,
    { provide: MatDialogRef, useValue: {} },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    UserService,
    ToasterService,
    SocialAuthService,
    RoleService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SignupComponent,
    RecordInfoComponent,
    ConfirmationDialogComponent,
    PresetComponent,
    AlarmDialogComponent,
    AlarmDialogNotificationComponent,
    RepeatAlarmDialogComponent,
    StopwatchDialogComponent
  ]
})
export class AppModule { }


