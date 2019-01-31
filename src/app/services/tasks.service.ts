import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, throwError } from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { StopwatchService } from './stopwatch.service';

@Injectable({
    providedIn: 'root'
})
export class TasksService implements OnInit {

    public stopwatches: TaskCreateJson[] = [];
    public timers: TaskCreateJson[] = [];

    constructor(private http: HttpClient,
        private service: ConfigService,
        public stopwatchService: StopwatchService
        ) { }
    ngOnInit() { }

    startTask(task: TaskCreateJson) {
        return this.http.put<TaskCreateJson>(this.service.urlTask + 'StartTask', task);
    }
    deleteTask(id: Number) {
        return this.http.delete(this.service.urlTask + 'DeleteTask/' + id.toString(), {});
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
    getTimers(): Observable<TaskJson[]> {
        return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllTimersByUserId');
    }
    getStopwatches(): Observable<TaskJson[]> {
        return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllStopwathesByUserId');
    }
    public getAllTasks(): Observable<TaskJson[]> {
        return this.http.get<TaskJson[]>(this.service.urlGetAllTasks, {});
    }


    public importFile(event: any): Observable<any> {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            if (file.name.split('.').pop() === 'xml') {
                return this.http.post(this.service.urlImportTasksAsXml, formData);
            } else if (file.name.split('.').pop() === 'csv') {
                return this.http.post(this.service.urlImportTasksAsCsv, formData);
            } else {
                return throwError(Error);
            }
        }
    }
    public downloadFile(fileName: string, urlPath: string): void {
        this.http.get(urlPath, { responseType: 'blob' })
            .subscribe(fileData => {
                const a = document.createElement('a');
                a.style.display = 'none';
                const url = window.URL.createObjectURL(fileData);
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            });
    }

    public DisplayTaskOnStopwatchPage(task: TaskCreateJson) {
        this.stopwatchService.task = task.name;
        this.stopwatchService.taskJson = task;
        this.stopwatchService.color = '#609b9b';
        this.stopwatchService.isStopwatchPause = false;
        this.stopwatchService.isStopwatchRun = true;
    }

}
