import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ToasterService } from '../services/toaster.service';
import { JwtService } from '../jwt.service';
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title: string = 'Please confirm...';
  @Input() message: string = 'Do you really want to ... ?';
  @Input() btnOkText: string = 'OK';
  @Input() btnCancelText: string = 'Cancel';
  @Input() declineAction: Function;
  @Input() acceptAction: Function;

  constructor(
    private toasterService: ToasterService,
    private userService: UserService,
    private jwtservice: JwtService,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

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
