import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class JwtService {
  constructor(private httpClient: HttpClient,
    private config: ConfigService) { }

  signin(email: string, password: string) {
    localStorage.setItem('email', email);

    return this.httpClient.post<{ access_token: string }>(this.config.urlLogIn, { email, password })
      .pipe(map(value => {
        localStorage.setItem('access_token', value.access_token);
      }));
  }

  signInWithEmail(email: string) {
    localStorage.setItem('email', email);
    return this.httpClient.get<{ access_token: string }>(this.config.urlLogIn + '/' + email)
      .pipe(map(value => {
        localStorage.setItem('access_token', value.access_token);
    }));
  }

  signout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  signinGoogle(AccessToken) {
    return this.httpClient.post<{ access_token: string }>(this.config.urlGoogleLogIn, { AccessToken })
      .pipe(map(value => {
        localStorage.setItem('access_token', value.access_token);
      }));
  }

  signinFacebook(AccessToken) {
    return this.httpClient.post<{ access_token: string }>(this.config.urlFacebookLogIn, { AccessToken })
      .pipe(map(value => {
        localStorage.setItem('access_token', value.access_token);
      }));
  }
}
