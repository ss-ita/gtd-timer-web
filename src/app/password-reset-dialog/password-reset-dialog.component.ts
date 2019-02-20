import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: './password-reset-dialog.component.html',
  styleUrls: ['./password-reset-dialog.component.css']
})
export class PasswordResetDialogComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openPasswordResetForm() {
      const passwordResetDialogRef = this.dialog.open(PasswordResetComponent, {
          panelClass: 'custom-dialog-container',
          hasBackdrop: true,
          closeOnNavigation: true,
          disableClose: true
      });

      passwordResetDialogRef.afterClosed().subscribe();
  }

}
