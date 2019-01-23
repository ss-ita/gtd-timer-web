import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import { Task } from '../models/task.model';
import { TaskCreateJson } from '../models/taskCreateJson.model';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService implements OnInit {

  _url = 'assets/data.json';

  constructor(private http: HttpClient,
    private service: ConfigService) { }

  ngOnInit() {
  }

  getArchivedTasksFromServer(): Observable<TaskJson[]> {
    return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllArchivedTasksByUserId');
  }
  getActiveTasksFromServer(): Observable<TaskJson[]> {
    return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllActiveTasksByUserId');
  }

  deleteTask(id: Number) {
    return this.http.delete(this.service.urlTask + 'DeleteTask/' + id.toString());
  }

  switchtaskStatus(task: Task) {
    return this.http.put<TaskJson>(this.service.urlTask + 'SwitchArchivedStatus', task.convertToTaskJson());
  }

  switchTaskStatus(task: TaskCreateJson) {
    return this.http.put<TaskCreateJson>(this.service.urlTask + 'SwitchArchivedStatus', task);
  }

  startTask(task: TaskCreateJson) {
    return this.http.put<TaskCreateJson>(this.service.urlTask + 'StartTask', task);
  }

  pauseTask(task: TaskCreateJson) {
    return this.http.put<TaskCreateJson>(this.service.urlTask + 'PauseTask', task);
  }

  // resetTask(id: Number) {
  //   return this.http.put(this.service.urlTask + 'ResetTask/' + id.toString());
  // }

  createTask(task: TaskCreateJson) {
    return this.http.post<TaskJson>(this.service.urlTask + 'CreateTask', task);
  }

  updateTask(task: Task) {
    return this.http.put<TaskJson>(this.service.urlTask + 'CreateTask', task.convertToTaskJson());
  }

}
