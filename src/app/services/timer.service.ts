import { Injectable } from '@angular/core';

import { timer, Subscription } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})

export class TimerService {
    maxValueHour: number;
    maxValueMinute: number;
    maxValueSecond: number;
    hour: number = 0;
    minute: number = 0;
    second: number = 0;
    ticks: number = 0;
    secondPerHour: number = 3600;
    secondPerMinute: number = 60;
    secondPerSecond: number = 1;
    milisecondPerSecond: number = 1000;
    maxValueOfHour: number = 24;

    isTimerRun: Boolean = false;
    isTimerPause: Boolean = false;
    isTimerFinished: Boolean = false;

    timerSound = new Audio();
    color: string = 'blue';
    subscribe: Subscription;

    resetTimer() {
        this.pauseTimer();
        this.isTimerRun = this.isTimerPause = false;
        this.hour = this.maxValueHour;
        this.minute = this.maxValueMinute;
        this.second = this.maxValueSecond;
        this.ticks = (this.hour * this.secondPerHour) + (this.minute * this.secondPerMinute) + (this.second*this.secondPerSecond);
    }

    startTimer() {
        if (this.isTimerRun === false) {
            this.color = 'blue';
            this.hour = this.maxValueHour;
            this.minute = this.maxValueMinute;
            this.second = this.maxValueSecond;
            this.isTimerPause = false;
            this.isTimerRun = true;
            this.isTimerFinished = false;
            this.ticks = (this.hour * this.secondPerHour) + (this.minute * this.secondPerMinute) + (this.second*this.secondPerSecond);
            this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks--; this.updateTime(); });
        }

        if (this.isTimerPause) {
            this.isTimerPause = false;
            this.isTimerRun = true;
            this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks--; this.updateTime(); });
        }
    }

    pauseTimer() {
        if (this.isTimerRun) {
            this.isTimerPause = true;
            this.subscribe.unsubscribe();
        }
    }

    updateTime(){

        if (this.minute == 0 && this.second < 11 && this.hour == 0) {
            this.color = 'red';
        }

        if (this.minute == 0 && this.second == 0 && this.hour == 0) {
            this.resetTimer();
            this.timerSound.src = this.configService.urlSoundTimer;
            this.timerSound.play();
            this.isTimerFinished = true;
        }

        if (this.ticks > this.maxValueOfHour * this.secondPerHour) {
            this.pauseTimer();
        }
        else {
            this.hour = Math.floor(this.ticks / this.secondPerHour);
            this.minute = Math.floor((this.ticks % this.secondPerHour) / this.secondPerMinute);
            this.second = Math.floor((this.ticks % this.secondPerHour) % this.secondPerMinute);
        }

    }

    constructor(private configService: ConfigService) { }
}

