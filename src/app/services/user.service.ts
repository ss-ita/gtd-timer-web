import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupModel } from '../models/signup.model';
import { ConfigService } from './config.service'
import { JwtService } from './jwt.service';
import { ToasterService } from './toaster.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient, 
    private config: ConfigService,
    private jwtservice: JwtService,
        private toasterService: ToasterService, ) { }

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
  signinuser(email,password){
    this.jwtservice.signin(email,password)
            .pipe(first())
            .subscribe(
                data => {
                    window.location.reload();
                    this.toasterService.showToaster("Successfuly signed in! ");
                },
                error => {
                    this.toasterService.showToaster(error.error.error);
                });
  }
}
