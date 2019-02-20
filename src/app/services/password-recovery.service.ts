import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PasswordRecoveryService {

  email: string;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService) { }

  resetPasswordSendEmail(email: string): Observable<any> {
    return this.httpClient.get<any>(this.configService.urlUser + '/SendPasswordRecoveryEmail' + '/' + email);
  }

  resetPassword(password) {
    return this.httpClient.get<any>(this.configService.urlUser + '/ResetPassword' + '/' + this.email + '/' + password);
  }

  verifyPasswordRecoveryToken(email, recoveryToken) {
    return this.httpClient.get<any>(this.configService.urlUser + '/VerifyPasswordRecoveryToken' + '/' + email + '/' + recoveryToken);
  }
}
