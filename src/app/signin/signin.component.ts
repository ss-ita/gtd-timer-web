import { Component, OnInit, NgZone } from '@angular/core';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SigninModel } from '../models/signin.model';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';
import { SocialAuthService } from '../services/social-auth.service';
import { ConfigService } from '../services/config.service';
import { NavbarService } from '../services/navbar.service';
import { RoleService } from '../services/role.service';
import { PasswordResetDialogComponent } from '../password-reset-dialog/password-reset-dialog.component';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
    providers: [SignupDialogComponent, PasswordResetDialogComponent]
})

export class SigninComponent implements OnInit {

    hide: boolean;
    user: SigninModel = new SigninModel();
    signinform: FormGroup;
    returnUrl: string;
    submitted = false;
    error = '';
    urlFacebookPath = '';
    urlGooglePath = '';
    isActive = false;
    pwdPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.,\-_!])([a-zA-Z0-9 @#$%^&+=*.,\-_!]){8,}$/;

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private jwtservice: JwtService,
        private service: SignupDialogComponent,
        private userService: UserService,
        private socialAuth: SocialAuthService,
        private config: ConfigService,
        private roleService: RoleService,
        private passwordResetService: PasswordResetDialogComponent
    ) { }

    openSignUpDialog() {
        this.service.openSignUpForm();
    }

    openResetPasswordDialog() {
        this.passwordResetService.openPasswordResetForm();
    }

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

    get controlElements() { return this.signinform.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.signinform.invalid) {
            return;
        }
        this.userService.signinuser(this.controlElements.email.value, this.controlElements.password.value);
    }

    loginWithGoogle() {
        this.socialAuth.loginWithGoogle();
        this.isActive = true;
    }

    loginWithFacebook() {
        this.socialAuth.loginWithFacebook();
        this.isActive = true;
    }
}
