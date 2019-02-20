import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../services/stopwatch.service';
import { StyleService } from '../services/style.service';
import { StopwatchDialogComponent } from '../stopwatch-dialog/stopwatch-dialog.component';
import { MatDialog } from '@angular/material';
import { TasksComponent } from '../tasks/tasks.component';
import { TasksService } from '../services/tasks.service';
import { Record } from '../models/record.model';
import { HistoryService } from '../services/history.service';
import { TaskCreateJson } from '../models/taskCreateJson.model';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css'],
  providers: [TasksComponent]
})

export class StopwatchComponent implements OnInit {

  constructor(public stopwatchService: StopwatchService,
    public styleService: StyleService,
    private dialog: MatDialog,
    private taskService: TasksService,
    private historyService: HistoryService
  ) { }

  ngOnInit() {
    this.taskService.startConnection();
    this.taskService.addCreateTaskListener();
    this.taskService.createStopwatchAction = (task) => {
      this.taskService.addStopwatchListener(task);
      this.stopwatchService.taskJson = this.taskService.stopwatches[0];
      this.taskService.startStopwatch(this.taskService.stopwatches[0]);
      this.stopwatchService.isCreate = true;
    };
  }

  createTask() {
    const taskToPass: TaskCreateJson = {
      id: 0,
      name: '',
      description: '',
      elapsedTime: 0,
      goal: '',
      lastStartTime: '0001-01-01T00:00:00Z',
      isRunning: false,
      hour: 0,
      minutes: 0,
      seconds: 0,
      currentSecond: 0,
      isShowed: true,
      isCollapsed: true,
      isStoped: false,
      watchType: 0,
      maxValueHour: 0,
      maxValueMinute: 0,
      maxValueSecond: 0,
      isTimerFinished: false,
      goals: 0,
      ticksi: 0
    };
    this.taskService.broadcastCreateTask(taskToPass);
    this.stopwatchService.taskJson = taskToPass;
  }

  getColor() {
    if (this.stopwatchService.taskJson) {
      if (this.stopwatchService.taskJson.isRunning) {
        return '#609b9b';
      } else {
        return '#c23a33';
      }
    } else {
      return 'grey';
    }
  }

  pauseTask() {
    this.stopwatchService.taskJson.isRunning = false;
    this.stopwatchService.taskJson.isStoped = true;
    this.stopwatchService.taskJson.elapsedTime = this.stopwatchService.taskJson.currentSecond * 1000;
    this.taskService.broadcastPauseTask(this.stopwatchService.taskJson);
    const timeStart = new Date(this.stopwatchService.taskJson.lastStartTime);
    const timeNow = new Date(new Date(Date.now()).toISOString().slice(0, -1));
    const stop = (new Date(Date.now())).toISOString().slice(0, -1);
    const recordToCreate: Record = {
      id: 0,
      name: this.stopwatchService.taskJson.name,
      description: this.stopwatchService.taskJson.description,
      startTime: this.stopwatchService.taskJson.lastStartTime,
      stopTime: stop,
      elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * this.taskService.milisecondPerHour +
        (timeNow.getMinutes() - timeStart.getMinutes()) * this.taskService.milisecondPerMinute +
        (timeNow.getSeconds() - timeStart.getSeconds()) * this.taskService.milisecondPerSecond + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
      watchType: this.stopwatchService.taskJson.watchType,
      action: 'Pause',
      taskId: this.stopwatchService.taskJson.id,
      userId: 0
    };
    this.historyService.createRecord(recordToCreate).subscribe();
    this.stopwatchService.isStopwatchPause = true;
    this.stopwatchService.color = '#c23a33';
  }

  startTask() {
    this.taskService.stopwatches;
    this.stopwatchService.taskJson.isRunning = true;
    this.stopwatchService.taskJson.isStoped = false;

    if (!this.stopwatchService.taskJson.isStoped) {
      this.taskService.ticks = this.stopwatchService.taskJson.elapsedTime;
      this.stopwatchService.taskJson.currentSecond = this.stopwatchService.taskJson.elapsedTime / 1000;
    }

    this.stopwatchService.taskJson.lastStartTime = (new Date(Date.now())).toISOString().slice(0, -1);
    this.taskService.broadcastStartTask(this.stopwatchService.taskJson);
    this.stopwatchService.color = '#609b9b';
    this.stopwatchService.isStopwatchPause = false;
    this.stopwatchService.isStopwatchRun = true;
  }

  resetTask() {
    this.taskService.resetStopwatch(this.stopwatchService.taskJson);
    this.stopwatchService.isStopwatchRun = false;
    this.stopwatchService.isStopwatchPause = true;
    this.stopwatchService.color = 'black';
  }

  clickOnStopWatch() {
    if (this.stopwatchService.taskJson.isStoped || (this.stopwatchService.taskJson.isStoped === false && this.stopwatchService.taskJson.isRunning === false)) {
      this.startTask();
    } else {
      this.pauseTask();
    }
  }

  getIsLoggedIn() {
    return localStorage.getItem('access_token') === null ? false : true;
  }

  changeTitle() {
    const stopwatchFormDialogRef = this.dialog.open(StopwatchDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true
    });

    stopwatchFormDialogRef.afterClosed().subscribe();
  }
}
