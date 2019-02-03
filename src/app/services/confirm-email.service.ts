import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})

export class ConfirmEmailService {

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService) { }

  verifyEmailToken(id, emailToken): Observable<any> {
    return this.httpClient.get<any>(this.configService.urlUser + '/Verify/' + id.toString() + '/' + emailToken);
  }
}
