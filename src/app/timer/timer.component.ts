import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';

import { TimerService } from '../services/timer.service';
import { PresetDialogComponent } from '../preset-dialog/preset-dialog.component';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  providers: [PresetDialogComponent]
})

export class TimerComponent implements OnInit {
  timerForm: FormGroup  ;

  hourPattern = /^(2[0-4]|1[0-9]|[0-9])$/;
  minuteAndSecondPattern = /^([0-5]?[0-9]|60)$/;

  constructor( private formBuilder: FormBuilder,
     private timerServise: TimerService,
     private service: PresetDialogComponent
     ) {}
  
  openPresetFormDialog(){
    this.service.openPresetForm();
  }

  ngOnInit() {
      this.timerForm = this.formBuilder.group({
      'hour': [this.timerServise.maxValueHour, [Validators.required]],
      'minute': [this.timerServise.maxValueMinute, [Validators.required, Validators.min(0), Validators.max(60)]],
      'second': [this.timerServise.maxValueSecond, [Validators.required, Validators.min(0), Validators.max(60)]]
  });
  }
  
  getErrorMessageHour() {
    return  'please enter a number from 0 to 24';
  }

  getErrorMessageMinuteAndSecond() {
    return  'please enter a number from 0 to 60';
  }

}
