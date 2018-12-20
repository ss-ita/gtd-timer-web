import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {
  maxValueHour: number; 
  maxValueMinute: number;
  maxValueSecond: number;
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  millisecond: number = 0;
  lenOfInterval: number = 1;
  intervalId;

  isTimerRun: Boolean = false;
  isTimerPause: Boolean = false;
  isTimerFinished: Boolean = false;

  timerForm: FormGroup;
  timerSound = new Audio();
  color: string = 'blue';

  hourPattern = /^(2[0-4]|1[0-9]|[0-9])$/;
  minuteAndSecondPattern = /^([0-5]?[0-9]|60)$/;

  constructor( private formBuilder: FormBuilder) { 
    this.timerSound.src = "https://www.freespecialeffects.co.uk/soundfx/sirens/alarm_01.wav";
   }

  ngOnInit() {
    this.timerForm = this.formBuilder.group({
      'hour': [this.maxValueHour, [Validators.required, Validators.minLength(1),Validators.pattern(this.hourPattern)]],
      'minute': [this.maxValueMinute, [Validators.required, Validators.minLength(1),Validators.pattern(this.minuteAndSecondPattern)]],
      'second': [this.maxValueSecond, [Validators.required, Validators.minLength(1),Validators.pattern(this.minuteAndSecondPattern)]]
  });
  }

  resetTimer() {
    this.pauseTimer();
    this.isTimerRun = this.isTimerPause = false;
    this.hour = this.maxValueHour;
    this.minute = this.maxValueMinute;
    this.second = this.maxValueSecond;
  }

  startTimer() {
    if(this.isTimerRun === false){
      this.color = 'blue';
      this.hour = this.maxValueHour;
      this.minute = this.maxValueMinute;
      this.second = this.maxValueSecond;
      this.isTimerPause = false;
      this.isTimerRun = true;
      this.isTimerFinished = false;
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 100);
    }

    if (this.isTimerPause) {
      this.isTimerPause = false;
      this.isTimerRun = true;
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 100);
    }
  }

  pauseTimer() {
    if (this.isTimerRun) {
      this.isTimerPause = true;
      clearInterval(this.intervalId);
    }
  }

  updateTime() {

    this.millisecond -= this.lenOfInterval;
    
    if(this.minute == 0 && this.second < 11 && this.hour == 0){
      this.color = 'red';
    }

    if(this.minute == 0 && this.second == 0 && this.hour == 0){
      this.resetTimer();
      this.timerSound.play();
      this.isTimerFinished = true; 
    }
    
    if (this.millisecond < 0) {
      this.millisecond = 9;
      this.second--;
    }

    if (this.second < 0) {
      this.second = 59;
      this.minute--;
    }

    if (this.minute < 0) {
      this.minute = 59;
      this.hour--;
    }
  }
  
  getErrorMessageHour() {
    return  'please enter a number from 0 to 24';
  }

  getErrorMessageMinuteAndSecond() {
    return  'please enter a number from 0 to 60';
  }

}
