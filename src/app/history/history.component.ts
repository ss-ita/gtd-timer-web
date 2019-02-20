import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../services/history.service';
import { TaskInfoDialogService } from '../services/task-info-dialog.service';
import { ToasterService } from '../services/toaster.service';
import { Record } from '../models/record.model';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TasksService } from '../services/tasks.service';
import { ConfigService } from '../services/config.service';
import { PagerService } from '../services/pager.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [HistoryService, TaskInfoDialogService]
})
export class HistoryComponent implements OnInit {

  searchText: string;
  selected = "All";
  records: Record[];
  recordsToDisplay: Record[];
  isStopwatch = 2;
  pagedRecords: Record[];
  recordsToDisplayPager: any = {};
  pageSizeRecords: number = 10;
  public pageSizes: any = [
    { "id": 5, "value": 5 },
    { "id": 10, "value": 10 },
    { "id": 25, "value": 25 },
    { "id": "Display all", "value": Number.MAX_VALUE }
  ];

  constructor(private historyService: HistoryService,
    private service: TaskInfoDialogService,
    private tosterService: ToasterService,
    private matDialog: MatDialog,
    private taskService: TasksService,
    private configService: ConfigService,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.getRecords();
  }

  setRecordsPage(page: number) {
    this.recordsToDisplayPager = this.pagerService.getPager(this.recordsToDisplay.length, page, this.pageSizeRecords);
    this.pagedRecords = this.recordsToDisplay.slice(this.recordsToDisplayPager.startIndex, this.recordsToDisplayPager.endIndex + 1);
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

  changeType(num: number) {
    this.isStopwatch = num;
    if (this.isStopwatch === 1) {
      this.recordsToDisplay = [... this.records.filter(it => it.watchType === 0)];
      this.selected = "Stopwatches";
    } else if (this.isStopwatch === 0) {
      this.recordsToDisplay = [... this.records.filter(it => it.watchType === 1)];
      this.selected = "Timers";
    } else {
      this.recordsToDisplay = [...this.records];
      this.selected = "All";
    }

    this.setRecordsPage(1);
  }

  getRecords() {
    this.historyService.getAllRecords().subscribe(data => { this.records = data; this.recordsToDisplay = [...this.records]; this.setRecordsPage(1); });
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

    if (this.pagedRecords.length > 1) {
      this.setRecordsPage(this.recordsToDisplayPager.currentPage);
    }
    else {
      this.setRecordsPage(this.recordsToDisplayPager.currentPage - 1);
    }
  }

  onDeleteRecord(record: Record) {
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

          for(let i = 0;i<data.length;++i){
          let r = data[i];
          let toDelete = this.recordsToDisplay.filter((rec) => { return rec.id == r.id });
          let indexToDelete = this.recordsToDisplay.indexOf(toDelete[0]);
          if (indexToDelete > -1)
            this.recordsToDisplay.splice(indexToDelete, 1);
          }
          for(let i = 0;i<data.length;++i){
          this.recordsToDisplay.push(data[i]);
          }

          for(let i = 0;i<data.length;++i){
          let r = data[i];
          let toDelete = this.records.filter((rec) => { return rec.id == r.id });
          let indexToDelete = this.records.indexOf(toDelete[0]);
          if (indexToDelete > -1)
            this.records.splice(indexToDelete, 1);
          }

          for(let i = 0;i<data.length;++i){
          this.records.push(data[i]);
          }

          this.setRecordsPage(Math.ceil(this.recordsToDisplay.length / this.pageSizeRecords));
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

    this.historyService.resetAndStartTask(record.id).subscribe(observer);
  }

  openWarningDialog(record: Record) {
    const warningDialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    warningDialogRef.componentInstance.title = 'Confirmation';
    if (record.watchType == 1) {
      warningDialogRef.componentInstance.message = 'This timer will be reset or create new one if it doesn\'t exist!';
    } else {
      warningDialogRef.componentInstance.message = 'This stopwatch will be reset or create new one if it doesn\'t exist!';
    }
    warningDialogRef.componentInstance.btnCancelText = 'Cancel';
    warningDialogRef.componentInstance.btnOkText = 'Confirm';
    warningDialogRef.componentInstance.acceptAction = () => {
      this.resumeTask(record);
    };

  }
}
