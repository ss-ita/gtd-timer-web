import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../services/stopwatch.service';
import { StyleService } from '../services/style.service';
import { StopwatchDialogComponent } from '../stopwatch-dialog/stopwatch-dialog.component';
import { MatDialog } from '@angular/material';
import { TasksComponent } from '../tasks/tasks.component';

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
    private taskComponent: TasksComponent
  ) { }

  ngOnInit() {

  }

  pauseTask() {
    this.taskComponent.pauseTask(this.stopwatchService.taskJson);
    this.stopwatchService.isStopwatchPause = true;
    this.stopwatchService.color = '#c23a33';
  }

  startTask() {
    this.taskComponent.startTask(this.stopwatchService.taskJson);
    this.stopwatchService.color = '#609b9b';
    this.stopwatchService.isStopwatchPause = false;
    this.stopwatchService.isStopwatchRun = true;
  }

  resetTask() {
    this.pauseTask();
    this.taskComponent.reset(this.stopwatchService.taskJson);
    this.stopwatchService.isStopwatchRun = false;
    this.stopwatchService.isStopwatchPause = true;
    this.stopwatchService.color = 'black';
  }

  addTaskFromStopwatch() {
    const stopwatchFormDialogRef = this.dialog.open(StopwatchDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true
    });

    stopwatchFormDialogRef.afterClosed().subscribe();
  }

  clickOnStopWatch() {
    if (this.stopwatchService.isStopwatchPause || this.stopwatchService.isStopwatchRun === false) {
      this.startTask();
    } else {
      this.pauseTask();
    }
  }

  getIsLoggedIn() {
    return localStorage.getItem('access_token') === null ? false : true;
  }
}
