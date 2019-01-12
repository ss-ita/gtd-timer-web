import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { ArchiveService } from '../services/archive.service';
import { TaskCreateJson } from '../models/taskCreateJson.model';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [ArchiveService]
})
export class TasksComponent implements OnInit {

  readonly progress: Observable<number>;


  constructor(private archiveService: ArchiveService) { this.progress = this.emulateProgress(); }


  public tasks: Task[] = [];
  taskName;
  public searchText: string;

  emulateProgress() {
    return new Observable<number>(observer => {
      let val = 0;
      const interval = setInterval(() => {
        if (val < 100) {
          val++;
        } else {
          val = 0;
        }

        observer.next(val);
      }, 100);

      return () => {
        clearInterval(interval);
      };
    });
  }

  ngOnInit() {
    this.getActiveTasks();
  }

  addTask() {
    const taskToPass: TaskCreateJson = {
      name: this.taskName,
      description: '',
      elapsedTime: 0,
      goal: '',
      lastStartTime: '0001-01-01T00:00:00Z',
      isActive: true,
      isRunning: false
    };
    const myObserver = {
      next: x => { },
      error: err => { },
      complete: () => {
        this.archiveService.getActiveTasksFromServer().subscribe();
      },
    };
    this.archiveService.createTask(taskToPass).subscribe(myObserver);
  }


  deleteTask(task: Task) {
    this.archiveService.switchtaskStatus(task).subscribe();
    this.getActiveTasks();
  }

  getActiveTasks() {
    this.archiveService.getActiveTasksFromServer().subscribe(data => {
      this.tasks = [];
      for (let i = 0; i < data.length; ++i) {
        this.tasks.push(new Task());
        this.tasks[i].convertFromTaskJson(data[i]);
      }
    });
  }
}
