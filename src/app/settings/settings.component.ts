import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdatePasswordModel } from '../models/update-password.model';
import { compareValidator } from '../compare-validator/compare-validator.directive';
import { UserService } from '../services/user.service';
import { ToasterService } from '../services/toaster.service';
import { JwtService } from '../jwt.service';
import { MatDialog } from "@angular/material";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  hide:boolean;
  updatePasswordModel:UpdatePasswordModel=new UpdatePasswordModel();
  updatePasswordForm:FormGroup;
  deleteAccountForm:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private userService: UserService,
    private jwtservice: JwtService,
    private dialog: MatDialog
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
      this.updatePasswordForm.controls['passwordNew'].hasError('pattern') ? 'Combination of 8 or more uppercase, lowercase letters, special symbols and numbers.' :
        this.updatePasswordForm.controls['passwordNew'].hasError('minlength') ? 'You must enter 8 elements min' :
          '';
  }

  getErrorMessageConfirmPassword() {
    return this.updatePasswordForm.controls["passwordConfirm"].hasError('required') ? 'This field is required' :
      this.updatePasswordForm.controls["passwordConfirm"].hasError('compare') ? 'Passwords do not match' :
        '';
  }

  save() {
    this.userService.updatePassword(this.updatePasswordForm.value).subscribe(
      data => {
        this.updatePasswordForm.reset();
        this.toasterService.showToaster("Password changed!");
      },
      response => {
        this.toasterService.showToaster(response.error.Message)
      })
  }

  delete() {
    this.userService.deleteAccount().subscribe(
      data => {
        this.toasterService.showToaster("Account deleted! Redirecting to Sign In page...");
        setTimeout(() => {
          this.jwtservice.signout();
          window.location.reload();
        },
          2000);

      },
      httpErrorResponse => {
        this.toasterService.showToaster(httpErrorResponse.error.Message)
      })
  }

  openConfirmationDialog() {
    let confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    confirmationDialogRef.componentInstance.title = "Warning";
    confirmationDialogRef.componentInstance.message = "Are you sure to permanently delete your Account?";
    confirmationDialogRef.componentInstance.btnCancelText = "Cancel";
    confirmationDialogRef.componentInstance.btnOkText = "Confirm";
    confirmationDialogRef.componentInstance.acceptAction = () => { this.delete() };
  }
}
