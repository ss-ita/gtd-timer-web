import { Component } from '@angular/core';
import { AlarmService } from './services/alarm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gtd-timer-web';
  constructor(
    public alarmService: AlarmService) {
      this.alarmService.getAlarmsFromDatabase();
    }
}
