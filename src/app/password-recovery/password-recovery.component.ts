import { compareValidator } from '../compare-validator/compare-validator.directive';
import { PasswordRecoveryService } from '../services/password-recovery.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})

export class PasswordRecoveryComponent implements OnInit {

  hide: boolean;
  passwordRecoveryForm: FormGroup;
  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.,\-_!])([a-zA-Z0-9 @#$%^&+=*.,\-_!]){8,}$/;

  constructor(
    private passwordRecoveryFormDialogRef: MatDialogRef<PasswordRecoveryComponent>,
    private passwordRecoveryService: PasswordRecoveryService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder) { }

  closeRecoveryPasswordForm() {
    this.passwordRecoveryFormDialogRef.close();
  }

  getErrorMessagePassword() {
    return this.passwordRecoveryForm.controls['password'].hasError('required') ? 'This field is required' :
      this.passwordRecoveryForm.controls['password'].hasError('pattern')
        ? 'Combination of 8 or more uppercase, lowercase letters, special symbols and numbers.' : '';
  }

  getErrorMessageConfirmPassword() {
    return this.passwordRecoveryForm.controls['passwordConfirm'].hasError('required') ? 'This field is required' :
      this.passwordRecoveryForm.controls['passwordConfirm'].hasError('compare') ? 'Passwords do not match' : '';
  }

  onSubmit() {
    const password = this.passwordRecoveryForm.controls['password'].value;
    this.passwordRecoveryService.resetPassword(password).subscribe(_ => {
      this.closeRecoveryPasswordForm();
      this.toasterService.showToaster('Your password has been successfully reset');
    },
    response => {
      this.toasterService.showToaster(response.error.Message);
    });
  }

  ngOnInit() {
    this.passwordRecoveryForm = this.formBuilder.group({
      'password': ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      'passwordConfirm': ['', [Validators.required, compareValidator('password')]]
    });
  }

}
