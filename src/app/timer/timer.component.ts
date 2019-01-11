import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup, Validators} from '@angular/forms';

import { TimerService } from '../services/timer.service';
import { PresetDialogComponent } from '../preset-dialog/preset-dialog.component';
import { StyleService } from '../services/style.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  providers: [PresetDialogComponent]
})

export class TimerComponent implements OnInit {
  
  timerForm: FormGroup;

  constructor( private formBuilder: FormBuilder,
     private timerServise: TimerService,
     private service: PresetDialogComponent,
     private styleService: StyleService
     ) {}
  
  openPresetFormDialog(){
    this.service.openPresetForm();
  }

  ngOnInit() {
      this.timerForm = this.formBuilder.group({
      'hour': [this.timerServise.maxValueHour,[Validators.required, Validators.min(0), Validators.max(23)]],
      'minute': [this.timerServise.maxValueMinute, [Validators.required, Validators.min(0), Validators.max(59)]],
      'second': [this.timerServise.maxValueSecond, [Validators.required, Validators.min(0), Validators.max(59)]]
  });
  }
  
  getErrorMessageHour() {
    return  'please enter a number from 0 to 24';
  }

  getErrorMessageMinuteAndSecond() {
    return  'please enter a number from 0 to 60';
  }

}
