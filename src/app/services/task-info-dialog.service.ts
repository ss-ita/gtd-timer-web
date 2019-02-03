import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RecordInfoComponent } from '../record-info/record-info.component';
import { Record } from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class TaskInfoDialogService {

  constructor(private dialog: MatDialog) { }

  openSheet(record: Record) {
    const dialogRef = this.dialog.open(RecordInfoComponent, {
      hasBackdrop: true,
      closeOnNavigation: true
    });
    dialogRef.componentInstance.record = record;

  }
}
