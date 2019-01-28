import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlarmService } from 'src/app/services/alarm.service';

@Component({
  selector: 'app-repeat-alarm-dialog',
  templateUrl: './repeat-alarm-dialog.component.html',
  styleUrls: ['./repeat-alarm-dialog.component.css']
})
export class RepeatAlarmDialogComponent implements OnInit {

  chosenDaysList: boolean[];
  check = true;
  alarmForm: FormGroup;

  constructor(
    private alarmFormDialogRef: MatDialogRef<RepeatAlarmDialogComponent>,
    private formBuilder: FormBuilder,
    public alarmService: AlarmService) { }

  ngOnInit() {
    this.alarmForm = this.formBuilder.group({
      'chosenDay0': [],
      'chosenDay1': [],
      'chosenDay2': [],
      'chosenDay3': [],
      'chosenDay4': [],
      'chosenDay5': [],
      'chosenDay6': [],
      'chosenDay7': []
    });
    this.chosenDaysList = this.alarmService.chosenDaysList.slice();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onClose() {
    this.alarmFormDialogRef.close();
  }

  onSave() {
    this.alarmService.chosenDaysList = this.chosenDaysList.slice();
    this.alarmService.convertDaysToString();
    this.alarmFormDialogRef.close();
  }

  isChecheDay() {
    return !this.chosenDaysList.includes(true);
  }
}
