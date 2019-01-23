import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { TasksService } from '../services/tasks.service';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksService],


})
export class TasksComponent implements OnInit {

  constructor(
    private taskService: TasksService,
  ) {
    this.progress = this.emulateProgress();

  }


  public tasks: TaskCreateJson[] = [];
  public activeTasks: TaskCreateJson[] = [];
  readonly progress: Observable<number>;
  public searchText: string;
  public taskName: String;
  public elapsedTime: number;
  isActive: boolean;
  isPaused: boolean;
  subscribe: Subscription;
  ticks = 0;
  milisecondPerSecond = 1000;


  emulateProgress() {
    return new Observable<number>(observer => {
      let val = 0;
      const interval = setInterval(() => {
        if (val < 100) {
          val++;
        } else {
          val = 0;
        }

        observer.next(val);
      }, 100);

      return () => {
        clearInterval(interval);
      };
    });
  }
  ngOnInit() {
    this.getActiveTasks();
  }

  filterByProperty(propertyName: string) {
    this.tasks = this.tasks.sort((a, b) => {
      switch (propertyName) {
        case 'name': return this.compare(a.name, b.name);
      }
    });
  }

  compare(a: String, b: String) {
    return (a.toLowerCase() < b.toLowerCase() ? -1 : 1);
  }



  addTask() {
    const taskToPass: TaskCreateJson = {
      id: 0,
      name: this.taskName,
      description: '',
      elapsedTime: 0,
      goal: '',
      lastStartTime: '0001-01-01T00:00:00Z',
      isActive: true,
      isRunning: false,
      hour: 0,
      minutes: 0,
      seconds: 0,
      lastStartTimeNumber: 0,
      currentSecond: 0,
      isStoped: false
    };

    const myObserver = {
      next: x => { },
      error: err => { },
      complete: () => {
        this.taskService.getActiveTasksFromServer().subscribe();
      },
    };

    this.taskService.createTask(taskToPass).subscribe(myObserver);
    this.tasks.unshift(taskToPass);
  }

  deleteTask(task: TaskCreateJson) {
    this.taskService.switchTaskStatus(task).subscribe();
    const indexTaskToDelete = this.tasks.indexOf(task, 0);
    this.tasks.splice(indexTaskToDelete, 1);
  }

  updateTask(task: TaskCreateJson) {
    this.taskService.updateTask(task).subscribe();
  }

  getActiveTasks() {
    this.taskService.getActiveTasksFromServer().subscribe(data => {
      this.tasks = [];
      for (let i = 0; i < data.length; ++i) {
        data[i].currentSecond = 0;
        data[i].isStoped = false;
        this.tasks.push(data[i]);
      }
    });
  }


  getMiliSecondsFromTime(task: TaskCreateJson) {
    const now = Date.now();
    return now - task.lastStartTimeNumber;
  }

  startTask(task: TaskCreateJson) {
    this.taskService.startTask(task).subscribe();
    task.lastStartTimeNumber = Date.now();
    this.start(task);
  }

  pauseTask(task: TaskCreateJson) {
    task.isRunning = false;
    task.isStoped = true;
    task.elapsedTime = this.getMiliSecondsFromTime(task);
    this.taskService.pauseTask(task).subscribe();
  }

  reset(task: TaskCreateJson) {
    this.taskService.resetTask(task).subscribe();
    task.hour = task.minutes = task.seconds = 0;
    task.elapsedTime = 0;
    task.isStoped = task.isRunning = false;

  }

  start(task: TaskCreateJson) {
    task.isRunning = true;
    if (!task.isStoped) {
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe((x) => {
        if (task.isRunning) {
          this.updateTime(task);
        }
      });
    }
    return this.ticks;
  }

  checkTaskIsPaused(task: TaskCreateJson) {
    return (task.hour != undefined ? task.hour : 0) != 0
      && (task.minutes != undefined ? task.minutes : 0) != 0
      && (task.seconds != undefined ? task.seconds : 0) != 0;
  }

  updateTime(task: TaskCreateJson) {
    if (task.isRunning) {
      task.currentSecond++;
      task.hour = Math.floor(task.currentSecond / 3600);
      task.minutes = Math.floor((task.currentSecond - (3600 * task.hour)) / 60);
      task.seconds = Math.floor((task.currentSecond - (3600 * task.hour)) % 60);
    }
  }



}
