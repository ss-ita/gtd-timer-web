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
    return this.email.hasError('required') ? 'This field is required' :
        this.email.hasError('email') ? 'Provided e-mail is invalid' :
            '';
  }
  getErrorMessagePassword() {
    return this.password.hasError('required') ? 'This field is required' :
        this.password.hasError('minlength') ? 'You must enter 6 elements min' :
            '';
  }

  constructor(private router: Router ) { }

  ngOnInit() {
  }

}
