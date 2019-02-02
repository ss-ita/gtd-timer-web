import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../services/history.service';
import { TaskInfoDialogService } from '../services/task-info-dialog.service';
import { ToasterService } from '../services/toaster.service';
import { Record } from '../models/record.model';
import {MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import {TimeFilterPipe} from '../pipes/time-filter.pipe';
import { TasksService } from '../services/tasks.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [HistoryService, TaskInfoDialogService]
})
export class HistoryComponent implements OnInit {

  searchText: string;
  records: Record[];
  recordsToDisplay:Record[];
  isStopwatch: number = 2;

  constructor(private historyService: HistoryService,
    private service: TaskInfoDialogService,
    private tosterService: ToasterService,
    private matDialog: MatDialog,
    private timePipe: TimeFilterPipe,
    private taskService: TasksService,
    private configService: ConfigService ) { }

  ngOnInit() {
    this.getRecords();
  }

  mouseEnter() {
    console.log("WECJNDFLJDF");
  }


  exportAllStopwatchRecordsAsXml() {
    this.taskService.downloadFile('stopwatches_history.xml', this.configService.urlExportAllStopwatchesRecordsAsXml);
  }

  exportAllStopwatchRecordsAsCsv() {
    this.taskService.downloadFile('stopwatches_history.csv', this.configService.urlExportAllStopwatchesRecordsAsCsv);
  }

  exportAllTimerRecordsAsXml() {
    this.taskService.downloadFile('timers_history.xml', this.configService.urlExportAllTimersRecordsAsXml);
  }

  exportAllTimerRecordsAsCsv() {
    this.taskService.downloadFile('timers_history.csv', this.configService.urlExportAllTimersRecordsAsCsv);
  }

  exportAllRecordsAsXml() {
    this.taskService.downloadFile('all_history.xml', this.configService.urlExportAllRecordsAsXml);
  }

  exportAllRecordsAsCsv() {
    this.taskService.downloadFile('all_history.csv', this.configService.urlExportAllRecordsAsCsv);
  }

  changeType(num:number){
    this.isStopwatch = num;
    if (this.isStopwatch === 1)
      this.recordsToDisplay = [... this.records.filter(it => {return  it.watchType === 0; })];
    else if (this.isStopwatch === 0)
     this.recordsToDisplay = [... this.records.filter(it => { return it.watchType === 1; })];
    else
      this.recordsToDisplay = this.records;
  }

  getRecords() {
    this.historyService.getAllRecords().subscribe(data => {this.records = data;  this.recordsToDisplay = [...this.records];});
  }

  onInfo(record: Record) {
    this.service.openSheet(record);
  }

  deleteRecord(record: Record): void {
    const observer = {
      error: err => {
        if (err.error instanceof ErrorEvent) {
          this.tosterService.showToaster(err.error.message);
        } else {
          this.tosterService.showToaster('Server error');
        }
      }
    };

    this.historyService.deleteRecord(record.id).subscribe(observer);
    const indexTaskToDelete = this.records.indexOf(record, 0);
    this.records.splice(indexTaskToDelete, 1);
    const indexTaskToDeleteD = this.recordsToDisplay.indexOf(record, 0);
    this.recordsToDisplay.splice(indexTaskToDeleteD, 1);
  }

  onDeleteRecord(record:Record){
    const warningDialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    warningDialogRef.componentInstance.title = 'Confirmation';
      warningDialogRef.componentInstance.message = 'Are you sure to delete this record?';
      warningDialogRef.componentInstance.btnCancelText = 'Cancel';
      warningDialogRef.componentInstance.btnOkText = 'Confirm';
      warningDialogRef.componentInstance.acceptAction = () => {
        this.deleteRecord(record);
      };
  }

  resumeTask(record: Record): void {

    const observer = {
      next: data => {
        if (data) {
          this.records.push(data);
          this.recordsToDisplay.push(data);
        }
      },

      error: err => {
        if (err.error instanceof ErrorEvent) {
          this.tosterService.showToaster(err.error.message);
        } else {
          this.tosterService.showToaster('Server error');
        }
      }
    };
    this.historyService.resetAndStartTask(record.taskId).subscribe(observer);
  }

  openWarningDialog(record: Record) {
    const warningDialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    warningDialogRef.componentInstance.title = 'Confirmation';
    if (record.watchType == 1)
      warningDialogRef.componentInstance.message = 'This timer will be reset!';
    else
      warningDialogRef.componentInstance.message = "This stopwatch will be reset!";
      warningDialogRef.componentInstance.btnCancelText = 'Cancel';
      warningDialogRef.componentInstance.btnOkText = 'Confirm';
      warningDialogRef.componentInstance.acceptAction = () => {
        this.resumeTask(record);
      };

  }
/*
  getTasks() {

    this.tasks = [];
    const observer = {
      next: data => {
        for (let i = 0; i < data.length; ++i) {
          this.tasks.push(new Task());
          this.tasks[i].convertFromTaskJson(data[i]);
        }
      },
      error: err => {
        if (err.error instanceof ErrorEvent) {
          this.tosterService.showToaster(err.error.message);
        } else {
          this.tosterService.showToaster('Server error');
        }
      }
    };

    this.historyService.getArchivedTasksFromServer().subscribe(observer);
  }*/
}
