import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
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
  isViewable: boolean;
  innerWidth: any;

  constructor(private formBuilder: FormBuilder,
    private presetComponent: PresetComponent,
    public timerServise: TimerService,
    private service: PresetDialogComponent,
    public styleService: StyleService
  ) { }

  openPresetFormDialog() {
    this.service.openPresetForm();
  }
  toggle() {
    this.isViewable = !this.isViewable;
  }

  get getTimersArray() {
    return this.timerServise.timerArray;
  }

  get getTimerArrayIndex() {
    return this.timerServise.timerIndex;
  }

  hourRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && (isNaN(control.value) || control.value < 0 || control.value >= 24)) {
      return { 'hourRange': true };
    }
    return null;
  }

  minuteAndSecondRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && (isNaN(control.value) || control.value < 0 || control.value >= 60)) {
      return { 'minuteAndSecond': true };
    }
    return null;
  }

  ngOnInit() {
    this.presetComponent.isLoggedIn = this.presetComponent.getIsLoggedIn();
    this.timerForm = this.formBuilder.group({
      'hour': [this.timerServise.maxValueHour, [this.hourRangeValidator]],
      'minute': [this.timerServise.maxValueMinute, [this.minuteAndSecondRangeValidator]],
      'second': [this.timerServise.maxValueSecond, [this.minuteAndSecondRangeValidator]]
    });
    this.presetComponent.getAllStandardAndCustomPresets();
    this.timerServise.getIsTimerArrayEmpty();
    this.isViewable = false;
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  getErrorMessageHour() {
    return 'please enter a number from 0 to 23';
  }

  getErrorMessageMinuteAndSecond() {
    return 'please enter a number from 0 to 59';
  }
}
