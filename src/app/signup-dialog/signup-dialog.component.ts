import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.css']
})
export class SignupDialogComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {

  }

  openSignUpForm() {
    this.dialog.open(SignupComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true
    });
  }
}
