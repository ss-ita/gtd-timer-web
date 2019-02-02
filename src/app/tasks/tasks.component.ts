import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { TasksService } from '../services/tasks.service';
import { timer, Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { HistoryService } from '../services/history.service';
import { Record } from '../models/record.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksService],


})

export class TasksComponent implements OnInit {
  constructor(
    public taskService: TasksService,
    private configService: ConfigService,
    private historyService: HistoryService
  ) {
    this.progress = this.emulateProgress();
  }

  readonly progress: Observable<number>;
  public searchText: string;
  public taskName: string;
  subscribe: Subscription;
  displayStopwatch = true;
  displayTimer = false;
  ticks = 0;
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
      isRunning: false,
      hour: 0,
      minutes: 0,
      seconds: 0,
      currentSecond: 0,
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
      isRunning: false,
      hour: 0,
      minutes: 0,
      seconds: 0,
      currentSecond: 0,
      isCollapsed: true,
      isStoped: false,
      watchType: 1,
      maxValueHour: 0,
      maxValueMinute: 0,
      maxValueSecond: 0,
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

    this.taskService.createTask(taskToPass).subscribe(myObserver);

  }

  deleteTask(task: TaskCreateJson) {
    this.taskService.deleteTask(task.id).subscribe();
    const indexTaskToDelete = this.taskService.stopwatches.indexOf(task, 0);
    this.taskService.stopwatches.splice(indexTaskToDelete, 1);
  }
  deleteTimer(task: TaskCreateJson) {
    this.taskService.deleteTask(task.id).subscribe();
    const indexTaskToDelete = this.taskService.timers.indexOf(task, 0);
    this.taskService.timers.splice(indexTaskToDelete, 1);
  }

  updateTask(task: TaskCreateJson) {
    this.taskService.updateTask(task).subscribe();
  }

  getStopwatches() {
    const observer = {
      next: data => {
        this.taskService.stopwatches = [];
        for (let i = data.length - 1; i >= 0; --i) {
          const toPush: TaskCreateJson = {
            id: data[i].id,
            name: data[i].name,
            description: data[i].description,
            goal: data[i].goal,
            elapsedTime: data[i].elapsedTime,
            lastStartTime: data[i].lastStartTime,
            isRunning: data[i].isRunning,
            watchType: data[i].watchType,
            hour: Math.floor((data[i].elapsedTime / 1000) / this.secondPerHour),
            minutes: Math.floor(((data[i].elapsedTime / 1000) % this.secondPerHour) / this.secondPerMinute),
            seconds: Math.floor(((data[i].elapsedTime / 1000) % this.secondPerHour) % this.secondPerMinute),
            isStoped: false,
            currentSecond: 0,
            isCollapsed: true,
            maxValueHour: 0,
            maxValueMinute: 0,
            maxValueSecond: 0,
            isTimerFinished: false,
            goals: 0,
            ticksi: 0
          };
          this.taskService.stopwatches.push(toPush);
        }
      },
      complete: () => { this.runAfterGet(); }
    };
    this.taskService.getStopwatches().subscribe(observer);
  }

  runAfterGet() {
    for (let i = 0; i < this.taskService.stopwatches.length; ++i) {
      if (this.taskService.stopwatches[i].isRunning && this.taskService.stopwatches[i].elapsedTime == 0) {
        this.start1(this.taskService.stopwatches[i]);
      }
    }
  }

  start1(task: TaskCreateJson) {
    task.isRunning = true;
    if (!task.isStoped) {
      const timeStart = new Date(task.lastStartTime);
      const timeNow = new Date();
      const elapsedTimeMoq = ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
        60000 + (timeNow.getSeconds() - timeStart.getSeconds()) * 1000 + (timeNow.getMilliseconds() - timeStart.getMilliseconds()));
      this.ticks = elapsedTimeMoq;
      task.currentSecond = elapsedTimeMoq / 1000;
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe((x) => {
        if (task.isRunning) {
          this.updateTime(task);
        }
      });
    }
    return this.ticks;
  }

  getTimers() {
    this.taskService.getTimers().subscribe(data => {
      this.taskService.timers = [];
      let time: any;
      for (let i = data.length - 1; i >= 0; --i) {
        const toPush: TaskCreateJson = {
          id: data[i].id,
          name: data[i].name,
          description: data[i].description,
          goal: data[i].goal,
          elapsedTime: data[i].elapsedTime,
          lastStartTime: data[i].lastStartTime,
          isRunning: data[i].isRunning,
          watchType: data[i].watchType,
          hour: Math.floor((data[i].elapsedTime / 1000) / this.secondPerHour),
          minutes: Math.floor(((data[i].elapsedTime / 1000) % this.secondPerHour) / this.secondPerMinute),
          seconds: Math.floor(((data[i].elapsedTime / 1000) % this.secondPerHour) % this.secondPerMinute),
          isStoped: false,
          currentSecond: 0,
          isCollapsed: true,
          maxValueHour: 0,
          maxValueMinute: 0,
          maxValueSecond: 0,
          isTimerFinished: false,
          goals: 0,
          ticksi: 0
        };

        if (toPush.goal != null) {
          time = toPush.goal.split(':');
          toPush.maxValueHour = Number(time[0]);
          toPush.maxValueMinute = Number(time[1]);
          toPush.maxValueSecond = Number(time[2]);
        }
        this.taskService.timers.push(toPush);
      }
    });
  }

  browseFile(event: any) {
    this.taskService.importFile(event)
      .subscribe(
        data => {
          data.reverse();
          this.taskService.stopwatches.unshift(...this.fillTimeAll(data).filter(task => task.watchType === 0));
          this.taskService.timers.unshift(...data.filter(task => task.watchType === 1));
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

  pauseTask(task: TaskCreateJson) {
    task.isRunning = false;
    task.isStoped = true;
    task.elapsedTime = task.currentSecond * 1000;
    this.taskService.pauseTask(task).subscribe();
    const timeStart = new Date(task.lastStartTime);
    const timeNow = new Date();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    const stop = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    const recordToCreate: Record = {
      id: 0,
      name: task.name,
      description: task.description,
      startTime: task.lastStartTime,
      stopTime: stop,
      elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
        60000 + (timeNow.getSeconds() - timeStart.getSeconds()) * 1000 + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
      watchType: task.watchType,
      action: 'Pause',
      taskId: task.id
    };
    this.historyService.createRecord(recordToCreate).subscribe();

  }
  pauseTimer(task: TaskCreateJson) {
    task.isRunning = false;
    task.isStoped = true;
    this.taskService.pauseTask(task).subscribe();
    const timeStart = new Date(task.lastStartTime);
    const timeNow = new Date();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    const stop = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    const recordToCreate: Record = {
      id: 0,
      name: task.name,
      description: task.description,
      startTime: task.lastStartTime,
      stopTime: stop,
      elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
        60000 + (timeNow.getSeconds() - timeStart.getSeconds()) * 1000 + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
      watchType: task.watchType,
      action: 'Pause',
      taskId: task.id
    };
    this.historyService.createRecord(recordToCreate).subscribe();
  }
  resetTimer(task: TaskCreateJson) {
    task.hour = task.minutes = task.seconds = 0;
    task.isStoped = task.isRunning = false;
    this.taskService.resetTask(task).subscribe();
    const timeStart = new Date(task.lastStartTime);
    const timeNow = new Date();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    const stop = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    const recordToCreate: Record = {
      id: 0,
      name: task.name,
      description: task.description,
      startTime: task.lastStartTime,
      stopTime: stop,
      elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
        60000 + (timeNow.getSeconds() - timeStart.getSeconds()) * 1000 + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
      watchType: task.watchType,
      action: 'Reset',
      taskId: task.id
    };
    this.historyService.createRecord(recordToCreate).subscribe();

  }

  reset(task: TaskCreateJson) {
    task.hour = task.minutes = task.seconds = 0;
    task.elapsedTime = 0;
    task.isStoped = task.isRunning = false;
    this.taskService.resetTask(task).subscribe();
    const timeStart = new Date(task.lastStartTime);
    const timeNow = new Date();
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    const stop = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    const recordToCreate: Record = {
      id: 0,
      name: task.name,
      description: task.description,
      startTime: task.lastStartTime,
      stopTime: stop,
      elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
        60000 + (timeNow.getSeconds() - timeStart.getSeconds()) * 1000 + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
      watchType: task.watchType,
      action: 'Reset',
      taskId: task.id
    };
    this.historyService.createRecord(recordToCreate).subscribe();


  }

  startTask(task: TaskCreateJson) {
    this.start(task);
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    task.lastStartTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.taskService.startTask(task).subscribe();
  }

  startTimer(task: TaskCreateJson) {
    this.startTimeTimer(task);
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    task.lastStartTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    this.taskService.startTask(task).subscribe();
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
      task.goal = task.maxValueHour.toString() + ':' + task.maxValueMinute.toString() + ':' + task.maxValueSecond.toString();
      task.hour = task.maxValueHour;
      task.minutes = task.maxValueMinute;
      task.seconds = task.maxValueSecond;
      task.ticksi = (task.hour * this.secondPerHour) + (task.minutes * this.secondPerMinute) + (task.seconds * this.secondPerSecond);
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe((x) => {
        task.ticksi--; this.updateTimeTimer(task);
      });
    }
    return task.ticksi;
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
      if (task.minutes == 0 && task.seconds == 0 && task.hour == 0) {
        task.isStoped = true;
      } else {
        task.hour = Math.floor(task.ticksi / this.secondPerHour);
        task.minutes = Math.floor((task.ticksi % this.secondPerHour) / this.secondPerMinute);
        task.seconds = Math.floor((task.ticksi % this.secondPerHour) % this.secondPerMinute);
      }

    }
  }
}
