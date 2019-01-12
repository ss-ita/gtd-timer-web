import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title = 'Please confirm...';
  @Input() message = 'Do you really want to ... ?';
  @Input() btnOkText = 'OK';
  @Input() btnCancelText = 'Cancel';
  @Input() declineAction: Function;
  @Input() acceptAction: Function;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
  }

  decline() {
    if (this.declineAction !== undefined) {
      this.declineAction();
    }

    this.dialogRef.close();
  }

  accept() {
    if (this.acceptAction !== undefined) {
      this.acceptAction();
    }

    this.dialogRef.close();
  }
}
