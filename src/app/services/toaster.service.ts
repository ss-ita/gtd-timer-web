import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ConfigService } from './config.service';

@Injectable()
export class ToasterService {

    constructor(private snackBar: MatSnackBar, private config: ConfigService) {
    }

    showToaster(msg: string) {
        this.snackBar.open(msg, null, {
            duration: this.config.delay,
            panelClass: ['custom-snackbar']
        });
    }
}

