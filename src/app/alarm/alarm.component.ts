import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {

  alarmSound = new Audio();
  time: string = "";
  isTurnOn = false;
  isSounds = true;
  isDisabled = true;
  isPlay = false;
  isCorrectTime = false;
  messageIncorectData: string = "The time has passed, please enter the correct time";
  color = "primary";

  constructor(private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.alarmSound.src = "https://www.freespecialeffects.co.uk/soundfx/animals/cuckoo.wav";
  }

  openSnackBar() {
    this.snackBar.open(this.messageIncorectData, null, {
      duration: 2000,
    });
  }

  setAttributes() {
    let inputTime = document.getElementById('alarmTime');

    if (this.isTurnOn) {
      inputTime.setAttribute('disabled', 'disabled');
    } else {
      inputTime.removeAttribute('disabled');
    }

    if (this.time != "") {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }

    if (this.isPlay) {
      this.cancelAlarm();
      this.isPlay = false;
      this.isCorrectTime = false;
    }
  }

  startAlarm() {
    if (this.isTurnOn && this.time != "") {
      this.setAlarm();
    } else {
      this.isTurnOn = false;
    }
  }

  setAlarm() {
    let ms: number = this.calculateSecund(this.time);
    let alarm = new Date(ms);
    let alarmTime = new Date(alarm.getUTCFullYear(), alarm.getUTCMonth(), alarm.getUTCDate(), (alarm.getUTCHours() + 2), alarm.getUTCMinutes(), alarm.getUTCSeconds());
    alarmTime.setSeconds(0);
    let differenceInMs = alarmTime.getTime() - (new Date().getTime());

    if (differenceInMs < 0) {
      this.openSnackBar();
      setTimeout((() => {
        this.isTurnOn = false;
      }).bind(this), 0);
      this.setAttributes();
    } else {
      this.isCorrectTime = true;
      setTimeout(this.initAlarm.bind(this), differenceInMs);
    }
  }

  cancelAlarm() {
    this.alarmSound.pause();
    this.alarmSound.currentTime = 0;
  }

  calculateSecund(time) {
    if (time.value !== "") {
      let hours = Number(time.split(":")[0]);
      let minutes = Number(time.split(":")[1]);
      let date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date.getTime();
    }
  }

  initAlarm() {
    if (!this.isSounds) {
      this.alarmSound.volume = 0;
    } else {
      this.alarmSound.volume = 1;
    }
    this.playAlarm();
  }

  playAlarm() {
    this.alarmSound.loop = true;
    this.alarmSound.play();
    this.isPlay = true;
  }

}
