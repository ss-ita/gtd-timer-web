import { ConfigService } from './config.service';
import { Timer } from '../models/preset.model';
import { Injectable } from '@angular/core';
import { timer, Subscription } from 'rxjs';


@Injectable({ providedIn: 'root'})


export class TimerService {
  
    constructor(private configService: ConfigService) { }

    timerArrayLenght: number;
    timerIndex: number = -1;
    timerArray: Timer [];
    maxValueHour: number;
    maxValueMinute: number;
    maxValueSecond: number;   
    secondPerHour: number = 3600;
    secondPerMinute: number = 60;
    secondPerSecond: number = 1;
    milisecondPerSecond: number = 1000;
    maxValueOfHour: number = 24;
    hour: number = 0;
    minute: number = 0;
    second: number = 0;
    ticks: number = 0;

    isTimerRun: Boolean = false;
    isTimerPause: Boolean = false;
    isTimerFinished: Boolean = false;
    isLine: boolean;
    isFromPreset: boolean = false;

   
    timerSound = new Audio();
    color: string = 'blue';
    subscribe: Subscription;
    public currentPreset = "#No choosen preset";

    initializeTimerArray(timerArray: Timer[]) {
        this.clearTimerArrayAndIndex();
        this.timerArray = timerArray;
        this.timerArrayLenght = timerArray.length;
        this.timerIndex++;
        this.startTimerFromPreset();
    }
    startTimerFromPreset(){
        if(this.timerIndex === this.timerArrayLenght)this.timerIndex = 0;
        if(this.timerIndex <= this.timerArrayLenght-1)
        this.startPresetTimer(this.timerArray[this.timerIndex].hours,this.timerArray[this.timerIndex].minutes,this.timerArray[this.timerIndex].seconds);
    }
    startPresetTimer(hours: number,minutes: number,seconds: number) {
        this.hour = hours;
        this.minute = minutes;
        this.second = seconds;
        this.maxValueHour = hours;
        this.maxValueMinute = minutes;
        this.maxValueSecond = seconds;
    }

    startTimer()
    {
        if (this.isTimerRun === false) {
            this.color = 'blue';
            this.isTimerPause = false;
            this.isTimerRun = true;
            this.isTimerFinished = false;
            this.hour = this.maxValueHour;
            this.minute = this.maxValueMinute;
            this.second = this.maxValueSecond;
            this.ticks = (this.hour * this.secondPerHour) + (this.minute * this.secondPerMinute) + (this.second*this.secondPerSecond);
            this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks--; this.updateTime(); });}
        
        if (this.isTimerPause) {
            this.isTimerPause = false;
            this.isTimerRun = true;
            this.subscribe = timer(0, this.milisecondPerSecond).subscribe(x => { this.ticks--; this.updateTime(); });}
    }

    refreshTimer() {
        this.startTimerFromPreset();
        this.pauseTimer();
        this.isTimerRun = this.isTimerPause = false;
        this.hour = this.maxValueHour;
        this.minute = this.maxValueMinute;
        this.second = this.maxValueSecond;
        this.ticks = (this.hour * this.secondPerHour) + (this.minute * this.secondPerMinute) + (this.second*this.secondPerSecond);
    }

    pauseTimer() {
        if (this.isTimerRun) {
            this.isTimerPause = true;
            this.subscribe.unsubscribe();}
    }

    updateTime(){
        if (this.minute == 0 && this.second < 11 && this.hour == 0) {
            this.color = 'red';}

        if (this.minute == 0 && this.second == 0 && this.hour == 0) {
            this.timerIndex++;
            this.resetTimer();
            this.refreshTimer();
            this.timerSound.src = this.configService.urlSoundTimer;
            this.timerSound.play();}

        if (this.ticks > this.maxValueOfHour * this.secondPerHour){
            this.pauseTimer();}
        else {
            this.hour = Math.floor(this.ticks / this.secondPerHour);
            this.minute = Math.floor((this.ticks % this.secondPerHour) / this.secondPerMinute);
            this.second = Math.floor((this.ticks % this.secondPerHour) % this.secondPerMinute);}
    }

    clearTimerArrayAndIndex(){
        this.timerArray = [];
        this.timerIndex = -1;
    }
    resetTimer(){
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
    }
}

