import { Component, OnInit } from '@angular/core';
import { TaskJson } from '../models/taskjson.model';
import { ArchiveService } from '../services/archive.service';
import { Task } from '../models/task.model';
import {TaskInfoDialogService } from '../services/task-info-dialog.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  providers: [ArchiveService, TaskInfoDialogService]
})
export class ArchiveComponent implements OnInit {

  searchText: string;
  tasks: Task[] = [];

  constructor(private archiveService: ArchiveService,
    private service: TaskInfoDialogService,
    private tosterService: ToasterService ) { }

  ngOnInit() {
    this.getTasks();
  }

  onDeleteTask(task: Task): void {
    const observer = {
      error: err => {
        if (err.error instanceof ErrorEvent) {
          this.tosterService.showToaster(err.error.message);
        } else {
          this.tosterService.showToaster('Server error');
        }
      }
    };

    this.archiveService.deleteTask(task.id).subscribe(observer);
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
    this.archiveService.switchtaskStatus(task).subscribe(observer);
    const indexTaskToDelete = this.tasks.indexOf(task, 0);
    this.tasks.splice(indexTaskToDelete, 1);
  }

  onInfo(task: Task) {
    this.service.openSheet(task);
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

    this.archiveService.getArchivedTasksFromServer().subscribe(observer);
  }
}
