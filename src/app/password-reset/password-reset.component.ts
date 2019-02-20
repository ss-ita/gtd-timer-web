import { PasswordRecoveryService } from '../services/password-recovery.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasterService } from '../services/toaster.service';
import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  passwordResetForm: FormGroup;

  constructor(
    private passwordResetFormDialogRef: MatDialogRef<PasswordResetComponent>,
    private passwordRecoveryService: PasswordRecoveryService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder) { }

  closeResetPasswordForm() {
    this.passwordResetFormDialogRef.close();
  }

  onSubmit() {
    const email = this.passwordResetForm.controls['email'].value;
    this.passwordRecoveryService.resetPasswordSendEmail(email).subscribe(_ => {
      this.closeResetPasswordForm();
      this.toasterService.showToaster('We have sent you an email with instructions');
    },
    response => {
      this.toasterService.showToaster(response.error.Message);
    });
  }

  getErrorMessageEmail() {
    return this.passwordResetForm.controls['email'].hasError('required') ? 'This field is required' :
      this.passwordResetForm.controls['email'].hasError('email') ? 'Provided e-mail is invalid' : '';
  }

  ngOnInit() {
    this.passwordResetForm = this.formBuilder.group({
      'email': ['', [ Validators.required, Validators.email]] });
  }
}
