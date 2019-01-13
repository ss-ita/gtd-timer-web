import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PresetComponent } from '../preset/preset.component';

@Component({
  selector: 'app-preset-dialog',
  templateUrl: './preset-dialog.component.html',
  styleUrls: ['./preset-dialog.component.css']
})
export class PresetDialogComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openPresetForm() {
      const presetFormDialogRef = this.dialog.open(PresetComponent, {
          hasBackdrop: true,
          closeOnNavigation: true,
          disableClose: true
      });

      presetFormDialogRef.afterClosed().subscribe(
          message => console.log('Dialog output:', message)
      );
  }

}
