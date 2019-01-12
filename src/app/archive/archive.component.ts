import { Component, OnInit } from '@angular/core';
import { TaskJson } from '../models/taskjson.model';
import { ArchiveService } from '../services/archive.service';
import { TaskInfoDialogComponent } from '../task-info-dialog/task-info-dialog.component';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css'],
  providers: [ArchiveService, TaskInfoDialogComponent]
})
export class ArchiveComponent implements OnInit {

  searchText: string;
  tasksJson: TaskJson[] = [];
  tasks: Task[] = [];

  constructor(private archiveService: ArchiveService,
    private service: TaskInfoDialogComponent) { }

  ngOnInit() {
    this.getTasks();
  }

  onDeleteTask(task: Task): void {
    this.archiveService.deleteTask(task.id).subscribe();
    let indexTaskToDelete = this.tasks.indexOf(task, 0);
    this.tasks.splice(indexTaskToDelete, 1);
  }

  onResumeTask(task: Task): void {
    this.archiveService.switchtaskStatus(task).subscribe();
    let indexTaskToDelete = this.tasks.indexOf(task, 0);
    this.tasks.splice(indexTaskToDelete, 1);
  }

  onInfo(task: Task) {
    this.service.openSheet(task);
  }

  getTasks() {
    this.archiveService.getArchivedTasksFromServer().subscribe(data => {
      for (let i = 0; i < data.length; ++i) {
        this.tasks.push(new Task());
        this.tasks[i].convertFromTaskJson(data[i]);
      }
    });
  }
}
