import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, public jwtHelper: JwtHelperService) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['signin']);
      return false;
    }
    return true;
  }

  cantActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['stopwatch']);
      return true;
    }
    return false;
  }
}
