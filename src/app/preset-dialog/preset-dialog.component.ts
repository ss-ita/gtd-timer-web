import { Component, OnInit, Injectable } from '@angular/core';
import { MatDialog } from "@angular/material";
import { PresetComponent } from '../preset/preset.component';

@Component({
    selector: 'preset-dialog'
})

@Injectable()
export class PresetDialogComponent implements OnInit {

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {
    }

    openPresetForm() {
        let presetFormDialogRef = this.dialog.open(PresetComponent, {
            hasBackdrop: true,
            closeOnNavigation: true,
            disableClose: true
        });

        presetFormDialogRef.afterClosed().subscribe(
            message => console.log("Dialog output:", message)
        );
    }
}
