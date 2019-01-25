import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdatePasswordModel } from '../models/update-password.model';
import { compareValidator } from '../compare-validator/compare-validator.directive';
import { UserService } from '../services/user.service';
import { ToasterService } from '../services/toaster.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  hide: boolean;
  updatePasswordModel: UpdatePasswordModel = new UpdatePasswordModel();
  updatePasswordForm: FormGroup;
  deleteAccountForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private userService: UserService,
    private jwtservice: JwtService,
    private dialog: MatDialog,
    private router: Router,
    private navbar: NavbarService
  ) { }

  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.,\-_!])([a-zA-Z0-9 @#$%^&+=*.,\-_!]){8,}$/;
  ngOnInit() {
    this.updatePasswordForm = this.formBuilder.group({
      'passwordOld': [this.updatePasswordModel.passwordOld, [
        Validators.required
      ]],
      'passwordNew': [this.updatePasswordModel.passwordNew, [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]],
      'passwordConfirm': [this.updatePasswordModel.passwordConfirm, [
        Validators.required,
        compareValidator('passwordNew')
      ]]
    });
    this.deleteAccountForm = this.formBuilder.group({
      'email': [{ value: localStorage.getItem('email'), disabled: true }],
    });
  }

  getErrorMessagePasswordOld() {
    return this.updatePasswordForm.controls['passwordOld'].hasError('required') ? 'This field is required' : '';
  }

  getErrorMessagePasswordNew() {
    return this.updatePasswordForm.controls['passwordNew'].hasError('required') ? 'This field is required' :
      this.updatePasswordForm.controls['passwordNew'].hasError('pattern')
        ? 'Combination of 8 or more uppercase, lowercase letters, special symbols and numbers.' :
        this.updatePasswordForm.controls['passwordNew'].hasError('minlength') ? 'You must enter 8 elements min' :
          '';
  }

  getErrorMessageConfirmPassword() {
    return this.updatePasswordForm.controls['passwordConfirm'].hasError('required') ? 'This field is required' :
      this.updatePasswordForm.controls['passwordConfirm'].hasError('compare') ? 'Passwords do not match' :
        '';
  }

  save() {
    this.userService.updatePassword(this.updatePasswordForm.value).subscribe(
      _ => {
        this.updatePasswordForm.reset();
        this.toasterService.showToaster('Password changed!');
      },
      response => {
        this.toasterService.showToaster(response.error.Message);
      });
  }

  delete() {
    this.userService.deleteAccount().subscribe(
      _ => {
        this.toasterService.showToaster('Account deleted! Redirecting to Sign In page...');
        setTimeout(() => {
          this.jwtservice.signout();
          this.navbar.navLinks.next([
            {
              label: 'Timer',
              link: './timer',
              index: 0
            }, {
              label: 'Alarm',
              link: './alarm',
              index: 1
            }, {
              label: 'Stopwatch',
              link: './stopwatch',
              index: 2
            }, {
              label: 'Sign In',
              link: './signin',
              index: 3
            }
          ]);
          this.navbar.show.next(false);
          this.router.navigateByUrl('/signin');
        },
          2000);

      },
      httpErrorResponse => {
        this.toasterService.showToaster(httpErrorResponse.error.Message);
      });
  }

  openConfirmationDialog() {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    confirmationDialogRef.componentInstance.title = 'Warning';
    confirmationDialogRef.componentInstance.message = 'Are you sure to permanently delete your Account?';
    confirmationDialogRef.componentInstance.btnCancelText = 'Cancel';
    confirmationDialogRef.componentInstance.btnOkText = 'Confirm';
    confirmationDialogRef.componentInstance.acceptAction = () => {
      this.delete();
    };
  }
}
