import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupModel } from '../models/signup.model';
import { ConfigService } from './config.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient, private config: ConfigService ) { }

  registerUser(user: SignupModel){
    const body: SignupModel = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      passwordConfirm: user.passwordConfirm
    }

    return this.http.post(this.config.urlSignUp, body);
    
  }
}
