import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { TimerService } from '../services/timer.service';
import { PresetDialogComponent } from '../preset-dialog/preset-dialog.component';
import { StyleService } from '../services/style.service';
import { PresetComponent } from '../preset/preset.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { TimerDialogComponent } from '../timer-dialog/timer-dialog.component';
import { MatDialog } from '@angular/material';
import { TasksService } from '../services/tasks.service';
import { TaskCreateJson } from '../models/taskCreateJson.model';

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
  hourPattern = /^(2[0-3]|1[0-9]|[0-9]|0)$/;
  minuteSecondPattern = /^([1-5]?[0-9]|0)$/;
  countOfCreatedTimers = 1;

  constructor(private formBuilder: FormBuilder,
    private presetComponent: PresetComponent,
    private service: PresetDialogComponent,
    private dialog: MatDialog,
    public styleService: StyleService,
    private taskService: TasksService,
    public timerServise: TimerService
  ) { }

  ngOnInit() {
    this.taskService.startConnection();
    this.taskService.addCreateTaskListener();
    this.presetComponent.isLoggedIn = this.presetComponent.getIsLoggedIn();
    this.timerForm = this.formBuilder.group({
      'hour': [this.timerServise.maxValueHour, [Validators.min(0), Validators.max(23), Validators.maxLength(2), Validators.pattern(this.hourPattern)]],
      'minute': [this.timerServise.maxValueMinute, [Validators.min(0), Validators.maxLength(2), Validators.max(59), Validators.pattern(this.minuteSecondPattern)]],
      'second': [this.timerServise.maxValueSecond, [Validators.min(0), Validators.maxLength(2), Validators.max(59), Validators.pattern(this.minuteSecondPattern)]]
    });
    this.presetComponent.getAllStandardAndCustomPresets();
    this.timerServise.getIsTimerArrayEmpty();
    this.isViewable = false;
    this.innerWidth = window.innerWidth;
  }

  createTask() {
    const taskToPass: TaskCreateJson = {
      id: 0,
      name: 'New timer' + ' ' + this.countOfCreatedTimers,
      description: '',
      elapsedTime: 0,
      goal: '',
      lastStartTime: '0001-01-01T00:00:00Z',
      isRunning: false,
      hour: 0,
      minutes: 0,
      seconds: 0,
      currentSecond: 0,
      isCollapsed: true,
      isShowed: true,
      isStoped: false,
      watchType: 1,
      maxValueHour: 0,
      maxValueMinute: 0,
      maxValueSecond: 0,
      isTimerFinished: false,
      goals: 0,
      ticksi: 0
    };
    if (this.timerServise.maxValueHour == null) {
      this.timerServise.maxValueHour = 0;
    }

    if (this.timerServise.maxValueMinute == null) {
      this.timerServise.maxValueMinute = 0;
    }

    if (this.timerServise.maxValueSecond == null) {
      this.timerServise.maxValueSecond = 0;
    }
    taskToPass.goal = this.timerServise.maxValueHour.toString() + ':' + this.timerServise.maxValueMinute.toString() + ':' + this.timerServise.maxValueSecond.toString();
    this.taskService.broadcastCreateTask(taskToPass);
    this.countOfCreatedTimers++;
    return this.taskService.createFromStopwatchPage = true;
  }

  getColor() {
    if (this.timerServise.taskJson) {
      if (this.timerServise.taskJson.isRunning) {
        return '#609b9b';
      } else {
        return '#c23a33';
      }
    } else {
      return 'black';
    }
  }

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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  getErrorMessageHour() {
    return 'Please, input an hour between 0 and 23';
  }

  getErrorMessageMinute() {
    return 'Please, input a minute between 0 and 59';
  }

  getErrorMessageSecond() {
    return 'Please, input a second between 0 and 59';
  }

  pauseTask() {
    this.taskService.pauseTimer(this.timerServise.taskJson);
  }

  startTask() {
    this.taskService.startTimer(this.timerServise.taskJson);
  }

  resetTask() {
    this.taskService.resetTimer(this.timerServise.taskJson);
  }

  addTaskFromTimer() {
    const timerFormDialogRef = this.dialog.open(TimerDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true
    });

    timerFormDialogRef.afterClosed().subscribe();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getIsLoggedIn() {
    return localStorage.getItem('access_token') === null ? false : true;
  }
}
