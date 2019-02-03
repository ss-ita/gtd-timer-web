import { Component, OnInit, Input } from '@angular/core';
import { Record } from '../models/record.model';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-record-info',
  templateUrl: './record-info.component.html',
  styleUrls: ['./record-info.component.css']
})
export class RecordInfoComponent implements OnInit {

  record: Record;

  constructor(public dialogRef: MatDialogRef<RecordInfoComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
