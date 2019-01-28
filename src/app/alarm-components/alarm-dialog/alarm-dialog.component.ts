import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AlarmService } from '../../services/alarm.service';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AlarmModel } from '../../models/alarm.model';
import { RepeatAlarmDialogComponent } from '../repeat-alarm-dialog/repeat-alarm-dialog.component';

@Component({
  selector: 'app-alarm-dialog',
  templateUrl: './alarm-dialog.component.html',
  styleUrls: ['./alarm-dialog.component.css']
})
export class AlarmDialogComponent implements OnInit {

  alarmForm: FormGroup;
  hourPattern = /^(2[0-3]|1[0-9]|[0-9]|0)$/;
  minutePattern = /^([1-5]?[0-9]|0)$/;
  hour = '';
  minute = '';
  isChecked = true;
  message = '';
  cronExpression = '';
  repeat = this.alarmService.repeatOptions[0];

  constructor(
    private alarmFormDialogRef: MatDialogRef<AlarmDialogComponent>,
    private formBuilder: FormBuilder,
    public alarmService: AlarmService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: any) { }

  ngOnInit() {
    if (this.data !== null) {
      this.substituteAlarmValue(this.data.model);
    }

    this.alarmForm = this.formBuilder.group({
      'hour': [this.hour, [Validators.required, Validators.min(0), Validators.max(23)]],
      'minute': [this.minute, [Validators.required, Validators.min(0), Validators.max(59)]],
      'repeatControl': [],
      'checked': [],
      'messageControl': []
    });
  }

  onClose() {
    this.alarmService.resetData();
    this.alarmFormDialogRef.close();
  }

  onSave() {
    const alarm = this.convertToAlarmModel();
    const timeOptions = this.convertTimeToDate();
    alarm.cronExpression = this.alarmService.convertToCronExpression(timeOptions, this.repeat);
    this.alarmService.chooseAlarmAction(alarm);
    this.alarmService.resetData();
    this.alarmFormDialogRef.close();
  }

  convertTimeToDate() {
    const hours = Number(this.hour);
    const minutes = Number(this.minute);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date;
  }

  convertToAlarmModel() {
    const alarm = new AlarmModel();
    alarm.isSound = this.isChecked;
    alarm.isTurnOn = true;
    alarm.isPlay = false;
    alarm.repeat = this.repeat;
    alarm.message = this.message;
    alarm.timeoutIndex = -1;
    this.data !== null ? alarm.id = this.data.model.id : alarm.id = -10;
    return alarm;
  }

  substituteAlarmValue(model: any) {
    this.hour = model.date.getHours();
    this.minute = model.date.getMinutes();
    this.isChecked = model.isSound;
    this.message = model.message;
    this.repeat = model.repeat;
  }

  customOptionRepeat() {
    const presetFormDialogRef = this.dialog.open(RepeatAlarmDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true
    });

    presetFormDialogRef.afterClosed().subscribe( _ => {
      this.repeat = this.alarmService.chosenDaysString;
    });
  }
}
