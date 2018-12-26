import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlarmService } from '../services/alarm.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {


  alarmForm: FormGroup;
  hourPattern = /^(2[0-3]|1[0-9]|[1-9]|0)$/;
  minutePattern = /^([1-5]?[0-9]|0)$/;

  constructor(private formBuilder: FormBuilder, private alarmService: AlarmService) {
  }

  ngOnInit() {
    this.alarmForm = this.formBuilder.group({
      'hour': [this.alarmService.hour, [Validators.required, Validators.minLength(1), Validators.pattern(this.hourPattern)]],
      'minute': [this.alarmService.minute, [Validators.required, Validators.minLength(1), Validators.pattern(this.minutePattern)]]
    });
  }

}
