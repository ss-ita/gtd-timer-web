import { Component, OnInit, Injectable } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { TaskInfoComponent } from '../task-info/task-info.component';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-info-dialog',
  templateUrl: './task-info-dialog.component.html',
  styleUrls: ['./task-info-dialog.component.css']
})
@Injectable()
export class TaskInfoDialogComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openSheet(task: Task) {
    const dialogRef = this.dialog.open(TaskInfoComponent, {
      hasBackdrop: true,
      closeOnNavigation: true
    });
    dialogRef.componentInstance.task = task;

  }
}
