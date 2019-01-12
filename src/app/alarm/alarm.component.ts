import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlarmService } from '../services/alarm.service';
import { StyleService } from '../services/style.service';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {


  alarmForm: FormGroup;
  hourPattern = /^(2[0-3]|1[0-9]|[0-9]|0)$/;
  minutePattern = /^([1-5]?[0-9]|0)$/;

  constructor(private formBuilder: FormBuilder, public alarmService: AlarmService, public styleService: StyleService) {
  }

  ngOnInit() {
    this.alarmForm = this.formBuilder.group({
      'hour': [this.alarmService.hour, [Validators.required, Validators.min(0), Validators.max(23)]],
      'minute': [this.alarmService.minute, [Validators.required, Validators.min(0), Validators.max(59)]]
    });
  }

}
