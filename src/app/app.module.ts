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
import { AlarmComponent } from './alarm/alarm.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompareValidatorDirective } from './compare-validator/compare-validator.directive';
import { MatDialogModule, MatDialog, MatDialogRef, MatSnackBarModule, MatSidenavModule, MatExpansionModule } from '@angular/material';
import { MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatRadioModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from './services/user.service';
import { HttpClientModule } from '@angular/common/http';
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
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { RoundProgressComponent } from './round-progress/round-progress.component';
import { LineProgressComponent } from './line-progress/line-progress.component';
import { AuthGuardFalse } from './auth/auth-guard-false.service';
import { InfoComponent } from './info/info.component';
import { PresetComponent } from './preset/preset.component';
import { TaskInfoComponent } from './task-info/task-info.component';
import { TaskInfoDialogComponent } from './task-info-dialog/task-info-dialog.component';
import { FilterPipe } from './filter.pipe';
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
    ArchiveComponent,
    SettingsComponent,
    RoundProgressComponent,
    LineProgressComponent,
    InfoComponent,
    SignupDialogComponent,
    TaskInfoDialogComponent,
    ProgressComponent,
    PresetComponent,
    TaskInfoDialogComponent,
    FilterPipe,
    ConfirmationDialogComponent,
    PresetDialogComponent,
    TaskInfoComponent
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
    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter,
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
    AuthGuardFalse,
    AuthService,
    MatDialog,
    { provide: MatDialogRef, useValue: {} },
    UserService,
    ToasterService,
    SocialAuthService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SignupComponent,
    TaskInfoComponent,
    ConfirmationDialogComponent,
    PresetComponent
  ]
})
export class AppModule { }

