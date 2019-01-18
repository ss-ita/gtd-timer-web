import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavbarService } from '../services/navbar.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private navbar: NavbarService) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      const token = localStorage.getItem('access_token');
      if (this.jwtHelper.isTokenExpired(token)) {
        this.navbarsubscribe();
      }
      this.router.navigate(['signin']);
      return false;
    }
    return true;
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
        label: 'Signin',
        link: './signin',
        index: 3
      }]);
    this.navbar.show.next(false);
  }

}
