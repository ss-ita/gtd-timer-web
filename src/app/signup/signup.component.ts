import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog} from '@angular/material';
import { SignupModel } from '../models/signup.model';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { compareValidator } from '../compare-validator.directive';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  signUpFormDialogRef: MatDialogRef<SignupComponent>;
  user: SignupModel = new SignupModel();
  signUpForm: FormGroup;
  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.,\-_!])([a-zA-Z0-9 @#$%^&+=*.,\-_!]){8,}$/;
  constructor(private dialog: MatDialog, private formBuilder: FormBuilder) { }

  openSignUpForm() {
    this.signUpFormDialogRef = this.dialog.open(SignupComponent, {
      hasBackdrop: true,
      closeOnNavigation: true
    });
  }

  getErrorMessageEmail() {
    return this.signUpForm.controls["Email"].hasError('required') ? 'This field is required' :
    this.signUpForm.controls["Email"].hasError('email') ? 'Provided e-mail is invalid' :
            '';
  }
  getErrorMessageFirstName() {
    return this.signUpForm.controls["FirstName"].hasError('required') ? 'This field is required' : '';
  }
  getErrorMessageLastName() {
    return this.signUpForm.controls["LastName"].hasError('required') ? 'This field is required' : '';
  }
  getErrorMessagePassword() {
    return this.signUpForm.controls["Password"].hasError('required') ? 'This field is required' :
    this.signUpForm.controls["Password"].hasError("pattern") ? 'Combination of 8 or more uppercase, lowercase letters, special symbols and numbers.' : 
          '';
  }
  getErrorMessageConfirmPassword() {
    return this.signUpForm.controls["ConfirmPassword"].hasError('required') ? 'This field is required' :
    this.signUpForm.controls["ConfirmPassword"].hasError('compare') ? 'Passwords do not match' :
          '';
  }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      'FirstName': [this.user.FirstName, [
        Validators.required
      ]],
      'LastName': [this.user.LastName, [
        Validators.required
      ]],
      'Email': [this.user.Email, [
        Validators.required,
        Validators.email
      ]],
      'Password': [this.user.Password, [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]],
      'ConfirmPassword': [this.user.ConfirmPassword, [
        Validators.required,
        compareValidator('Password')
      ]]
    });
  }
}



