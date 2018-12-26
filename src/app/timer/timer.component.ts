import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';

import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})

export class TimerComponent implements OnInit {
  timerForm: FormGroup;

  hourPattern = /^(2[0-4]|1[0-9]|[0-9])$/;
  minuteAndSecondPattern = /^([0-5]?[0-9]|60)$/;

  constructor( private formBuilder: FormBuilder, private timerServise: TimerService) { 
   }

  ngOnInit() {
      this.timerForm = this.formBuilder.group({
      'hour': [this.timerServise.maxValueHour, [Validators.required, Validators.minLength(1),Validators.pattern(this.hourPattern)]],
      'minute': [this.timerServise.maxValueMinute, [Validators.required, Validators.minLength(1),Validators.pattern(this.minuteAndSecondPattern)]],
      'second': [this.timerServise.maxValueSecond, [Validators.required, Validators.minLength(1),Validators.pattern(this.minuteAndSecondPattern)]]
  });
  }
  
  getErrorMessageHour() {
    return  'please enter a number from 0 to 24';
  }

  getErrorMessageMinuteAndSecond() {
    return  'please enter a number from 0 to 60';
  }

}
