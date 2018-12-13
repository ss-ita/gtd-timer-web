import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  getErrorMessageEmail() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }
  getErrorMessagePassword() {
    return this.password.hasError('required') ? 'You must enter your password' :
        this.password.hasError('minlength') ? 'You must enter 6 elements min' :
            '';
  }

  constructor(private router: Router ) { }

  ngOnInit() {
  }

 /* signin(event) 
  {
    const target=event.target
    const email=target.querySelector('#email').value
    const password=target.querySelector('#password').value
    event.preventDefault()
    this.Sign.getUserDetails(email,password)
    console.log(email,password)

  }*/
}
