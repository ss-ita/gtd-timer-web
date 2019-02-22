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

  countOfCreatedStopwatch = 1;

  constructor(public stopwatchService: StopwatchService,
    public styleService: StyleService,
    private dialog: MatDialog,
    private taskService: TasksService,
    private historyService: HistoryService
  ) {
  }

  ngOnInit() {
    if (this.getIsLoggedIn()) {
      this.taskService.startConnection();
      this.taskService.addCreateTaskListener();
      this.taskService.addUpdateTaskListener();
      this.taskService.updateFromStopwatchPageAction = (index, task) => {
        this.taskService.stopwatches[index].description = task.description;
        this.taskService.stopwatches[index].elapsedTime = task.elapsedTime;
        this.taskService.stopwatches[index].isRunning = task.isRunning;
        this.taskService.stopwatches[index].lastStartTime = task.lastStartTime;
        this.taskService.stopwatches[index].name = task.name;
        return this.taskService.updateFromStopwatchPage = false;
      };

      this.taskService.createFromStopwatchPageAction = (task) => {
        this.taskService.setStopwatchesPage(1);
        task.hour = 0;
        task.minutes = 0;
        task.seconds = 0;
        this.taskService.stopwatches.forEach(stopwatch => stopwatch.description = '');
        this.taskService.stopwatches.unshift(this.taskService.stopwatchToTaskCreateJson(task));
        this.taskService.stopwatches[0].description = this.stopwatchService.description;
        this.stopwatchService.taskJson = this.taskService.stopwatches[0];
        this.taskService.startStopwatch(this.taskService.stopwatches[0]);
        this.startTask();
        return this.taskService.createFromStopwatchPage = false;
      };
    }
  }

  createTask() {
    const taskToPass: TaskCreateJson = {
      id: 0,
      name: 'New stopwatch' + ' ' + this.countOfCreatedStopwatch,
      description: this.stopwatchService.description,
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
    this.countOfCreatedStopwatch++;
    return this.taskService.createFromStopwatchPage = true;
  }

  getColor() {
    if (this.stopwatchService.taskJson) {
      if (this.stopwatchService.taskJson.isRunning) {
        return '#609b9b';
      } else {
        return '#c23a33';
      }
    } else {
      return 'black';
    }
  }

  pauseTask() {
    this.taskService.updateFromStopwatchPage = true;
    this.stopwatchService.taskJson.description = this.stopwatchService.description;
    this.stopwatchService.taskJson.isRunning = false;
    this.stopwatchService.taskJson.isStoped = true;
    this.stopwatchService.taskJson.elapsedTime = this.stopwatchService.taskJson.currentSecond * 1000;
    this.taskService.broadcastPauseTask(this.stopwatchService.taskJson);
    this.taskService.broadcastUpdateTask(this.stopwatchService.taskJson);
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
    this.taskService.setStopwatchesPage(1);
  }

  clickOnWatch() {
    if(this.getIsLoggedIn())
    {
      this.createTask();
    } else {
      this.stopwatchService.clickOnStopWatch();
    }
  }
  startTask() {
    this.taskService.updateFromStopwatchPage = true;
    this.taskService.stopwatches.forEach(stopwatch => stopwatch.description = '');
    this.stopwatchService.taskJson.description = this.stopwatchService.description;
    this.taskService.stopwatches;
    this.stopwatchService.taskJson.isRunning = true;
    this.stopwatchService.taskJson.isStoped = false;

    if (!this.stopwatchService.taskJson.isStoped) {
      this.taskService.ticks = this.stopwatchService.taskJson.elapsedTime;
      this.stopwatchService.taskJson.currentSecond = this.stopwatchService.taskJson.elapsedTime / 1000;
    }

    this.stopwatchService.taskJson.lastStartTime = (new Date(Date.now())).toISOString().slice(0, -1);
    this.taskService.broadcastStartTask(this.stopwatchService.taskJson);
    this.taskService.broadcastUpdateTask(this.stopwatchService.taskJson);
    this.taskService.setStopwatchesPage(1);
  }

  resetTask() {
    this.taskService.resetStopwatch(this.stopwatchService.taskJson);
    this.taskService.setStopwatchesPage(1);
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
