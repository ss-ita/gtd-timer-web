import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {FormBuilder,FormGroup, Validators} from '@angular/forms';
import {SigninModel} from '../models/signin.model'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,private router: Router ) { }

    user:SigninModel=new SigninModel()
   signinform:FormGroup

   pwdPattern = /^.*(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*]).*$/;

  ngOnInit() {
    this.signinform = this.formBuilder.group({
      'email': [this.user.Email, [Validators.required, Validators.email]],
      'password': [this.user.Password, [Validators.required, Validators.minLength(8),Validators.pattern(this.pwdPattern)]]
  });
  }

  getErrorMessageEmail() {
    return this.signinform.controls['email'].hasError('required') ? 'This field is required' :
        this.signinform.controls['email'].hasError('email') ? 'Provided e-mail is invalid' :
            '';
  }
  getErrorMessagePassword() {
    return this.signinform.controls['password'].hasError('required') ? 'This field is required' :
    this.signinform.controls['password'].hasError('pattern') ? 'Combination of 8 or more uppercase, lowercase letters, special symbols and numbers.':
        this.signinform.controls['password'].hasError('minlength') ? 'You must enter 8 elements min' :
            '';
  }
}
