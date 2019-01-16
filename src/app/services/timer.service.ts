import { ConfigService } from './config.service';
import { Timer } from '../models/preset.model';
import { Injectable } from '@angular/core';
import { timer, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class TimerService {

    constructor(private configService: ConfigService) { }

    timerArrayLenght: number;
    timerIndex = -1;
    timerArray: Timer[];
    maxValueHour: number;
    maxValueMinute: number;
    maxValueSecond: number;
    secondPerHour = 3600;
    secondPerMinute = 60;
    secondPerSecond = 1;
    milisecondPerSecond = 1000;
    maxValueOfHour = 24;
    hour = 0;
    minute = 0;
    second = 0;
    ticks = 0;

    isTimerRun = false;
    isTimerPause = false;
    isTimerFinished = false;
    isFromPreset = false;
    isArrayEmpty = true;

    timerSound = new Audio();
    color = '#609b9b';
    subscribe: Subscription;
    public currentPreset = '#No chosen preset';

    initializeTimersArray(timerArray: Timer[]) {
        this.clearTimersArrayAndIndex();
        this.resetTimer();
        this.timerIndex++;
        this.timerArray = timerArray;
        this.refreshTimer();
        this.timerArrayLenght = timerArray.length;
        this.startTimersFromPreset();
        this.getIsTimerArrayEmpty();
    }

    getIsTimerArrayEmpty() {
        if (this.timerIndex === -1) {
            this.isArrayEmpty = true;
        } else {
            this.isArrayEmpty = false;
        }
    }

    startTimersFromPreset() {
        if (this.timerIndex === this.timerArrayLenght) {
            this.timerIndex = 0;
        }
        if (this.timerIndex <= this.timerArrayLenght - 1) {
            this.setPresetTimer(
                this.timerArray[this.timerIndex].hours, this.timerArray[this.timerIndex].minutes, this.timerArray[this.timerIndex].seconds);
        }
    }

    setPresetTimer(hours: number, minutes: number, seconds: number) {
        this.hour = hours;
        this.minute = minutes;
        this.second = seconds;
        this.maxValueHour = hours;
        this.maxValueMinute = minutes;
        this.maxValueSecond = seconds;
    }

    startTimer() {
        if (this.isTimerRun === false) {
            this.color = '#609b9b';
            this.isTimerPause = false;
            this.isTimerRun = true;
            this.isTimerFinished = false;
            this.hour = this.maxValueHour;
            this.minute = this.maxValueMinute;
            this.second = this.maxValueSecond;
            this.ticks = (this.hour * this.secondPerHour) + (this.minute * this.secondPerMinute) + (this.second * this.secondPerSecond);
            this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks--; this.updateTime(); });
        }

        if (this.isTimerPause) {
            this.isTimerPause = false;
            this.isTimerRun = true;
            this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks--; this.updateTime(); });
        }
    }

    refreshTimer() {
        this.startTimersFromPreset();
        this.pauseTimer();
        this.isTimerRun = this.isTimerPause = false;
        this.hour = this.maxValueHour;
        this.minute = this.maxValueMinute;
        this.second = this.maxValueSecond;
        this.ticks = (this.hour * this.secondPerHour) + (this.minute * this.secondPerMinute) + (this.second * this.secondPerSecond);
    }

    pauseTimer() {
        if (this.isTimerRun) {
            this.isTimerPause = true;
            this.subscribe.unsubscribe();
        }
    }

    updateTime() {
        if (this.minute == 0 && this.second < 11 && this.hour == 0) {
            this.color = '#ad2265';
        }

        if (this.minute == 0 && this.second == 0 && this.hour == 0) {
            this.timerIndex++;
            this.resetTimer();
            this.refreshTimer();
            this.timerSound.src = this.configService.urlSoundTimer;
            this.timerSound.play();
            this.isTimerFinished = true;
        }

        if (this.ticks > this.maxValueOfHour * this.secondPerHour) {
            this.pauseTimer();
        } else {
            this.hour = Math.floor(this.ticks / this.secondPerHour);
            this.minute = Math.floor((this.ticks % this.secondPerHour) / this.secondPerMinute);
            this.second = Math.floor((this.ticks % this.secondPerHour) % this.secondPerMinute);
        }
    }

    clearTimersArrayAndIndex() {
        this.timerArray = [];
        this.timerIndex = -1;
    }

    resetTimer() {
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.isTimerFinished = false;
        this.color = '#609b9b';
    }
}
