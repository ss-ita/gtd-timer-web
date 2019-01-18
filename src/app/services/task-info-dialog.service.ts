import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TaskInfoComponent } from '../task-info/task-info.component';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskInfoDialogService {

  constructor(private dialog: MatDialog) { }

  openSheet(task: Task) {
    const dialogRef = this.dialog.open(TaskInfoComponent, {
      hasBackdrop: true,
      closeOnNavigation: true
    });
    dialogRef.componentInstance.task = task;

  }
}
