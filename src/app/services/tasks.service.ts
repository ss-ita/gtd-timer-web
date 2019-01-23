import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import { TaskCreateJson } from '../models/taskCreateJson.model';

@Injectable({
    providedIn: 'root'
})
export class TasksService implements OnInit {
    constructor(private http: HttpClient,
        private service: ConfigService) { }
    ngOnInit() { }


    public getAllTasks() {
    

        return this.http.get(this.service.urlGetAllTasks, { });
    }
    getActiveTasksFromServer(): Observable<TaskJson[]> {
        
        return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllActiveTasksByUserId');
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

    resetTask(task: TaskCreateJson) {
        
        return this.http.put<TaskCreateJson>(this.service.urlTask + 'ResetTask/', task);
    }

    createTask(task: TaskCreateJson) {
        
        return this.http.post<TaskCreateJson>(this.service.urlTask + 'CreateTask', task);
    }

    updateTask(task: TaskCreateJson) {
        
        return this.http.put<TaskCreateJson>(this.service.urlTask + 'UpdateTask', task);
    }




}
