import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { StopwatchService } from './stopwatch.service';

@Injectable({
    providedIn: 'root'
})
export class TasksService implements OnInit {

    public tasks: TaskCreateJson[] = [];

    constructor(private http: HttpClient,
        private service: ConfigService,
        private stopwatchService: StopwatchService) { }
    ngOnInit() { }


    public getAllTasks() {
        return this.http.get(this.service.urlGetAllTasks, {});
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

    public addTaskFromStopwatch() {
        const taskToPass: TaskCreateJson = {
            id: 0,
            name: '',
            description: '',
            elapsedTime: this.stopwatchService.ticks * 100,
            goal: '',
            lastStartTime: '0001-01-01T00:00:00Z',
            isActive: true,
            isRunning: true,
            hour: this.stopwatchService.hour,
            minutes: this.stopwatchService.minute,
            seconds: this.stopwatchService.second,
            lastStartTimeNumber: 0,
            currentSecond: this.stopwatchService.ticks,
            isStoped: false
        };

        const myObserver = {
            next: x => { },
            error: err => { },
            complete: () => {
                this.getActiveTasksFromServer().subscribe();
            },
        };

        this.createTask(taskToPass).subscribe(myObserver);
        this.tasks.unshift(taskToPass);
    }

    public DisplayTaskOnStopwatchPage(task: TaskCreateJson) {
        this.stopwatchService.hour = task.hour;
        this.stopwatchService.minute = task.minutes;
        this.stopwatchService.second = task.seconds;
        this.stopwatchService.ticks = task.hour * task.minutes * task.seconds;
        this.stopwatchService.isStopwatchPause = true;
        if (task.isRunning) {
            this.stopwatchService.start();
        }
    }

}
