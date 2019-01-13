import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})

export class AlarmService {
  hour = '';
  minute = '';
  timeOut: any;
  alarmOn = false;
  isActive = false;
  isChecked = false;
  color = 'grey';
  colorToggle = 'primary';
  alarmSound = new Audio(this.configService.urlSoundAlarm);

  constructor(private configService: ConfigService) { }

  startArarm() {
    this.alarmOn = true;
    this.color = '#609b9b';
    const ms: number = this.calculateSecond();
    const alarm = new Date(ms);
    const differenceInMs = alarm.getTime() - (new Date().getTime());
    this.timeOut = setTimeout(this.playAlarm.bind(this), differenceInMs);
  }

  calculateSecond() {
    const hours = Number(this.hour);
    const minutes = Number(this.minute);
    const currentTime = new Date();
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    if ((currentTime.getHours() > hours) || (currentTime.getMinutes() >= minutes)) {
      date.setDate(date.getDate() + 1);
    }
    return date.getTime();
  }

  playAlarm() {
    this.alarmSound.loop = true;
    this.alarmSound.play();
    this.isActive = true;
    this.color = 'red';
  }

  dismissAlarm() {
    if (this.isActive) {
      this.alarmSound.pause();
      this.alarmSound.currentTime = 0;
      this.isActive = false;
    } else {
      clearTimeout(this.timeOut);
      this.timeOut = 0;
    }
    this.color = 'grey';
    this.alarmOn = false;
  }

  refresh() {
    this.hour = '';
    this.minute = '';
  }

  switchTimeShow() {
    if (this.isChecked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }

}
