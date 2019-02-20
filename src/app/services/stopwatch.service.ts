import { Injectable } from '@angular/core';

import { timer, Subscription } from 'rxjs';
import { TaskCreateJson } from '../models/taskCreateJson.model';

@Injectable({
  providedIn: 'root'
})

export class StopwatchService {
  hour = 0;
  minute = 0;
  second = 0;
  ticks = 0;
  secondPerHour = 3600;
  secondPerMinute = 60;
  secondPerSecond = 1;
  milisecondPerSecond = 1000;
  maxValueOfHour = 24;

  isStopwatchRun = false;
  isStopwatchPause = true;
  isCreate = false;

  color = 'black';
  subscribe: Subscription;
  taskJson: TaskCreateJson;

  constructor() {
    this.taskJson = new TaskCreateJson();
    this.taskJson.name = 'null@Stopwatch'
  }

  reset() {
    this.pause();
    this.hour = this.minute = this.second = 0;
    this.isStopwatchRun = false;
    this.isStopwatchPause = true;
    this.color = 'black';
  }

  start() {

    this.color = '#609b9b';

    if (this.isStopwatchRun === false) {
      this.isStopwatchPause = false;
      this.isStopwatchRun = true;
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks = x; this.updateTime(); });
    }

    if (this.isStopwatchPause) {
      this.isStopwatchPause = false;
      this.isStopwatchRun = true;
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks++; this.updateTime(); });
    }
  }

  pause() {
    if (this.isStopwatchRun) {
      this.isStopwatchPause = true;
      this.color = '#c23a33';
      this.subscribe.unsubscribe();
    }
  }

  updateTime() {

    if (this.ticks > this.maxValueOfHour * this.secondPerHour) {
      this.pause();
    } else {
      this.hour = Math.floor(this.ticks / this.secondPerHour);
      this.minute = Math.floor((this.ticks % this.secondPerHour) / this.secondPerMinute);
      this.second = Math.floor((this.ticks % this.secondPerHour) % this.secondPerMinute);
    }

  }

  clickOnStopWatch() {
    if (this.isStopwatchPause || this.isStopwatchRun === false) {
      this.start();
    } else {
      this.pause();
    }
  }
}
