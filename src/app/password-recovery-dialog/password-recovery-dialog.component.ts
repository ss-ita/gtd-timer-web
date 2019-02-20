import { PasswordRecoveryComponent } from '../password-recovery/password-recovery.component';
import { PasswordRecoveryService } from '../services/password-recovery.service';
import { ToasterService } from '../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-password-recovery-dialog',
  templateUrl: './password-recovery-dialog.component.html',
  styleUrls: ['./password-recovery-dialog.component.css']
})

export class PasswordRecoveryDialogComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private passwordRecoveryService: PasswordRecoveryService) { }

  verifyPasswordRecoveryToken() {
    const email = this.route.snapshot.paramMap.get('email');
    const token = this.route.snapshot.paramMap.get('token');
    this.passwordRecoveryService.email = email;
    this.passwordRecoveryService.verifyPasswordRecoveryToken(email, token).subscribe(_ => {
      this.openPasswordRecoveryForm();
    },
    response => {
      this.toasterService.showToaster(response.error.Message);
    });
  }

  openPasswordRecoveryForm() {
    const passwordRecoveryDialogRef = this.dialog.open(PasswordRecoveryComponent, {
        panelClass: 'custom-dialog-container',
        hasBackdrop: true,
        closeOnNavigation: true,
        disableClose: true
    });
    passwordRecoveryDialogRef.afterClosed().subscribe();
  }

  ngOnInit() {
    this.router.navigateByUrl('/signin');
    this.verifyPasswordRecoveryToken();
  }
}
