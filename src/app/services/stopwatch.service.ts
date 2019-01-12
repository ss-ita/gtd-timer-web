import { Injectable } from '@angular/core';

import { timer, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StopwatchService {
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  ticks: number = 0;
  secondPerHour: number = 3600;
  secondPerMinute: number = 60;
  secondPerSecond: number = 1;
  milisecondPerSecond: number = 1000;
  maxValueOfHour: number = 24;

  isStopwatchRun: boolean = false;
  isStopwatchPause: boolean = false;

  color: string = 'blue';
  subscribe: Subscription;

  reset() {
    this.pause();
    this.hour = this.minute = this.second = 0;
    this.isStopwatchRun = this.isStopwatchPause = false;
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
      this.color = 'red';
      this.subscribe.unsubscribe();
    }
  }

  updateTime() {

    if (this.ticks > this.maxValueOfHour * this.secondPerHour) {
      this.pause();
    }
    else {
      this.hour = Math.floor(this.ticks / this.secondPerHour);
      this.minute = Math.floor((this.ticks % this.secondPerHour) / this.secondPerMinute);
      this.second = Math.floor((this.ticks % this.secondPerHour) % this.secondPerMinute);
    }

  }

  clickOnStopWatch() {
    if (this.isStopwatchPause || this.isStopwatchRun === false) {
      this.start();
    } else this.pause();
  }

  constructor() { }
}
