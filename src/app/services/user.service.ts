import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignupModel } from '../models/signup.model';
import { UpdatePasswordModel } from '../models/update-password.model';
import { ConfigService } from './config.service'
import { JwtService } from './jwt.service';
import { ToasterService } from './toaster.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private config: ConfigService,
    private jwtservice: JwtService,
    private toasterService: ToasterService, ) { }

  registerUser(user: SignupModel) {
    const body: SignupModel = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      passwordConfirm: user.passwordConfirm
    }

    return this.http.post(this.config.urlUser, body);

  }

  signinuser(email, password) {
    this.jwtservice.signin(email, password)
      .pipe(first())
      .subscribe(
        data => {
          window.location.reload();
          this.toasterService.showToaster("Successfuly signed in! ");
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
    }
    const headers = this.getHeaders();

    return this.http.put(this.config.urlUser, body, { headers: headers });
  }

  deleteAccount() {
    const headers = this.getHeaders();

    return this.http.delete(this.config.urlUser, { headers: headers });
  }

  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    return headers;
  }

  signinGoogle(accessTokenSocial) {
    this.jwtservice.signinGoogle(accessTokenSocial)
      .pipe(first())
      .subscribe(
        data => {
          window.location.reload();
        },
        response => {
          this.toasterService.showToaster(response.error.Message);
        });
  }

  signinFacebook(accessTokenSocial) {
    this.jwtservice.signinFacebook(accessTokenSocial)
      .pipe(first())
      .subscribe(
        data => {
          window.location.reload();
        },
        response => {
          this.toasterService.showToaster(response.error.Message);
        });
  }
}
