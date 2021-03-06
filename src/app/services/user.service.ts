import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignupModel } from '../models/signup.model';
import { UpdatePasswordModel } from '../models/update-password.model';
import { ConfigService } from './config.service';
import { JwtService } from './jwt.service';
import { ToasterService } from './toaster.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavbarService } from './navbar.service';
import { RoleService } from './role.service';
import { AlarmService } from './alarm.service';
import { ConfirmEmailService } from './confirm-email.service';
import { PasswordRecoveryService } from './password-recovery.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  redirectUrl = '/';
  confirmEmailErrorMessage = 'Token has expired , resend verification email?';

  constructor(private http: HttpClient,
    private config: ConfigService,
    private jwtservice: JwtService,
    private toasterService: ToasterService,
    private router: Router,
    private navbar: NavbarService,
    private zone: NgZone,
    private roleService: RoleService,
    private alarmService: AlarmService,
    private confirmEmailService: ConfirmEmailService,
    private passwordRecoveryService: PasswordRecoveryService) { }

  registerUser(user: SignupModel) {
    const body: SignupModel = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      passwordConfirm: user.passwordConfirm
    };
    return this.http.post(this.config.urlUser, body);
  }

  navbarsubscribe() {
    this.navbar.navLinks.next([
      {
        label: 'Timer',
        link: './timer',
        icon: 'fa-clock fa-lg',
        index: 0
      }, {
        label: 'Alarm',
        link: './alarm',
        icon: 'fa-bell fa-lg',
        index: 1
      }, {
        label: 'Stopwatch',
        link: './stopwatch',
        icon: 'fa-stopwatch fa-lg',
        index: 2
      }, {
        label: 'List',
        link: './list',
        icon: 'fa-tasks fa-lg',
        index: 3
      }, {
        label: 'Statistics',
        link: './statistics',
        icon: 'fa-chart-pie fa-lg',
        index: 4
      }, {
        label: 'History',
        link: './history',
        icon: 'fa-history fa-lg',
        index: 5
      }]);
    this.navbar.show.next(true);
    this.navbar.email.next(localStorage.getItem('email'));
  }

  signinuser(email, password) {
    this.jwtservice.signin(email, password)
      .pipe(first())
      .subscribe(
        _ => {
          this.navbarsubscribe();
          this.router.navigateByUrl(this.redirectUrl);
          this.toasterService.showToaster('Successfuly signed in! ');
          this.roleService.getRoles();
          this.alarmService.loadAlarmsFromDatabase();
        },
        response => {
          this.toasterService.showToaster(response.error.Message);
        });
  }

  updatePassword(user: UpdatePasswordModel) {
    const body: UpdatePasswordModel = {
      passwordOld: user.passwordOld,
      passwordNew: user.passwordNew,
      passwordConfirm: user.passwordConfirm
    };

    return this.http.put(this.config.urlUser, body);
  }

  deleteAccount() {
    return this.http.delete(this.config.urlUser);
  }

  signinGoogle(accessTokenSocial) {
    this.jwtservice.signinGoogle(accessTokenSocial)
      .pipe(first())
      .subscribe(
        _ => {
          this.zone.run(() => {
            this.navbarsubscribe();
            this.router.navigateByUrl(this.redirectUrl);
            this.toasterService.showToaster('Successfuly signed in with Google! ');
            this.roleService.getRoles();
            this.alarmService.loadAlarmsFromDatabase();
          });
        },
        response => {
          this.toasterService.showToaster(response.error.Message);
        });
  }

  signinFacebook(accessTokenSocial) {
    this.jwtservice.signinFacebook(accessTokenSocial)
      .pipe(first())
      .subscribe(
        _ => {
          this.zone.run(() => {
            this.navbarsubscribe();
            this.router.navigateByUrl(this.redirectUrl);
            this.toasterService.showToaster('Successfuly signed in with Facebook! ');
            this.roleService.getRoles();
            this.alarmService.loadAlarmsFromDatabase();
          });
        },
        response => {
          this.toasterService.showToaster(response.error.Message);
        });
  }

  verifyEmail(email, token) {
    this.confirmEmailService.verifyEmailToken(email, token).subscribe(_ => {
        this.router.navigateByUrl(this.redirectUrl);
        this.toasterService.showToaster('Your email address has been confirmed');
      },
      response => {
        if (response.error.Message === this.confirmEmailErrorMessage) {
          const result = confirm('Token has expired! Resend verification email?');
          if (result) {
            this.resendVerificationEmail(email);
          }
        } else {
          this.toasterService.showToaster(response.error.Message);
        }
    });
  }

  resendVerificationEmail(email) {
    this.confirmEmailService.resendVerificationEmail(email).subscribe(_ => {
      this.router.navigateByUrl(this.redirectUrl);
      this.toasterService.showToaster('We have sent you a verification email');
    },
    response => {
      this.toasterService.showToaster(response.error.Message);
    });
  }

  signInWithEmail(email) {
    this.jwtservice.signInWithEmail(email)
      .pipe(first())
      .subscribe(
        _ => {
          this.navbarsubscribe();
          this.router.navigateByUrl(this.redirectUrl);
          this.roleService.getRoles();
          this.alarmService.loadAlarmsFromDatabase();
        },
        response => {
          this.toasterService.showToaster(response.error.Message);
        });
  }
}
