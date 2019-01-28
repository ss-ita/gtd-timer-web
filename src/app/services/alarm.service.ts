import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { MatDialog } from '@angular/material';
import { AlarmModel } from '../models/alarm.model';
import { ToasterService } from './toaster.service';
import { AlarmCronModel } from '../models/alarm-cron.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlarmDialogNotificationComponent } from '../alarm-components/alarm-dialog-notification/alarm-dialog-notification.component';
import { RepeatAlarmModel } from '../models/repeat-alarm.model';

declare var require: any;

@Injectable({
  providedIn: 'root'
})

export class AlarmService {

  colorTime = 'grey';
  colorToggle = 'primary';
  currentTimeColor = '#9393e2';
  index: number;
  stopAlarm = false;
  showToaster = true;
  isAuthorized = false;
  chosenDaysString = '';
  alarmModel: AlarmModel = null;
  alarmSound = new Audio(this.configService.urlSoundAlarm);
  repeatOptions: string[] = ['Once', 'Daily', 'Mon to Fri'];
  repeatOptionsDay: RepeatAlarmModel[] = [
    { day: 'Monday', value: 'Mon' },
    { day: 'Tuesday', value: 'Tue' },
    { day: 'Wednesday', value: 'Wed' },
    { day: 'Thursday', value: 'Thu' },
    { day: 'Friday', value: 'Fri' },
    { day: 'Saturday', value: 'Sat' },
    { day: 'Sunday', value: 'Sun' }];
  chosenDaysList: boolean[] = [false, false, false, false, false, false, false];
  currentTime: Date = new Date();
  alarmsArray: AlarmModel[] = [];
  startedAlarmsArray: AlarmModel[] = [];

  constructor(
    private configService: ConfigService,
    private toasterService: ToasterService,
    private dialog: MatDialog,
    private httpClient: HttpClient) {
    this.isLoggedIn();

    setInterval(() => {
      this.currentTime = new Date();
    }, 250);

    if (this.isAuthorized && this.alarmsArray.length === 0) {
      this.loadAlarmsFromDatabase();
    }
  }

  createAlarm(alarmModel: AlarmCronModel) {
    return this.httpClient.post<number>(this.configService.urlAlarm + 'CreateAlarm', alarmModel);
  }

  updateAlarm(alarmModel: AlarmCronModel) {
    return this.httpClient.put(this.configService.urlAlarm + 'UpdateAlarm', alarmModel);
  }

  removeAlarm(id: number) {
    return this.httpClient.delete(this.configService.urlAlarm + 'DeleteAlarm/' + id.toString());
  }

  getAllAlarmsFromServer(): Observable<AlarmCronModel[]> {
    return this.httpClient.get<AlarmCronModel[]>(this.configService.urlAlarm + 'GetAllAlarmsByUserId');
  }

  startAlarm(id: number) {
    const alarm = this.findAlarmById(id);
    alarm.date = this.getNextDate(alarm.cronExpression);

    const ms: number = this.calculateSecond(alarm);
    const currentTime = new Date();
    const deadlineTime = new Date();
    deadlineTime.setDate(deadlineTime.getDate() + 21);
    const differenceInMs = (new Date(ms)).getTime() - (currentTime.getTime());

    if (differenceInMs < (deadlineTime.getTime() - currentTime.getTime())) {
      alarm.timeoutIndex = setTimeout(this.playAlarm.bind(this), differenceInMs);
    }
    if (this.showToaster) {
      this.toasterService.showToaster(this.calculateTimeStart(alarm));
    }
    this.setTimeColor();
  }

  findAlarmById(id: number) {
    const modelArray = this.alarmsArray.filter((value) => {
      return value.id == id ? value : null;
    });
    return modelArray[0];
  }

  playAlarm() {
    const alarm = this.findAlarmById(this.alarmModel.id);
    this.alarmSound.loop = true;
    if (alarm.isSound) {
      this.alarmSound.volume = 1;
    } else {
      this.alarmSound.volume = 0;
    }

    alarm.isPlay = true;
    this.alarmSound.play();
    this.colorTime = 'red';
    this.showNotificationWindow(alarm.message);
  }

  stopAlarmPlaying() {
    const id = this.alarmModel.id;
    this.stopAlarm = true;
    this.dismissAlarm(id);
  }

  dismissAlarm(id: number) {
    const alarm = this.findAlarmById(id);
    if (alarm.isPlay) {
      alarm.isPlay = false;

      if (!this.isPlayAlarms()) {
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
      }
    } else {
      clearTimeout(alarm.timeoutIndex);
      alarm.timeoutIndex = -1;
    }

    if (this.stopAlarm) {
      this.showToaster = false;
      const date: Date = this.getNextDate(alarm.cronExpression);
      const currentDate = new Date();
      alarm.date = new Date(date.getTime());
      if (date > currentDate) {
        alarm.isTurnOn = true;
        this.startAlarm(alarm.id);
        this.findFirstTurnOnAlarm();
      } else {
        alarm.isTurnOn = false;
      }
      this.stopAlarm = false;
      this.showToaster = true;
    } else {
      alarm.isTurnOn = false;
    }

    if (alarm.isTurnOn == false && this.isAuthorized) {
      const cronModel = this.convertToCronModelFromAlarmModel(alarm);
      this.updateAlarm(cronModel).subscribe(date => {
      });
    }
    this.setTimeColor();
    this.findFirstTurnOnAlarm();
  }

  isLoggedIn() {
    if (localStorage.getItem('access_token') === null) {
      this.isAuthorized = false;
      return false;
    } else {
      this.isAuthorized = true;
      return true;
    }
  }

  loadAlarmsFromDatabase() {
    this.clearData();
    this.getAllAlarmsFromServer().subscribe(data => {
      data.forEach(value => {
        const alarmModel = this.convertToAlarmModelFronCronModel(value);
        this.alarmsArray.push(alarmModel);
      });
      this.startLoadedAlarms();
    });
  }

  setTimeColor() {
    if (this.isTurnOnAlarms() && !this.alarmModel.isPlay) {
      this.colorTime = '#609b9b';
    } else if (this.isTurnOnAlarms() && this.alarmModel.isPlay) {
      this.colorTime = 'red';
    } else {
      this.colorTime = 'grey';
    }
  }

  deleteAlarm(index: number) {
    const alarm: AlarmModel = this.alarmsArray[index];

    if (alarm.timeoutIndex != -1) {
      clearTimeout(alarm.timeoutIndex);
    }

    if (this.isAuthorized) {
      this.removeAlarm(alarm.id).subscribe();
    }

    this.alarmsArray.splice(index, 1);
    this.findFirstTurnOnAlarm();
  }

  clearData() {
    this.isLoggedIn();
    this.alarmsArray = [];
    if (this.startedAlarmsArray.length !== 0) {
      this.startedAlarmsArray.forEach(value => {
        clearTimeout(value.timeoutIndex);
      });
      this.startedAlarmsArray = [];
    }
    this.alarmModel = null;
  }

  calculateSecond(model: AlarmModel) {
    const currentTime = new Date();
    const date = new Date(model.date.getTime());

    if (date.getTime() < (currentTime.getTime())) {
      if (model.date.getHours() < (currentTime.getHours())) {
        date.setDate(currentTime.getDate() + 1);
        model.date.setDate(date.getDate());
      } else if (model.date.getHours() == (currentTime.getHours()) && model.date.getMinutes() <= (currentTime.getMinutes())) {
        date.setDate(currentTime.getDate() + 1);
        model.date.setDate(date.getDate());
      } else {
        date.setDate(currentTime.getDate());
        model.date.setDate(date.getDate());
      }
    }
    return date.getTime();
  }

  findFirstTurnOnAlarm() {
    if (this.isTurnOnAlarms()) {
      this.startedAlarmsArray.sort((a, b) => {
        if (this.calculateSecond(a) < (this.calculateSecond(b))) {
          return -1;
        }
        if (this.calculateSecond(a) > (this.calculateSecond(b))) {
          return 1;
        }
        return 0;
      });
      this.alarmModel = this.copyAlarmModel(this.startedAlarmsArray[0]);
    } else {
      this.alarmModel = null;
    }
  }

  findTurnOnAlarms() {
    this.startedAlarmsArray = this.alarmsArray.filter(value => {
      return value.isTurnOn == true;
    });
  }

  isTurnOnAlarms(): boolean {
    this.findTurnOnAlarms();
    if (this.startedAlarmsArray.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  isPlayAlarms() {
    const array = this.alarmsArray.filter(value => {
      return value.isPlay == true;
    });

    if (array.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  startLoadedAlarms() {
    if (this.alarmsArray.length != 0 && this.isTurnOnAlarms()) {
      this.showToaster = false;
      this.alarmsArray.forEach((value, index) => {
        if (value.isTurnOn) {
          const date = this.getNextDate(value.cronExpression);
          const currentDate = new Date();
          this.alarmsArray[index].date = new Date(date.getTime());
          if (date > currentDate) {
            if (this.isTurnOnAlarms.length == 0) {
              this.findFirstTurnOnAlarm();
            }
            this.startAlarm(value.id);
          } else {
            this.alarmsArray[index].isTurnOn = false;
            const cronModel = this.convertToCronModelFromAlarmModel(this.alarmsArray[index]);
            this.updateAlarm(cronModel).subscribe();
            this.findFirstTurnOnAlarm();
          }
        }
      });
      this.findFirstTurnOnAlarm();
      this.showToaster = true;
    }
  }

  switchAlarmState(id: number) {
    this.findFirstTurnOnAlarm();
    const model = this.findAlarmById(id);
    if (model.isTurnOn) {
      const cronModel = this.convertToCronModelFromAlarmModel(model);
      console.log(cronModel);
      if (this.isAuthorized) {
        cronModel.cronExpression = this.refreshCronExpression(cronModel.cronExpression);
        console.log(cronModel);
        this.updateAlarm(cronModel).subscribe();
      }
      this.startAlarm(id);
    } else {
      this.dismissAlarm(id);
    }
  }

  refreshCronExpression(cronExpression: string): string {
    let newCronExpression = '';
    if (!cronExpression.includes('*')) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1);
      newCronExpression = this.convertToCronExpression(nextDate, this.repeatOptions[0]);
    } else {
      newCronExpression = cronExpression;
    }
    return newCronExpression;
  }

  chooseAlarmAction(model: AlarmModel) {
    const alarm = this.copyAlarmModel(model);
    if (this.isAuthorized) {
      const cronModel = this.convertToCronModelFromAlarmModel(alarm);
      if (alarm.id === -10) {
        this.alarmsArray.push(alarm);
        this.createAlarm(cronModel).subscribe(date => {
          const alarmModel = this.findAlarmById(-10);
          alarmModel.id = date;
          this.findFirstTurnOnAlarm();
        });
      } else {
        this.updateAlarm(cronModel).subscribe();
        const index = this.alarmsArray.findIndex(value => {
          return value.id == alarm.id;
        });
        this.alarmsArray[index] = alarm;
      }
    } else {
      if (alarm.id === -10) {
        alarm.id = 1;
      }
      if (this.alarmsArray.length === 0) {
        this.alarmsArray.push(alarm);
      } else {
        this.dismissAlarm(1);
        this.alarmsArray.splice(0, 1);
        this.alarmsArray.push(alarm);
      }
    }
    this.findFirstTurnOnAlarm();
    this.startAlarm(alarm.id);
  }

  copyAlarmModel(alarmModel: AlarmModel): AlarmModel {
    const alarm = new AlarmModel();
    const nextDate = this.getNextDate(alarmModel.cronExpression);
    alarm.isSound = alarmModel.isSound;
    alarm.isTurnOn = alarmModel.isTurnOn;
    alarm.isPlay = alarmModel.isPlay;
    alarm.repeat = alarmModel.repeat;
    alarm.message = alarmModel.message;
    alarm.timeoutIndex = alarmModel.timeoutIndex;
    alarm.id = alarmModel.id;
    alarm.date = nextDate;
    alarm.cronExpression = alarmModel.cronExpression;
    return alarm;
  }

  convertToAlarmModelFronCronModel(cronModel: AlarmCronModel): AlarmModel {
    const alarm = new AlarmModel();
    const nextDate = this.getNextDate(cronModel.cronExpression);
    alarm.isSound = cronModel.isSound;
    alarm.isTurnOn = cronModel.isTurnOn;
    alarm.isPlay = false;
    alarm.repeat = '';
    alarm.message = cronModel.message;
    alarm.timeoutIndex = -1;
    alarm.id = cronModel.id;
    alarm.date = new Date(nextDate.getTime());
    alarm.cronExpression = cronModel.cronExpression;
    return alarm;
  }

  convertToCronModelFromAlarmModel(alarmModel: AlarmModel): AlarmCronModel {
    const alarm = new AlarmCronModel();
    if (alarmModel.id == -10) {
      alarm.id = 0;
    } else {
      alarm.id = alarmModel.id;
    }
    alarm.cronExpression = alarmModel.cronExpression;
    alarm.isSound = alarmModel.isSound;
    alarm.isTurnOn = alarmModel.isTurnOn;
    alarm.message = alarmModel.message;
    return alarm;
  }

  calculateTimeStart(alarmModel: AlarmModel) {
    const currentDate = new Date();
    const startAlarmSecond = 60;
    const differentSecond = startAlarmSecond - currentDate.getSeconds();
    let differentMinute = alarmModel.date.getMinutes() - currentDate.getMinutes() - 1;
    let differentHour = alarmModel.date.getHours() - currentDate.getHours();
    let differentDay = alarmModel.date.getDate() - currentDate.getDate();

    if (differentMinute < 0) {
      differentMinute += 60;
      differentHour -= 1;
    }

    if (differentHour < 0) {
      differentHour += 24;
      differentDay -= 1;
    }

    if (differentDay < 0) {
      differentDay += 31;
    }

    let message = `Alarm will go off in `;

    if (differentDay !== 0) {
      message += `${differentDay} days `;
    }
    if (differentHour !== 0) {
      message += `${differentHour} hours `;
    }
    if (differentMinute !== 0) {
      message += `${differentMinute} minutes `;
    }

    message += `${differentSecond} seconds `;

    return message;
  }

  convertToCronExpression(date: Date, repeat: string): string {
    const seconds = 0;
    const minutes = date.getMinutes();
    const hours = date.getHours();
    let dayOfMonth = '*';
    let month = '*';
    let dayOfWeek = '?';
    let year = '*';
    const daysArray = repeat.split(' ');

    if (repeat === this.repeatOptions[0]) {
      dayOfMonth = (date.getDate()).toString();
      month = (date.getMonth() + 1).toString();
      year = date.getFullYear().toString();
    } else if ((repeat === this.repeatOptions[1]) || (daysArray.length == 7)) {

    } else if (repeat == this.repeatOptions[2]) {
      let chosenDays = '';
      this.repeatOptionsDay.forEach((value, index) => {
        if (index < 5) {
          chosenDays += this.repeatOptionsDay[index].value;
          chosenDays += ',';
        }
      });
      chosenDays = chosenDays.replace(/,\s*$/, '');
      dayOfWeek = chosenDays;
    } else {
      dayOfWeek = daysArray.join(',');
    }

    const cronExpression: string = seconds + ' ' + minutes + ' ' + hours + ' ' + dayOfMonth + ' ' + month + ' ' + dayOfWeek + ' ' + year;

    return cronExpression;
  }

  getNextDate(expression: string): Date {
    const parser = require('cron-parser');
    const cronElementsArray = expression.split(' ');
    const options = {
      iterator: true
    };

    if (!cronElementsArray.includes('*')) {
      const startDate = new Date(Number(cronElementsArray[6]), (Number(cronElementsArray[4]) - 1), Number(cronElementsArray[3]));
      const finishDate = new Date(startDate.getTime());
      finishDate.setDate(startDate.getDate() + 1);
      options['currentDate'] = startDate;
      options['endDate'] = finishDate;
    }

    const interval = parser.parseExpression(expression, options);
    const date = interval.next();
    const nextDate = new Date(date.value.toString());

    return nextDate;
  }

  showNotificationWindow(message: string) {
    const notificationDialogWindow = this.dialog.open(AlarmDialogNotificationComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      data: {
        message: message
      }
    });

    notificationDialogWindow.afterClosed().subscribe(
      _ => this.stopAlarmPlaying()
    );
  }

  convertDaysToString() {
    let chosenDays = '';
    this.chosenDaysList.forEach((value, index) => {
      if (value == true) {
        chosenDays += this.repeatOptionsDay[index].value;
        chosenDays += ' ';
      }
    });

    chosenDays = chosenDays.trim();
    this.chosenDaysString = chosenDays;
  }

  resetData() {
    this.chosenDaysString = '';
    this.chosenDaysList = this.chosenDaysList.map(_ => {
      return false;
    });
  }
}
