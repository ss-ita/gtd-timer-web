import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { TasksService } from '../services/tasks.service';
import { StopwatchService } from '../services/stopwatch.service';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-stopwatch-dialog',
  templateUrl: './stopwatch-dialog.component.html',
  styleUrls: ['./stopwatch-dialog.component.css']
})
export class StopwatchDialogComponent implements OnInit {

  stopwatchDialogForm: FormGroup;
  stopwatchName = 'New stopwatch';
  stopwatchTag = 'None';

  constructor(
    private stopwatchDialogRef: MatDialogRef<StopwatchDialogComponent>,
    private formBuilder: FormBuilder,
    public stopwatchService: StopwatchService,
    private taskService: TasksService,
    private toasterService: ToasterService
  ) { }

  onSave() {
    let name: string;
    const milisecondPerSecond = 1000;

    if (this.stopwatchTag === 'None') {
      name = this.stopwatchName;
    } else {
      name = this.stopwatchName + ' ' + '#' + this.stopwatchTag;
    }

    const taskToPass: TaskCreateJson = {
      id: 0,
      name: name,
      description: '',
      elapsedTime: this.stopwatchService.ticks * milisecondPerSecond,
      goal: '',
      lastStartTime: '0001-01-01T00:00:00Z',
      isRunning: false,
      hour: this.stopwatchService.hour,
      minutes: this.stopwatchService.minute,
      seconds: this.stopwatchService.second,
      currentSecond: this.stopwatchService.ticks,
      isStoped: true,
      isCollapsed: true,
      isShowed: true,
      watchType: 0,
      maxValueHour: 0,
      maxValueMinute: 0,
      maxValueSecond: 0,
      isTimerFinished: false,
      goals: 0,
      ticksi: this.stopwatchService.ticks
    };

    const myObserver = {
      next: _ => { },
      error: _ => { },
      complete: () => {
        this.taskService.getStopwatches().subscribe();
      },
    };

    this.stopwatchService.reset();
    this.taskService.createTask(taskToPass).subscribe(myObserver);
    this.taskService.stopwatches.unshift(taskToPass);
    this.toasterService.showToaster('Added to List');
    this.onClose();
  }

  onClose() {
    this.stopwatchDialogRef.close();
  }

  getErrorMessageNameAndTag() {
    return 'You have typed too many characters or have not entered at least one';
  }

  ngOnInit() {
    this.stopwatchDialogForm = this.formBuilder.group({
      'stopwatchName': [this.stopwatchName, [Validators.required, Validators.maxLength(35)]],
      'stopwatchTag': [this.stopwatchTag, [Validators.required, Validators.maxLength(35)]]
    });
  }

}
