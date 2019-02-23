import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AlarmModel } from 'src/app/models/alarm.model';

@Component({
  selector: 'app-alarm-dialog-updating',
  templateUrl: './alarm-dialog-updating.component.html',
  styleUrls: ['./alarm-dialog-updating.component.css']
})
export class AlarmDialogUpdatingComponent implements OnInit {

  @Input() newAlarmModel: AlarmModel;
  @Input() editedAlarmModel: AlarmModel;

  isViewable = false;

  constructor(
    private alarmFormDialogRef: MatDialogRef<AlarmDialogUpdatingComponent>) { }

  ngOnInit() {
  }

  onClose() {
    this.alarmFormDialogRef.close({ data: 'newModel' });
  }

  toggle() {
    this.isViewable = !this.isViewable;
  }

  onSave() {
    this.alarmFormDialogRef.close({ data: 'editedModel' });
  }

  addSpace(str: string): string {
    if (str.includes(',')) {
      const daysArray = str.split(',');
      return daysArray.join(', ');
    } else {
    return str;
    }
  }
}
