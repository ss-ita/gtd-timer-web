import { Component, OnInit, HostListener, Directive, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialog} from '@angular/material';
import { SignupModel } from '../models/signup.model';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { compareValidator } from '../compare-validator/compare-validator.directive';
import { UserService } from '../services/user.service';
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  
  user: SignupModel = new SignupModel();
  signUpForm: FormGroup;
  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.,\-_!])([a-zA-Z0-9 @#$%^&+=*.,\-_!]){8,}$/;
  constructor (
    private formBuilder: FormBuilder, 
    private signUpFormDialogRef: MatDialogRef<SignupComponent>,
    private userService: UserService,
    private toasterService: ToasterService,
    private router: Router
    ) {  }

  closeSignUpForm() {
    this.signUpFormDialogRef.close({ message: 'The dialog was closed!' });
  }


  onRegisterSubmit() {
    this.userService.registerUser(this.signUpForm.value)
      .subscribe(
        data => {
            this.closeSignUpForm();
            this.toasterService.showToaster("Registration successful! ");
            setTimeout(() => 
            {
              this.toasterService.showToaster("You can now Sign In!");
            },
            4000);
        },
        error => {
            this.toasterService.showToaster(error.error.Message)
        })
  }

  getErrorMessageEmail() {
    return this.signUpForm.controls["email"].hasError('required') ? 'This field is required' :
    this.signUpForm.controls["email"].hasError('email') ? 'Provided e-mail is invalid' :
            '';
  }
  getErrorMessageFirstName() {
    return this.signUpForm.controls["firstName"].hasError('required') ? 'This field is required' : '';
  }
  getErrorMessageLastName() {
    return this.signUpForm.controls["lastName"].hasError('required') ? 'This field is required' : '';
  }
  getErrorMessagePassword() {
    return this.signUpForm.controls["password"].hasError('required') ? 'This field is required' :
    this.signUpForm.controls["password"].hasError("pattern") ? 'Combination of 8 or more uppercase, lowercase letters, special symbols and numbers.' : 
          '';
  }
  getErrorMessageConfirmPassword() {
    return this.signUpForm.controls["passwordConfirm"].hasError('required') ? 'This field is required' :
    this.signUpForm.controls["passwordConfirm"].hasError('compare') ? 'Passwords do not match' :
          '';
  }

  onSubmit({ value, valid }: { value: SignupModel, valid: boolean }) {
    console.log(value, valid);
    this.closeSignUpForm();
  }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      'firstName': [this.user.firstName, [
        Validators.required
      ]],
      'lastName': [this.user.lastName, [
        Validators.required
      ]],
      'email': [this.user.email, [
        Validators.required,
        Validators.email
      ]],
      'password': [this.user.password, [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]],
      'passwordConfirm': [this.user.passwordConfirm, [
        Validators.required,
        compareValidator('password')
      ]]
    });
  }
}
