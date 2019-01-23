import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import { Task } from '../models/task.model';

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
    return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllArchivedTasksByUserId', {});
  }
  deleteTask(id: Number) {
    return this.http.delete(this.service.urlTask + 'DeleteTask/' + id.toString(), {});
  }

  switchtaskStatus(task: Task) {
    return this.http.put<TaskJson>(this.service.urlTask + 'SwitchArchivedStatus', task.convertToTaskJson(), {});
  }
}
