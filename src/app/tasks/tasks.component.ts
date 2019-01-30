import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { TasksService } from '../services/tasks.service';
import { timer, Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksService],


})
export class TasksComponent implements OnInit {

  constructor(
    public taskService: TasksService,
    private configService: ConfigService
  ) {
    this.progress = this.emulateProgress();

  }

  readonly progress: Observable<number>;
  public searchText: string;
  public taskName: String;
  public elapsedTime: number;
  subscribe: Subscription;
  displayStopwatch = true;
  displayTimer = false;
  ticks = 0;
  ticksi = 0;
  milisecondPerSecond = 1000;
  secondPerHour = 3600;
  secondPerMinute = 60;
  secondPerSecond = 1;


  displayStopwatches() {
    this.displayStopwatch = true;
    this.displayTimer = false;
  }
  displayTimers() {
    this.displayStopwatch = false;
    this.displayTimer = true;
  }
  toggleCollapsed(task: TaskCreateJson) {
    task.isCollapsed = !task.isCollapsed;
  }



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
    this.getStopwatches();
    this.getTimers();
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

  addStopwatch() {
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
      isCollapsed: true,
      isStoped: false,
      watchType: 0,
      maxValueHour: 0,
      maxValueMinute: 0,
      maxValueSecond: 0,
      isTimerFinished: false,
      goals: 0
    };

    const myObserver = {
      next: task => {
        this.taskService.stopwatches.unshift(task);
      },
      error: err => { },
      complete: () => { }
    };

    this.taskService.createTask(taskToPass).subscribe(myObserver);

  }

  addTimer() {
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
      isCollapsed: true,
      isStoped: false,
      watchType: 1,
      maxValueHour: 0,
      maxValueMinute: 0,
      maxValueSecond: 0,
      isTimerFinished: false,
      goals: 0
    };

    const myObserver = {
      next: task => {
        this.taskService.timers.unshift(task);
      },
      error: err => { },
      complete: () => { }
    };

    this.taskService.createTask(taskToPass).subscribe(myObserver);

  }

  deleteTask(task: TaskCreateJson) {
    this.taskService.deleteTask(task.id).subscribe();
    const indexTaskToDelete = this.taskService.stopwatches.indexOf(task, 0);
    this.taskService.stopwatches.splice(indexTaskToDelete, 1);
  }

  updateTask(task: TaskCreateJson) {
    this.taskService.updateTask(task).subscribe();
  }
  getStopwatches() {
    this.taskService.getStopwatches().subscribe(data => {
      this.taskService.stopwatches = [];
      for (let i = 0; i < data.length; ++i) {
        let toPush: TaskCreateJson = {
          id: data[i].id,
          name: data[i].name,
          description: data[i].description,
          goal: data[i].goal,
          elapsedTime: data[i].elapsedTime,
          lastStartTime: data[i].lastStartTime,
          isActive: data[i].isActive,
          isRunning: data[i].isRunning,
          watchType: data[i].watchType,
          hour: 0,
          minutes: 0,
          seconds: 0,
          isStoped: false,
          lastStartTimeNumber: 0,
          currentSecond: 0,
          isCollapsed: true,
          maxValueHour: 0,
          maxValueMinute: 0,
          maxValueSecond: 0,
          isTimerFinished: false,
          goals: 0
        };
        this.taskService.stopwatches.push(toPush);
      }
    });
  }
  getTimers() {
    this.taskService.getTimers().subscribe(data => {
      this.taskService.timers = [];
      for (let i = 0; i < data.length; ++i) {
        let toPush: TaskCreateJson = {
          id: data[i].id,
          name: data[i].name,
          description: data[i].description,
          goal: data[i].goal,
          elapsedTime: data[i].elapsedTime,
          lastStartTime: data[i].lastStartTime,
          isActive: data[i].isActive,
          isRunning: data[i].isRunning,
          watchType: data[i].watchType,
          hour: 0,
          minutes: 0,
          seconds: 0,
          isStoped: false,
          lastStartTimeNumber: 0,
          currentSecond: 0,
          isCollapsed: true,
          maxValueHour: 0,
          maxValueMinute: 0,
          maxValueSecond: 0,
          isTimerFinished: false,
          goals: 0
        };
        this.taskService.timers.push(toPush);
      }
    });
  }

  browseFile(event: any) {
    this.taskService.importFile(event)
      .subscribe(
        event => {
          this.taskService.stopwatches.push(...event.filter(task => task.isActive));
        }
      )
  }

  exportAllTasksAsXml() {
    this.taskService.downloadFile("all_tasks.xml", this.configService.urlExportAllTasksAsXml);
  }

  exportAllTasksAsCsv() {
    this.taskService.downloadFile("all_tasks.csv", this.configService.urlExportAllTasksAsCsv);
  }

  exportAllActiveTasksAsXml() {
    this.taskService.downloadFile("active_tasks.xml", this.configService.urlExportAllActiveTasksAsXml);
  }

  exportAllActiveTasksAsCsv() {
    this.taskService.downloadFile("active_tasks.csv", this.configService.urlExportAllActiveTasksAsCsv);
  }


  getMiliSecondsFromTime(task: TaskCreateJson) {
    let now = Date.now();
    return now - task.lastStartTimeNumber;
  }


  startTask(task: TaskCreateJson) {
    this.taskService.startTask(task).subscribe();
    task.lastStartTimeNumber = Date.now();
    /*task.lastStartTime = now.getFullYear().toString() + '-' + now.getMonth().toString()
    + '-' + now.getDay().toString() + 'T' + now.getHours() + ':' + now.getMinutes().toString() + ':'
    + now.getSeconds().toString() + '.' + now.getMilliseconds().toString();*/
    this.start(task);
  }
  startTimer(task: TaskCreateJson) {
    this.taskService.startTask(task).subscribe();
    task.lastStartTimeNumber = Date.now();
    this.startTimeTimer(task);
  }
  startTimeTimer(task: TaskCreateJson) {
    task.isRunning = true;
    if (!task.isStoped) {
      if (task.maxValueHour == null) {
        task.maxValueHour = 0;
      }

      if (task.maxValueMinute == null) {
        task.maxValueMinute = 0;
      }

      if (task.maxValueSecond == null) {
        task.maxValueSecond = 0;
      }

      //task.maxValueSecond = task.goals / 1000;
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe((x) => {
        if (task.isRunning) {
          this.updateTimeTimer(task);
        }
      });
    }
    return this.ticksi;
  }
  start(task: TaskCreateJson) {
    task.isRunning = true;
    if (!task.isStoped) {
      this.ticks = task.elapsedTime;
      task.currentSecond = task.elapsedTime / 1000;
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe((x) => {
        if (task.isRunning) {
          this.updateTime(task);
        }
      });
    }
    return this.ticks;
  }
  updateTime(task: TaskCreateJson) {
    if (task.isRunning) {
      task.currentSecond++;
      task.hour = Math.floor(task.currentSecond / this.secondPerHour);
      task.minutes = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) / this.secondPerMinute);
      task.seconds = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) % this.secondPerMinute);
    }
  }
  updateTimeTimer(task: TaskCreateJson) {
    if (task.isRunning) {
      task.currentSecond--;
      task.hour = task.maxValueHour;
      task.minutes = task.maxValueMinute;
      task.seconds = task.maxValueSecond;
      this.ticksi = (task.hour * this.secondPerHour) + (task.minutes * this.secondPerMinute) + (task.seconds * this.secondPerSecond);
      task.goals = ((task.maxValueHour * this.secondPerHour) + (task.maxValueMinute * this.secondPerMinute) + (task.maxValueSecond * this.secondPerSecond));
      task.currentSecond = task.goals / 1000;

      task.hour = Math.floor(task.goals / this.secondPerHour);
      task.minutes = Math.floor((task.goals % this.secondPerHour) / this.secondPerMinute);
      task.seconds = Math.floor((task.goals % this.secondPerHour) % this.secondPerMinute);
      task.currentSecond--;

      //task.hour = Math.floor(task.currentSecond / this.secondPerHour);
      //task.minutes = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) / this.secondPerMinute);
      //task.seconds = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) % this.secondPerMinute);

    }
  }

  pauseTask(task: TaskCreateJson) {
    task.isRunning = false;
    task.isStoped = true;
    task.elapsedTime = task.currentSecond * 1000;
    //task.elapsedTime = this.getMiliSecondsFromTime(task);
    this.taskService.pauseTask(task).subscribe();
  }

  reset(task: TaskCreateJson) {
    task.hour = task.minutes = task.seconds = 0;
    //task.elapsedTime = this.getMiliSecondsFromTime(task);
    task.elapsedTime = 0;
    task.isStoped = task.isRunning = false;
    this.taskService.resetTask(task).subscribe();

  }
}
