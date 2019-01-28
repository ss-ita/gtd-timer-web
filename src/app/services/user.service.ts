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

@Injectable({
  providedIn: 'root'
})
export class UserService {

  redirectUrl = '/';

  constructor(private http: HttpClient,
    private config: ConfigService,
    private jwtservice: JwtService,
    private toasterService: ToasterService,
    private router: Router,
    private navbar: NavbarService,
    private zone: NgZone,
    private roleService: RoleService,
    private alarmService: AlarmService) { }

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
        index: 0
      }, {
        label: 'Alarm',
        link: './alarm',
        index: 1
      }, {
        label: 'Stopwatch',
        link: './stopwatch',
        index: 2
      }, {
        label: 'Tasks',
        link: './tasks',
        index: 3
      }, {
        label: 'Statistics',
        link: './statistics',
        index: 4
      }, {
        label: 'Archive',
        link: './archive',
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
}
