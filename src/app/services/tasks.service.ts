import { Injectable, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, throwError } from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { StopwatchService } from './stopwatch.service';
import { TimerService } from './timer.service';
import { ToasterService } from './toaster.service';
import * as signalR from '@aspnet/signalr';

@Injectable({
    providedIn: 'root'
})
export class TasksService implements OnInit {

    stopwatches: TaskCreateJson[] = [];
    timers: TaskCreateJson[] = [];
    milisecondPerSecond = 1000;
    secondPerHour = 3600;
    secondPerMinute = 60;
    @Input() startStopwatchAction: Function;
    @Input() pauseStopwatchAction: Function;
    @Input() resetStopwatchAction: Function;
    @Input() resetTimerAction: Function;
    @Input() createStopwatchAction: Function;
    @Input() createTimerAction: Function;
    @Input() deleteStopwatchAction: Function;
    @Input() deleteTimerAction: Function;
    @Input() updateStopwatchAction: Function;
    @Input() updateTimerAction: Function;
    private hubConnection: signalR.HubConnection;

    constructor(private http: HttpClient,
        private service: ConfigService,
        private stopwatchService: StopwatchService,
        private timerService: TimerService,
        private toasterService: ToasterService
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
                this.toasterService.showToaster('Unsupported file extension!');
                return throwError('Unsupported file extension!');
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

    DisplayTaskOnStopwatchPage(task: TaskCreateJson) {
        this.stopwatchService.task = task.name;
        if (task.isRunning === true) {
            this.stopwatchService.taskJson = task;
            this.stopwatchService.color = '#609b9b';
            this.stopwatchService.isStopwatchPause = false;
            this.stopwatchService.isStopwatchRun = true;
            this.toasterService.showToaster('Displayed on stopwatch page');
        }

        if (task.isRunning === false) {
            this.stopwatchService.taskJson = task;
            this.stopwatchService.color = '#C23A33';
            this.stopwatchService.isStopwatchPause = true;
            this.stopwatchService.isStopwatchRun = false;
            task.hour = Math.floor((task.elapsedTime / this.milisecondPerSecond) / this.secondPerHour);
            task.minutes = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) / this.secondPerMinute);
            task.seconds = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) % this.secondPerMinute);
            this.toasterService.showToaster('Displayed on stopwatch page');
        }
    }

    DisplayTaskOnTimerPage(task: TaskCreateJson) {
        this.timerService.task = task.name;

        if (task.isRunning === true) {
            this.timerService.taskJson = task;
            this.timerService.color = '#609b9b';
            this.timerService.isTimerPause = false;
            this.timerService.isTimerRun = true;
            this.toasterService.showToaster('Displayed on timer page');
        }

        if (task.isRunning === false) {
            this.timerService.taskJson = task;
            this.timerService.color = '#C23A33';
            this.timerService.isTimerPause = true;
            this.timerService.isTimerRun = false;
            task.hour = Math.floor((task.elapsedTime / this.milisecondPerSecond) / this.secondPerHour);
            task.minutes = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) / this.secondPerMinute);
            task.seconds = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) % this.secondPerMinute);
            this.toasterService.showToaster('Displayed on timer page');
        }
    }

    public getAllRecordsCurrentUser() {
        return this.http.get(this.service.urlGetAllRecordsByUserId);
    }

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.service.urlTaskHub, {
                accessTokenFactory: () => localStorage.getItem('access_token'),
                transport: signalR.HttpTransportType.LongPolling
            })
            .build();

        this.hubConnection
            .start()
            .then()
            .catch(err => console.log('Error while starting connection: ' + err));
    }

    public broadcastCreateTask = (data) => {
        this.hubConnection.invoke('CreateTask', data)
            .catch(err => console.error(err));
    }

    public broadcastStartTask = (data) => {
        this.hubConnection.invoke('StartTask', data)
            .catch(err => console.error(err));
    }

    public broadcastPauseTask = (data) => {
        this.hubConnection.invoke('PauseTask', data)
            .catch(err => console.error(err));
    }

    public broadcastDeleteTask = (data) => {
        this.hubConnection.invoke('DeleteTask', data)
            .catch(err => console.error(err));
    }

    public broadcastUpdateTask = (data) => {
        this.hubConnection.invoke('UpdateTask', data)
            .catch(err => console.error(err));
    }

    public broadcastResetTask = (data) => {
        this.hubConnection.invoke('ResetTask', data)
            .catch(err => console.error(err));
    }

    public addCreateTaskListener = () => {
        const self = this;
        this.hubConnection.on('CreateTask', (data) => {
            if (data.watchType === 0) {
                if (self.createStopwatchAction !== undefined) {
                    self.createStopwatchAction(data);
                }
            } else {
                if (self.createTimerAction !== undefined) {
                    self.createTimerAction(data);
                }
            }
        });
    }

    public addStartTaskListener = () => {
        const self = this;
        this.hubConnection.on('StartTask', (data) => {
            const index = this.getIndexOfStopwatches(data);
            if (index !== -1) {
                if (self.startStopwatchAction !== undefined) {
                    self.startStopwatchAction(self.stopwatches[index]);
                }
            }
        });
    }

    public addPauseTaskListener = () => {
        const self = this;
        this.hubConnection.on('PauseTask', (data) => {
            const index = self.getIndexOfStopwatches(data);
            if (index !== -1) {
                if (self.pauseStopwatchAction !== undefined) {
                    self.pauseStopwatchAction(self.stopwatches[index], data);
                }
            }
        });
    }

    public addDeleteTaskListener = () => {
        const self = this;
        this.hubConnection.on('DeleteTask', (data) => {
            let index = this.getIndexOfStopwatchesByTaskId(data);
            if (index !== -1) {
                if (self.deleteStopwatchAction != undefined) {
                    self.deleteStopwatchAction(index);
                }
            } else {
                index = self.getIndexOfTimersByTaskId(data);
                if (index !== -1) {
                    if (self.deleteTimerAction != undefined) {
                        self.deleteTimerAction(index);
                    }
                }
            }
        });
    }

    public addUpdateTaskListener = () => {
        const selt = this;
        this.hubConnection.on('UpdateTask', (data) => {
            if (data.watchType === 0) {
                const index = selt.getIndexOfStopwatches(data);
                if (index !== -1) {
                    if (selt.updateStopwatchAction !== undefined) {
                        selt.updateStopwatchAction(index, data);
                    }
                }
            } else {
                const index = selt.getIndexOfTimers(data);
                if (index !== -1) {
                    if (selt.updateTimerAction !== undefined) {
                        selt.updateTimerAction(index, data);
                    }
                }
            }
        });
    }

    public addResetTaskListener = () => {
        const self = this;
        this.hubConnection.on('ResetTask', (data) => {
            if (data.watchType === 0) {
                const index = self.getIndexOfStopwatches(data);
                if (index !== -1) {
                    if (self.resetStopwatchAction !== undefined) {
                        self.resetStopwatchAction(self.stopwatches[index]);
                    }
                }
            } else {
                const index = self.getIndexOfTimers(data);
                if (index !== -1) {
                    if (self.resetTimerAction !== undefined) {
                        self.resetTimerAction(self.timers[index]);
                    }
                }
            }
        });
    }

    private getIndexOfStopwatches(data: any) {
        const index = this.getIndex(this.stopwatches, data);

        return index;
    }

    private getIndexOfTimers(data: any) {
        const index = this.getIndex(this.timers, data);

        return index;
    }

    private getIndex(array: any, task: any) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === task.id) {
                return i;
            }
        }

        return -1;
    }

    private getIndexOfStopwatchesByTaskId(taskId: number) {
        const index = this.getIndexByTaskId(this.stopwatches, taskId);

        return index;
    }

    private getIndexOfTimersByTaskId(taskId: number) {
        const index =  this.getIndexByTaskId(this.timers, taskId);

        return index;
    }

    private getIndexByTaskId(array: any, taskId: number) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === taskId) {
                return i;
            }
        }

        return -1;
    }
}
