import { Component, OnInit, Inject } from '@angular/core';
import { AlarmService } from '../../services/alarm.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-alarm-dialog-notification',
  templateUrl: './alarm-dialog-notification.component.html',
  styleUrls: ['./alarm-dialog-notification.component.css']
})
export class AlarmDialogNotificationComponent implements OnInit {

  message = '';
  currentTime = new Date();

  constructor(
    private alarmFormDialogRef: MatDialogRef<AlarmDialogNotificationComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any) { }

  ngOnInit() {
      this.message = this.data.message;
  }

  onClose() {
    this.alarmFormDialogRef.close();
  }
}
