import { Component, OnInit } from '@angular/core';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { ActivatedRoute} from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninModel } from '../models/signin.model'
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
    providers: [SignupDialogComponent]
})

export class SigninComponent implements OnInit {

    user: SigninModel = new SigninModel();
    signinform: FormGroup;
    returnUrl: string;
    submitted = false;
    error = '';

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private jwtservice: JwtService,
        private service: SignupDialogComponent,
        private userService: UserService
    ) { }

    openSignUpDialog() {
        this.service.openSignUpForm();
    }

    pwdPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.,\-_!])([a-zA-Z0-9 @#$%^&+=*.,\-_!]){8,}$/;
    ngOnInit() {
        this.signinform = this.formBuilder.group({
            'email': [this.user.email, [Validators.required, Validators.email]],
            'password': [this.user.password, [Validators.required, Validators.minLength(8), Validators.pattern(this.pwdPattern)]]
        });
        this.jwtservice.signout();
        this.returnUrl = this.route.snapshot.queryParams['stopwatch'] || '/';
    }

    getErrorMessageEmail() {
        return this.signinform.controls['email'].hasError('required') ? 'This field is required' :
            this.signinform.controls['email'].hasError('email') ? 'Provided e-mail is invalid' :
                '';
    }
    getErrorMessagePassword() {
        return this.signinform.controls['password'].hasError('required') ? 'This field is required' :
            this.signinform.controls['password'].hasError('pattern') ? 'Combination of 8 or more uppercase, lowercase letters, special symbols and numbers.' :
                this.signinform.controls['password'].hasError('minlength') ? 'You must enter 8 elements min' :
                    '';
    }

    get f() { return this.signinform.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.signinform.invalid) {
            return;
        }
        this.userService.signinuser(this.f.email.value, this.f.password.value);
    }

}

