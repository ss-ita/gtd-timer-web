import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NavbarService } from '../services/navbar.service';
import { RoleService } from '../services/role.service';
import { ToasterService } from '../services/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {
  constructor(public auth: AuthService,
    public router: Router,
    public jwtHelper: JwtHelperService,
    private navbar: NavbarService,
    private roleService: RoleService,
    private toasterService: ToasterService) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated() || !this.roleService.isAdmin) {
      this.toasterService.showToaster('Sorry you are not admin... So you can not go to this page');
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
