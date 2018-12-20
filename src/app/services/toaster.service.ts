import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class ToasterService {

    constructor(private snackBar: MatSnackBar) {
    }

    showToaster(msg: string) {
        this.snackBar.open(msg, null, {
            duration: 3000,
            panelClass: ['custom-snackbar']
        });
    }
}

