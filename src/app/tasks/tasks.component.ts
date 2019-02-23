import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { TasksService } from '../services/tasks.service';
import { ConfigService } from '../services/config.service';
import { StopwatchService } from '../services/stopwatch.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksService],


})

export class TasksComponent implements OnInit {
  constructor(
    public taskService: TasksService,
    public stopwatchService: StopwatchService,
    public timerService: TimerService,
    private configService: ConfigService,
    private matDialog: MatDialog
  ) { }

  readonly progress: Observable<number>;
  public searchText: string;
  displayStopwatch = true;
  displayTimer = false;
  milisecondPerSecond = 1000;
  secondPerHour = 3600;
  secondPerMinute = 60;
  secondPerSecond = 1;
  description = '';
  public pageSizes: any = [
    { "id": 5, "value": 5 },
    { "id": 10, "value": 10 },
    { "id": 25, "value": 25 },
    { "id": "Display all", "value": Number.MAX_VALUE }
  ];
  taskToPass: TaskCreateJson = {
    id: 0,
    name: 'New Stopwatch',
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
    watchType: 0,
    maxValueHour: 0,
    maxValueMinute: 0,
    maxValueSecond: 0,
    isTimerFinished: false,
    goals: 0,
    ticksi: 0
  };

  displayStopwatches() {
    this.displayStopwatch = true;
    this.displayTimer = false;
  }

  displayTimers() {
    this.displayStopwatch = false;
    this.displayTimer = true;
  }

  refreshStopwatchesPage() {
    if (this.taskService.pagedStopwatches.length > 1) {
      this.taskService.setStopwatchesPage(this.taskService.stopwatchPager.currentPage);
    } else {
      this.taskService.setStopwatchesPage(this.taskService.stopwatchPager.currentPage - 1);
    }
  }

  refreshTimersPage() {
    if (this.taskService.pagedTimers.length > 1) {
      this.taskService.setTimersPage(this.taskService.timerPager.currentPage);
    } else {
      this.taskService.setTimersPage(this.taskService.timerPager.currentPage - 1);
    }
  }

  toggleCollapsed(task: TaskCreateJson) {
    task.isCollapsed = !task.isCollapsed;
  }
  inputShowed(task: TaskCreateJson) {
    task.isShowed = !task.isShowed;
  }
  fillTime(task) {
    task.currentSecond = task.elapsedTime / this.milisecondPerSecond;
    task.hour = Math.floor(task.currentSecond / this.secondPerHour);
    task.minutes = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) / this.secondPerMinute);
    task.seconds = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) % this.secondPerMinute);
    return task;
  }

  fillTimeAll(list) {
    for (const task of list) {
      this.fillTime(task);
    }
    return list;
  }


  ngOnInit() {
    this.taskService.addCreateTaskListener();
    this.taskService.addStartTaskListener();
    this.taskService.addPauseTaskListener();
    this.taskService.addDeleteTaskListener();
    this.taskService.addUpdateTaskListener();
    this.taskService.addResetTaskListener();
    this.taskService.startStopwatchAction = (task) => {
      this.taskService.start(task);
    };
    this.taskService.startTimerAction = (task, data) => {
      this.taskService.startTimerListener(task, data);
    }
    this.taskService.pauseTimerAction = (task, data) => {
      this.taskService.pauseTimerListener(task, data);
    }
    this.taskService.pauseStopwatchAction = (task, data) => {
      this.taskService.pauseStopwatchListener(task, data);
    };
    this.taskService.resetStopwatchAction = (task) => {
      this.taskService.resetStopwatchListener(task);
    };
    this.taskService.createStopwatchAction = (task) => {
      this.taskService.addStopwatchListener(task);
    };
    this.taskService.resetTimerAction = (task) => {
      this.taskService.resetTimerListener(task);
    };
    this.taskService.createTimerAction = (task) => {
      this.taskService.addTimerListener(task);

    };
    this.taskService.deleteStopwatchAction = (index) => {
      this.deleteStopwatchListener(index);
    };
    this.taskService.deleteTimerAction = (index) => {
      this.deleteTimerListener(index);
    };
    this.taskService.updateStopwatchAction = (index, task) => {
      this.taskService.updateStopwatchListener(index, task);
    };
    this.taskService.updateTimerAction = (index, task) => {
      this.taskService.updateTimerListener(index, task);
    };
  }

  filterByProperty(propertyName: string) {
    this.taskService.stopwatches = this.taskService.stopwatches.sort((a, b) => {
      switch (propertyName) {
        case 'name': return this.compare(a.name, b.name);
      }
    });
  }

  compare(a: String, b: String) {
    return (a.toLowerCase() < b.toLowerCase() ? -1 : 1);
  }

  onDeleteTask(task: TaskCreateJson) {
    const warningDialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    warningDialogRef.componentInstance.title = 'Confirmation';
    warningDialogRef.componentInstance.message = 'Are you sure to delete this stopwatch?';
    warningDialogRef.componentInstance.btnCancelText = 'Cancel';
    warningDialogRef.componentInstance.btnOkText = 'Confirm';
    warningDialogRef.componentInstance.acceptAction = () => {
      this.deleteTask(task);
    };
  }

  onDeleteTimer(task: TaskCreateJson) {
    const warningDialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    warningDialogRef.componentInstance.title = 'Confirmation';
    warningDialogRef.componentInstance.message = 'Are you sure to delete this timer?';
    warningDialogRef.componentInstance.btnCancelText = 'Cancel';
    warningDialogRef.componentInstance.btnOkText = 'Confirm';
    warningDialogRef.componentInstance.acceptAction = () => {
      this.deleteTimer(task);
    };
  }

  deleteTask(task: TaskCreateJson) {
    this.description = task.description;
    this.taskService.broadcastDeleteTask(task.id);
    const indexTaskToDelete = this.taskService.stopwatches.indexOf(task, 0);
    this.taskService.stopwatches.splice(indexTaskToDelete, 1);
    this.refreshStopwatchesPage();
    if (this.description == 'Displayed on stopwatch page') {
      this.stopwatchService.taskJson = new TaskCreateJson();
      this.stopwatchService.taskJson.name = 'null@Stopwatch';
    }
  }

  deleteStopwatchListener(index: number) {
    this.taskService.stopwatches.splice(index, 1);
    this.refreshStopwatchesPage();
  }

  deleteTimer(task: TaskCreateJson) {
    this.description = task.description;
    this.taskService.broadcastDeleteTask(task.id);
    const indexTaskToDelete = this.taskService.timers.indexOf(task, 0);
    this.taskService.timers.splice(indexTaskToDelete, 1);
    this.refreshTimersPage();
    if (this.description == 'Displayed on stopwatch page') {
      this.timerService.taskJson = new TaskCreateJson();
      this.timerService.taskJson.name = 'null@Timer';
    }
  }

  deleteTimerListener(index: number) {
    this.taskService.timers.splice(index, 1);
    this.refreshTimersPage();
  }

  browseFile(event: any) {
    this.taskService.importFile(event)
      .subscribe(
        data => {
          data.reverse();
          this.taskService.stopwatches.unshift(...this.fillTimeAll(data).filter(task => task.watchType === 0));
          this.taskService.timers.unshift(...data.filter(task => task.watchType === 1));
          this.taskService.setStopwatchesPage(1);
          this.taskService.setTimersPage(1);
        }
      );
  }

  exportAllTasksAsXml() {
    this.taskService.downloadFile('all_tasks.xml', this.configService.urlExportAllTasksAsXml);
  }

  exportAllTasksAsCsv() {
    this.taskService.downloadFile('all_tasks.csv', this.configService.urlExportAllTasksAsCsv);
  }

  exportAllStopwatchesAsCsv() {
    this.taskService.downloadFile('all_stopwatches.csv', this.configService.urlExportAllStopwatchesAsCsv);
  }

  exportAllTimersAsCsv() {
    this.taskService.downloadFile('all_timers.csv', this.configService.urlExportAllTimersAsCsv);
  }

  exportAllStopwatchesAsXml() {
    this.taskService.downloadFile('all_stopwatches.xml', this.configService.urlExportAllStopwatchesAsXml);
  }

  exportAllTimersAsXml() {
    this.taskService.downloadFile('all_timers.xml', this.configService.urlExportAllTimersAsXml);
  }
}
