import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    const headers = this.getHeaders();
    return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllArchivedTasksByUserId', { headers: headers });
  }
  getActiveTasksFromServer(): Observable<TaskJson[]> {
    const headers = this.getHeaders();
    return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllActiveTasksByUserId', { headers: headers });
  }

  deleteTask(id: Number) {
    const headers = this.getHeaders();
    return this.http.delete(this.service.urlTask + 'DeleteTask/' + id.toString(), { headers: headers });
  }

  switchtaskStatus(task: Task) {
    const headers = this.getHeaders();
    return this.http.put<TaskJson>(this.service.urlTask + 'SwitchArchivedStatus', task.convertToTaskJson(), { headers: headers });
  }

  switchTaskStatus(task: TaskCreateJson) {
    const headers = this.getHeaders();
    return this.http.put<TaskCreateJson>(this.service.urlTask + 'SwitchArchivedStatus', task, { headers: headers });
  }

  startTask(task: TaskCreateJson) {
    const headers = this.getHeaders();
    return this.http.put<TaskCreateJson>(this.service.urlTask + 'StartTask', task, { headers: headers });
  }

  pauseTask(task: TaskCreateJson) {
    const headers = this.getHeaders();
    return this.http.put<TaskCreateJson>(this.service.urlTask + 'PauseTask', task, { headers: headers });
  }

  resetTask(id: Number) {
    const headers = this.getHeaders();
    return this.http.put(this.service.urlTask + 'ResetTask/' + id.toString(), { headers: headers });
  }

  createTask(task: TaskCreateJson) {
    const headers = this.getHeaders();
    return this.http.post<TaskJson>(this.service.urlTask + 'CreateTask', task, { headers: headers });
  }

  updateTask(task: Task) {
    const headers = this.getHeaders();
    return this.http.put<TaskJson>(this.service.urlTask + 'CreateTask', task.convertToTaskJson(), { headers: headers });
  }

  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    return headers;
  }
}