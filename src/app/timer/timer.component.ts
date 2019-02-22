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
    public timerService: TimerService
  ) { }

  ngOnInit() {
    this.taskService.startConnection();
    this.taskService.addCreateTaskListener();
    this.taskService.addUpdateTaskListener();

    this.taskService.updateFromTimerPageAction = (index, task) => {
      this.taskService.timers[index].description = task.description;
      this.taskService.timers[index].elapsedTime = task.elapsedTime;
      this.taskService.timers[index].isRunning = task.isRunning;
      this.taskService.timers[index].lastStartTime = task.lastStartTime;
      this.taskService.timers[index].name = task.name;
      this.taskService.timers[index].goal = task.goal;
      return this.taskService.updateFromTimerPage = false;
    };

    this.taskService.createFromTimerPageAction = (task) => {
      this.taskService.setTimersPage(1);
      task.goal = this.timerService.taskJson.maxValueHour.toString() + ':' + this.timerService.taskJson.maxValueMinute.toString() + ':' + this.timerService.taskJson.maxValueSecond.toString();
      this.taskService.timers.forEach(timer => timer.description = '');
      this.taskService.timers.unshift(this.taskService.timerToTaskCreateJson(task));
      this.taskService.timers[0].description = this.timerService.description;
      this.timerService.taskJson = this.taskService.timers[0];
      this.taskService.startTimer(this.taskService.timers[0]);
      this.startTask();
      return this.taskService.createFromTimerPage = false;
    };


    this.presetComponent.isLoggedIn = this.presetComponent.getIsLoggedIn();
    this.timerForm = this.formBuilder.group({
      'hour': [this.timerService.maxValueHour, [Validators.min(0), Validators.max(23), Validators.maxLength(2), Validators.pattern(this.hourPattern)]],
      'minute': [this.timerService.maxValueMinute, [Validators.min(0), Validators.maxLength(2), Validators.max(59), Validators.pattern(this.minuteSecondPattern)]],
      'second': [this.timerService.maxValueSecond, [Validators.min(0), Validators.maxLength(2), Validators.max(59), Validators.pattern(this.minuteSecondPattern)]]
    });
    this.presetComponent.getAllStandardAndCustomPresets();
    this.timerService.getIsTimerArrayEmpty();
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
    if (this.timerService.taskJson.maxValueHour == null) {
      this.timerService.taskJson.maxValueHour = 0;
    }

    if (this.timerService.taskJson.maxValueMinute == null) {
      this.timerService.taskJson.maxValueMinute = 0;
    }

    if (this.timerService.taskJson.maxValueSecond == null) {
      this.timerService.taskJson.maxValueSecond = 0;
    }
    taskToPass.goal = this.timerService.taskJson.maxValueHour.toString() + ':' + this.timerService.taskJson.maxValueMinute.toString() + ':' + this.timerService.taskJson.maxValueSecond.toString();
    this.taskService.broadcastCreateTask(taskToPass);
    this.countOfCreatedTimers++;
    return this.taskService.createFromTimerPage = true;
  }

  getColor() {
    if (this.timerService.taskJson) {
      if (this.timerService.taskJson.isRunning) {
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
    return this.timerService.timerArray;
  }

  get getTimerArrayIndex() {
    return this.timerService.timerIndex;
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
    this.taskService.updateFromTimerPage = true;
    this.taskService.timers.forEach(timer => timer.description = '');
    this.timerService.taskJson.description = this.timerService.description;
    this.taskService.pauseTimer(this.timerService.taskJson);
    this.taskService.broadcastUpdateTask(this.timerService.taskJson);
    this.taskService.setTimersPage(1);
  }

  startTask() {
    this.taskService.updateFromTimerPage = true;
    this.taskService.timers.forEach(timer => timer.description = '');
    this.timerService.taskJson.description = this.timerService.description;
    if (this.timerService.taskJson.goals != ((this.timerService.taskJson.maxValueHour * this.taskService.secondPerHour) + (this.timerService.taskJson.maxValueMinute * this.taskService.secondPerMinute)
            + (this.timerService.taskJson.maxValueSecond * this.taskService.secondPerSecond))) {
            this.taskService.resetTimer(this.timerService.taskJson);
            this.timerService.taskJson.goals = ((this.timerService.taskJson.maxValueHour * this.taskService.secondPerHour) + (this.timerService.taskJson.maxValueMinute * this.taskService.secondPerMinute)
                + (this.timerService.taskJson.maxValueSecond * this.taskService.secondPerSecond));
                this.timerService.taskJson.elapsedTime = this.timerService.taskJson.goals;
            this.taskService.startTimer(this.timerService.taskJson);
        } else {
            this.taskService.startTimeTimer(this.timerService.taskJson);
            this.timerService.taskJson.lastStartTime = (new Date(Date.now())).toISOString().slice(0, -1);
            this.taskService.broadcastStartTask(this.timerService.taskJson);
        }
    this.taskService.startTimer(this.timerService.taskJson);
    this.taskService.broadcastUpdateTask(this.timerService.taskJson);
    this.taskService.setTimersPage(1);
  }

  resetTask() {
    this.taskService.resetTimer(this.timerService.taskJson);
    this.taskService.broadcastUpdateTask(this.timerService.taskJson);
    this.taskService.setTimersPage(1);
  }

  changeTitle() {
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
