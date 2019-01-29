import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../services/history.service';
import { TaskInfoDialogService } from '../services/task-info-dialog.service';
import { ToasterService } from '../services/toaster.service';
import { Record } from '../models/record.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [HistoryService, TaskInfoDialogService]
})
export class HistoryComponent implements OnInit {

  searchText: string;
  records: Record[] = [
    {
      id: 1,
      name: 'First',
      description: 'azazazaza',
      elapsedTime: 111111,
      startTime: '111111',
      stopTime: '111111',
      action: 'stop',
      taskId: 77,
      userId:20
    },
    {
      id: 2,
      userId:20,
      name: 'Second',
      description: 'uzuzuzu',
      elapsedTime: 22222,
      startTime: '22222',
      stopTime: '22222',
      action: 'pauze',
      taskId: 77
    }
  ]

  constructor(private historyService: HistoryService,
    private service: TaskInfoDialogService,
    private tosterService: ToasterService) { }

  ngOnInit() {
    this.getRecords();
  }

  mouseEnter() {
    console.log("WECJNDFLJDF");
  }

  getRecords() {
    this.historyService.getAllRecords().subscribe(data => this.records = data);
  }

  onInfo(record: Record) {
    this.service.openSheet(record);
  }

  /*onDeleteTask(task: Task): void {
    const observer = {
      error: err => {
        if (err.error instanceof ErrorEvent) {
          this.tosterService.showToaster(err.error.message);
        } else {
          this.tosterService.showToaster('Server error');
        }
      }
    };

    this.historyService.deleteTask(task.id).subscribe(observer);
    const indexTaskToDelete = this.tasks.indexOf(task, 0);
    this.tasks.splice(indexTaskToDelete, 1);
  }

  onResumeTask(task: Task): void {

    const observer = {
      error: err => {
        if (err.error instanceof ErrorEvent) {
          this.tosterService.showToaster(err.error.message);
        } else {
          this.tosterService.showToaster('Server error');
        }
      }
    };
    this.historyService.switchtaskStatus(task).subscribe(observer);
    const indexTaskToDelete = this.tasks.indexOf(task, 0);
    this.tasks.splice(indexTaskToDelete, 1);
  }

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
