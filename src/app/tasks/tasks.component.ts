import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ArchiveService } from '../services/archive.service';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { StopwatchService } from '../services/stopwatch.service';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [ArchiveService]
})
export class TasksComponent implements OnInit {

  readonly progress: Observable<number>;

  constructor(
    private archiveService: ArchiveService,
    public stopwatchService: StopwatchService,
    public timerService: TimerService
  ) {
    this.progress = this.emulateProgress();
  }


  public tasks: TaskCreateJson[] = [];
  taskName: String;
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
      id: 0,
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
    this.tasks.push(taskToPass);
  }

  filterByProperty(propertyName: string) {
    this.tasks = this.tasks.sort((a, b) => {
      switch (propertyName) {
        case 'name': return this.compare(a.name, b.name);
      }
    });
  }

  compare(a: String, b: String) {
    return (a.toLowerCase() < b.toLowerCase() ? -1 : 1);
  }

  resetTask(task: TaskCreateJson) {
    this.archiveService.resetTask(task.id).subscribe();
  }

  deleteTask(task: TaskCreateJson) {
    this.archiveService.switchTaskStatus(task).subscribe();
    const indexTaskToDelete = this.tasks.indexOf(task, 0);
    this.tasks.splice(indexTaskToDelete, 1);
  }
  startTask(task: TaskCreateJson) {
    this.archiveService.startTask(task).subscribe();
    this.stopwatchService.start();
  }
  pauseTask(task: TaskCreateJson) {
    this.archiveService.pauseTask(task).subscribe();
    this.stopwatchService.clickOnStopWatch();
  }

  getActiveTasks() {
    this.archiveService.getActiveTasksFromServer().subscribe(data => {
      this.tasks = [];
      for (let i = 0; i < data.length; ++i) {
        this.tasks.push(data[i]);
      }
    });
  }
}

