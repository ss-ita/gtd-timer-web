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
  isRun: Boolean = false;
  isPause: Boolean = false;
  lenOfInterval: number = 10;
  intervalId;

  ResetStopwatch() {
    this.PauseStopwatch();
    this.hour = this.minute = this.second = this.millisecond = 0;
    this.isRun = false;
    this.isPause = false;
  }

  StartStopwatch() {
    if (this.isRun == false || this.isPause == true) {
      this.isPause = false;
      this.isRun = true;
      this.intervalId = setInterval(() => {
        this.UpdateTime();
      }, 100);
    }
  }

  PauseStopwatch() {
    if (this.isRun == true) {
      this.isPause = true;
      clearInterval(this.intervalId);
    }
  }

  ClickOnStopWatch() {
    if (this.isPause == true || this.isRun == false) {
      this.StartStopwatch();
    } else this.PauseStopwatch();
  }

  UpdateTime() {

    this.millisecond += this.lenOfInterval;

    if (this.millisecond > 90) {
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
