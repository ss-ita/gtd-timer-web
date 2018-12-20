import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})

export class StopwatchComponent implements OnInit {
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  millisecond: number = 0;
  lenOfInterval: number = 1;
  intervalId;

  isStopwatchRun: Boolean = false;
  isStopwatchPause: Boolean = false;

  resetStopwatch() {
    this.pauseStopwatch();
    this.hour = this.minute = this.second = this.millisecond = 0;
    this.isStopwatchRun = this.isStopwatchPause = false;
  }

  startStopwatch() {
    if (this.isStopwatchRun === false || this.isStopwatchPause) {
      this.isStopwatchPause = false;
      this.isStopwatchRun = true;
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 100);
    }
  }

  pauseStopwatch() {
    if (this.isStopwatchRun) {
      this.isStopwatchPause = true;
      clearInterval(this.intervalId);
    }
  }

  clickOnStopWatch() {
    if (this.isStopwatchPause || this.isStopwatchRun === false) {
      this.startStopwatch();
    } else this.pauseStopwatch();
  }

  updateTime() {

    this.millisecond += this.lenOfInterval;

    if (this.millisecond > 9) {
      this.millisecond = 0;
      this.second++;
    }

    if (this.second > 59) {
      this.second = 0;
      this.minute++;
    }

    if (this.minute > 59) {
      this.minute = 0;
      this.hour++;
    }

  }

  constructor() { }

  ngOnInit() {

  }

}
