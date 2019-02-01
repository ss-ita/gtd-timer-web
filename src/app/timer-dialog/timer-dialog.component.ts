import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { TasksService } from '../services/tasks.service';
import { TimerService } from '../services/timer.service';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-timer-dialog',
  templateUrl: './timer-dialog.component.html',
  styleUrls: ['./timer-dialog.component.css']
})
export class TimerDialogComponent implements OnInit {

  timerDialogForm: FormGroup;
  timerName = 'New timer';
  timerTag = 'None';

  constructor(
    private timerDialogRef: MatDialogRef<TimerDialogComponent>,
    private formBuilder: FormBuilder,
    public timerService: TimerService,
    private taskService: TasksService,
    private toasterService: ToasterService
  ) { }

  onSave() {
    let name: string;
    const milisecondPerSecond = 1000;

    if (this.timerTag === 'None') {
      name = this.timerName;
    } else {
      name = this.timerName + ' ' + '#' + this.timerTag;
    }
    const taskToPass: TaskCreateJson = {
      id: 0,
      name: name,
      description: '',
      elapsedTime: this.timerService.ticks * milisecondPerSecond,
      goal: this.timerService.maxValueHour.toString() + ':'
        + this.timerService.maxValueMinute.toString() + ':' + this.timerService.maxValueSecond.toString(),
      lastStartTime: '0001-01-01T00:00:00Z',
      isRunning: false,
      hour: this.timerService.hour,
      minutes: this.timerService.minute,
      seconds: this.timerService.second,
      currentSecond: this.timerService.ticks,
      isCollapsed: true,
      isStoped: true,
      watchType: 1,
      maxValueHour: this.timerService.maxValueHour,
      maxValueMinute: this.timerService.maxValueMinute,
      maxValueSecond: this.timerService.maxValueSecond,
      isTimerFinished: false,
      goals: 0,
      ticksi: 0
    };

    const myObserver = {
      next: task => {
        this.taskService.timers.unshift(task);
      },
      error: err => { },
      complete: () => { }
    };

    this.timerService.refreshTimer();
    this.taskService.createTask(taskToPass).subscribe(myObserver);
    this.toasterService.showToaster('Added to List');
    this.onClose();
  }

  onClose() {
    this.timerDialogRef.close();
  }

  getErrorMessageNameAndTag() {
    return 'You have typed too many characters or have not entered at least one';
  }

  ngOnInit() {
    this.timerDialogForm = this.formBuilder.group({
      'timerName': [this.timerName, [Validators.required, Validators.maxLength(35)]],
      'timerTag': [this.timerTag, [Validators.required, Validators.maxLength(35)]]
    });
  }

}
