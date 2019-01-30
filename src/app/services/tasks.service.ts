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

    //public tasks: TaskCreateJson[] = [];
    public stopwatches: TaskCreateJson[] = [];
    public timers: TaskCreateJson[] = [];

    constructor(private http: HttpClient,
        private service: ConfigService,
        private stopwatchService: StopwatchService) { }
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
    public addTaskFromStopwatch() {
        const taskToPass: TaskCreateJson = {
            id: 0,
            name: '',
            description: '',
            elapsedTime: this.stopwatchService.ticks * 1000,
            goal: '',
            lastStartTime: '0001-01-01T00:00:00Z',
            isActive: true,
            isRunning: false,
            hour: this.stopwatchService.hour,
            minutes: this.stopwatchService.minute,
            seconds: this.stopwatchService.second,
            lastStartTimeNumber: 0,
            currentSecond: this.stopwatchService.ticks,
            isStoped: true,
            isCollapsed: true,
            watchType: 0,
            maxValueHour: 0,
            maxValueMinute: 0,
            maxValueSecond: 0,
            isTimerFinished: false,
            goals: 0
        };

        const myObserver = {
            next: _ => { },
            error: _ => { },
            complete: () => {
                this.getStopwatches().subscribe();
            },
        };

        this.stopwatchService.reset();
        this.createTask(taskToPass).subscribe(myObserver);
        this.stopwatches.unshift(taskToPass);
    }

    public DisplayTaskOnStopwatchPage(task: TaskCreateJson) {
        this.stopwatchService.ticks = task.currentSecond;
        this.stopwatchService.hour = Math.floor(this.stopwatchService.ticks / this.stopwatchService.secondPerHour);
        this.stopwatchService.minute = Math.floor((this.stopwatchService.ticks % this.stopwatchService.secondPerHour)
            / this.stopwatchService.secondPerMinute);
        this.stopwatchService.second = Math.floor((this.stopwatchService.ticks % this.stopwatchService.secondPerHour)
            % this.stopwatchService.secondPerMinute);
        this.stopwatchService.isStopwatchRun = true;
        this.stopwatchService.start();
        const indexTaskToDelete = this.stopwatches.indexOf(task, 0);
        this.stopwatches.splice(indexTaskToDelete, 1);
    }






}
