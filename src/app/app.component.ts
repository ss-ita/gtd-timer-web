import { Component, AfterViewChecked, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlarmService } from './services/alarm.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'gtd-timer-web';
  showLoader = false;

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  constructor(
    public alarmService: AlarmService,
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef
    ) {
      this.alarmService.getAlarmsFromDatabase();
    }

  ngOnInit(): void {
    this.loaderService.status.subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
}
