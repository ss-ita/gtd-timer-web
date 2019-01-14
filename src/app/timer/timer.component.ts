import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimerService } from '../services/timer.service';
import { PresetDialogComponent } from '../preset-dialog/preset-dialog.component';
import { StyleService } from '../services/style.service';
import { PresetComponent } from '../preset/preset.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  providers: [PresetDialogComponent, PresetComponent, SignupDialogComponent]
})

export class TimerComponent implements OnInit {

  timerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private presetComponent: PresetComponent,
    public timerServise: TimerService,
    private service: PresetDialogComponent,
    public styleService: StyleService
  ) { }

  openPresetFormDialog() {
    this.service.openPresetForm();
  }

  get getTimersArray() {
    return this.timerServise.timerArray;
  }

  get getTimerArrayIndex() {
    return this.timerServise.timerIndex;
  }

  ngOnInit() {
    this.presetComponent.isLoggedIn = this.presetComponent.getIsLoggedIn();
    this.timerForm = this.formBuilder.group({
      'hour': [this.timerServise.maxValueHour, [Validators.required, Validators.min(0), Validators.max(23)]],
      'minute': [this.timerServise.maxValueMinute, [Validators.required, Validators.min(0), Validators.max(59)]],
      'second': [this.timerServise.maxValueSecond, [Validators.required, Validators.min(0), Validators.max(59)]]
    });
    this.presetComponent.getAllStandardAndCustomPresets();
    this.timerServise.getIsTimerArrayEmpty();
  }

  getErrorMessageHour() {
    return 'please enter a number from 0 to 23';
  }

  getErrorMessageMinuteAndSecond() {
    return 'please enter a number from 0 to 59';
  }
}
