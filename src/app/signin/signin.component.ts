import { Component, OnInit } from '@angular/core';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninModel } from '../models/signin.model'
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';
import { SocialAuthService } from '../services/social-auth.service';
import { ConfigService } from '../services/config.service';


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
    submitted: boolean = false;
    error: string = '';
    urlFacebookPath: string = '';
    urlGooglePath: string = '';

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private jwtservice: JwtService,
        private service: SignupDialogComponent,
        private userService: UserService,
        private socialAuth: SocialAuthService,
        private config: ConfigService,
    ) { }

    openSignUpDialog() {
        this.service.openSignUpForm();
    }

    pwdPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.,\-_!])([a-zA-Z0-9 @#$%^&+=*.,\-_!]){8,}$/;
    ngOnInit() {
        this.signinform = this.formBuilder.group({
            'email': [this.user.email, [Validators.required, Validators.email]],
            'password': [this.user.password]
        });
        this.jwtservice.signout();
        this.returnUrl = this.route.snapshot.queryParams['stopwatch'] || '/';
        this.urlFacebookPath = this.config.urlFacebookIcon;
        this.urlGooglePath = this.config.urlGoogleIcon;
    }

    getErrorMessageEmail() {
        return this.signinform.controls['email'].hasError('required') ? 'This field is required' :
            this.signinform.controls['email'].hasError('email') ? 'Provided e-mail is invalid' :
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

    LoginWithGoogle() {
        this.socialAuth.loginWithGoogle();
    }

    doFacebookLogin() {
        this.socialAuth.loginWithFacebook();
    }

}

