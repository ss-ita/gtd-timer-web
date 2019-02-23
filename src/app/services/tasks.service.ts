import { Injectable, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { timer, Observable, throwError, Subscription } from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { StopwatchService } from './stopwatch.service';
import { TimerService } from './timer.service';
import { ToasterService } from './toaster.service';
import * as signalR from '@aspnet/signalr';
import { Record } from '../models/record.model';
import { HistoryService } from './history.service';
import { PagerService } from './pager.service';

@Injectable({
    providedIn: 'root'
})
export class TasksService implements OnInit {

    public taskName: string;
    stopwatches: TaskCreateJson[] = [];
    timers: TaskCreateJson[] = [];
    milisecondPerMinute = 60000;
    milisecondPerHour = 3600000;
    milisecondPerSecond = 1000;
    secondPerHour = 3600;
    secondPerMinute = 60;
    secondPerSecond = 1;
    ticks = 0;
    stopwatchSubscriptions: Subscription[] = [];
    timersSubscriptions: Subscription[] = [];
    pagedStopwatches: TaskCreateJson[];
    stopwatchPager: any = {};
    pageSizeList = 10;
    pagedTimers: TaskCreateJson[];
    timerPager: any = {};
    subscribe: Subscription;
    createFromStopwatchPage = false;
    updateFromStopwatchPage = false;
    createFromTimerPage = false;
    updateFromTimerPage = false;

    @Input() startStopwatchAction: Function;
    @Input() startTimerAction: Function;
    @Input() pauseStopwatchAction: Function;
    @Input() pauseTimerAction: Function;
    @Input() resetStopwatchAction: Function;
    @Input() resetTimerAction: Function;
    @Input() createStopwatchAction: Function;
    @Input() createFromStopwatchPageAction: Function;
    @Input() updateFromStopwatchPageAction: Function;
    @Input() createFromTimerPageAction: Function;
    @Input() updateFromTimerPageAction: Function;
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
        private toasterService: ToasterService,
        private historyService: HistoryService,
        private pagerService: PagerService,
        private configService: ConfigService
    ) {
        if (this.getIsLoggedIn()) {
            this.startConnection();
            this.initStopwatches().subscribe(() => { this.setStopwatchesPage(1); });
            this.initTimers().subscribe(() => { this.setTimersPage(1); });
        }
    }
    ngOnInit() {
    }

    getIsLoggedIn() {
        return localStorage.getItem('access_token') === null ? false : true;
    }

    updateStopwatchListener(index: number, task: any) {
        this.stopwatches[index].name = task.name;
    }

    addStopwatchListener(task: any) {
        task.hour = 0;
        task.minutes = 0;
        task.seconds = 0;
        this.stopwatches.unshift(this.stopwatchToTaskCreateJson(task));
        this.setStopwatchesPage(1);
    }

    pauseStopwatchListener(task: any, data: any) {
        task.elapsedTime = data.elapsedTime;
        task.currentSecond = data.elapsedTime / this.milisecondPerSecond;
        task.isRunning = false;
        task.isStoped = true;
        task.hour = Math.floor((task.elapsedTime / this.milisecondPerSecond) / this.secondPerHour);
        task.minutes = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) / this.secondPerMinute);
        task.seconds = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) % this.secondPerMinute);
        this.runAfterGet();
    }

    pauseTimerListener(task: any, data: any) {
        task.elapsedTime = data.elapsedTime * this.milisecondPerSecond;
        task.ticksi = data.elapsedTime;
        task.goal = data.goal;
        task.isRunning = false;
        task.isStoped = true;
        task.hour = Math.floor((task.elapsedTime / this.milisecondPerSecond) / this.secondPerHour);
        task.minutes = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) / this.secondPerMinute);
        task.seconds = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) % this.secondPerMinute);
        const time = data.goal.split(':');
        task.maxValueHour = Number(time[0]);
        task.maxValueMinute = Number(time[1]);
        task.maxValueSecond = Number(time[2]);
        task.elapsedTime /= this.milisecondPerSecond;
        this.runAfterGetTimers();
    }

    startTimerListener(task: any, data: any) {
        task.elapsedTime = data.elapsedTime * this.milisecondPerSecond;
        task.ticksi = data.elapsedTime;
        task.goal = data.goal;
        task.isRunning = true;
        task.isStoped = false;
        task.hour = Math.floor((task.elapsedTime / this.milisecondPerSecond) / this.secondPerHour);
        task.minutes = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) / this.secondPerMinute);
        task.seconds = Math.floor(((task.elapsedTime / this.milisecondPerSecond) % this.secondPerHour) % this.secondPerMinute);
        const time = data.goal.split(':');
        task.maxValueHour = Number(time[0]);
        task.maxValueMinute = Number(time[1]);
        task.maxValueSecond = Number(time[2]);
        task.elapsedTime /= this.milisecondPerSecond;
        this.runAfterGetTimers();
    }

    resetStopwatchListener(task: any) {
        task.hour = task.minutes = task.seconds = 0;
        task.elapsedTime = 0;
        task.isStoped = task.isRunning = false;
        this.runAfterGet();
    }

    updateStopwatch(task: TaskCreateJson) {
        task.isCollapsed = true;
        this.broadcastUpdateTask(task);
    }

    setStopwatchesPage(page: number) {
        const tempStopwatchesPager = this.pagerService.getPager(this.stopwatches.length, page, this.pageSizeList);
        this.getStopwatchesForPage(tempStopwatchesPager).subscribe(data => {
            this.pagedStopwatches = data;
            this.stopwatchPager = tempStopwatchesPager;
            this.runAfterGet();
        });
    }

    startTask(task: TaskCreateJson) {
        return this.http.put<TaskCreateJson>(this.service.urlTask + 'StartTask', task);
    }

    startStopwatch(task: TaskCreateJson) {

        if (task.description === this.stopwatchService.description) {
            this.stopwatchService.taskJson = task;
            this.stopwatches.forEach(stopwatch => stopwatch.description = '');
        }

        this.start(task);
        task.lastStartTime = (new Date(Date.now())).toISOString().slice(0, -1);
        this.broadcastStartTask(task);
    }

    start(task: TaskCreateJson) {
        task.isRunning = true;
        task.isStoped = false;

        if (!task.isStoped) {
            this.ticks = task.elapsedTime;
            task.currentSecond = task.elapsedTime / 1000;
            this.stopwatchSubscriptions.push(timer(0, this.milisecondPerSecond).subscribe((x) => {
                if (task.isRunning) {
                    this.updateTime(task);
                }
            }));
        }
        return this.ticks;
    }

    updateTime(task: TaskCreateJson) {
        if (task.isRunning) {
            task.currentSecond++;
            task.hour = Math.floor(task.currentSecond / this.secondPerHour);
            task.minutes = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) / this.secondPerMinute);
            task.seconds = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) % this.secondPerMinute);
        }
    }

    deleteTask(id: Number) {
        return this.http.delete(this.service.urlTask + 'DeleteTask/' + id.toString(), {});
    }

    pauseTask(task: TaskCreateJson) {
        return this.http.put<TaskCreateJson>(this.service.urlTask + 'PauseTask', task);
    }

    pauseStopwatch(task: TaskCreateJson) {

        if (task.description === this.stopwatchService.description) {
            this.stopwatchService.taskJson = task;
        }

        task.isRunning = false;
        task.isStoped = true;
        task.elapsedTime = task.currentSecond * 1000;
        this.broadcastPauseTask(task);
        const timeStart = new Date(task.lastStartTime);
        const timeNow = new Date(new Date(Date.now()).toISOString().slice(0, -1));
        const stop = (new Date(Date.now())).toISOString().slice(0, -1);
        const recordToCreate: Record = {
            id: 0,
            name: task.name,
            description: task.description,
            startTime: task.lastStartTime,
            stopTime: stop,
            elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * this.milisecondPerHour +
                (timeNow.getMinutes() - timeStart.getMinutes()) * this.milisecondPerMinute + (timeNow.getSeconds() -
                    timeStart.getSeconds()) * this.milisecondPerSecond + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
            watchType: task.watchType,
            action: 'Pause',
            taskId: task.id,
            userId: 0
        };
        this.historyService.createRecord(recordToCreate).subscribe();
        this.runAfterGet();
    }

    resetTask(task: TaskCreateJson) {
        return this.http.put<TaskCreateJson>(this.service.urlTask + 'ResetTask/', task);
    }

    resetStopwatch(task: TaskCreateJson) {
        task.hour = task.minutes = task.seconds = 0;
        task.elapsedTime = 0;
        task.isStoped = task.isRunning = false;
        this.broadcastResetTask(task);
        this.runAfterGet();
        const timeStart = new Date(task.lastStartTime);
        const timeNow = new Date(new Date(Date.now()).toISOString().slice(0, -1));
        const stop = new Date(Date.now()).toISOString().slice(0, -1);
        const recordToCreate: Record = {
            id: 0,
            name: task.name,
            description: task.description,
            startTime: task.lastStartTime,
            stopTime: stop,
            elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * this.milisecondPerHour + (timeNow.getMinutes() - timeStart.getMinutes()) *
                this.milisecondPerMinute + (timeNow.getSeconds() - timeStart.getSeconds()) * this.milisecondPerSecond + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
            watchType: task.watchType,
            action: 'Reset',
            taskId: task.id,
            userId: 0
        };
        this.historyService.createRecord(recordToCreate).subscribe();
    }

    createTask(task: TaskCreateJson) {
        return this.http.post<TaskCreateJson>(this.service.urlTask + 'CreateTask', task);
    }

    addStopwatch() {
        const taskToPass: TaskCreateJson = {
            id: 0,
            name: this.taskName,
            description: '',
            elapsedTime: 0,
            goal: '',
            lastStartTime: '0001-01-01T00:00:00Z',
            isRunning: false,
            hour: 0,
            minutes: 0,
            seconds: 0,
            currentSecond: 0,
            isCollapsed: true,
            isShowed: true,
            isStoped: false,
            watchType: 0,
            maxValueHour: 0,
            maxValueMinute: 0,
            maxValueSecond: 0,
            isTimerFinished: false,
            goals: 0,
            ticksi: 0
        };
        this.broadcastCreateTask(taskToPass);
        this.taskName = '';
    }

    updateTask(task: TaskCreateJson) {
        return this.http.put<TaskCreateJson>(this.service.urlTask + 'UpdateTask', task);
    }

    getTimers(start: number = 0, length: number = Number.MAX_SAFE_INTEGER): Observable<TaskJson[]> {
        return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllTimersByUserId',
            {
                params: {
                    start: start.toString(),
                    length: length.toString()
                }
            });
    }

    getStopwatches(start: number = 0, length: number = Number.MAX_SAFE_INTEGER): Observable<TaskJson[]> {
        return this.http.get<TaskJson[]>(this.service.urlTask + 'GetAllStopwatchesByUserId',
            {
                params: {
                    start: start.toString(),
                    length: length.toString()
                }
            });
    }

    getStopwatchesMass() {
        const observer = {
            next: data => {
                this.stopwatches = [];
                for (let i = data.length - 1; i >= 0; --i) {
                    const toPush: TaskCreateJson = {
                        id: data[i].id,
                        name: data[i].name,
                        description: data[i].description,
                        goal: data[i].goal,
                        elapsedTime: data[i].elapsedTime,
                        lastStartTime: data[i].lastStartTime,
                        isRunning: data[i].isRunning,
                        watchType: data[i].watchType,
                        hour: Math.floor((data[i].elapsedTime / this.milisecondPerSecond) / this.secondPerHour),
                        minutes: Math.floor(((data[i].elapsedTime / this.milisecondPerSecond) % this.secondPerHour) / this.secondPerMinute),
                        seconds: Math.floor(((data[i].elapsedTime / this.milisecondPerSecond) % this.secondPerHour) % this.secondPerMinute),
                        isStoped: false,
                        currentSecond: 0,
                        isCollapsed: true,
                        isShowed: true,
                        maxValueHour: 0,
                        maxValueMinute: 0,
                        maxValueSecond: 0,
                        isTimerFinished: false,
                        goals: 0,
                        ticksi: 0
                    };
                    this.stopwatches.push(toPush);
                }
                this.setStopwatchesPage(1);
            },
            complete: () => { this.runAfterGet(); }
        };
        this.getStopwatches().subscribe(observer);
    }

    runAfterGet() {
        this.stopwatchSubscriptions.forEach(s => s.unsubscribe());
        this.stopwatchSubscriptions = [];
        for (let i = 0; i < this.pagedStopwatches.length; ++i) {
            if (this.pagedStopwatches[i] && this.pagedStopwatches[i].isRunning) {
                this.start1(this.pagedStopwatches[i]);
            }
        }
    }

    runAfterGetTimers() {
        this.timersSubscriptions.forEach(s => s.unsubscribe());
        this.timersSubscriptions = [];
        for (let i = 0; i < this.pagedTimers.length; ++i) {
            if (this.pagedTimers[i] && this.pagedTimers[i].isRunning) {
                this.startTimeTimer(this.pagedTimers[i]);
            }
        }
    }

    start1(task: TaskCreateJson) {
        task.isRunning = true;
        if (!task.isStoped) {
            const timeStart = new Date(task.lastStartTime);
            const timeNow = new Date(new Date(Date.now()).toISOString().slice(0, -1));
            const elapsedTimeMoq = ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
                60000 + (timeNow.getSeconds() - timeStart.getSeconds()) * 1000 + (timeNow.getMilliseconds() - timeStart.getMilliseconds()));
            this.ticks = elapsedTimeMoq;
            task.currentSecond = (elapsedTimeMoq + task.elapsedTime) / 1000;
            this.stopwatchSubscriptions.push(timer(0, this.milisecondPerSecond).subscribe((x) => {
                if (task.isRunning) {
                    this.updateTime(task);
                }
            }));
        }
        return this.ticks;
    }

    initTimers(): Observable<any> {
        return new Observable(observer => {
            const request = this.http.get(this.service.urlGetTimersCount);
            request.subscribe((res: number) => {
                this.timers = Array<TaskCreateJson>(res).fill(undefined);
                observer.next();
            });
        });
    }

    initStopwatches(): Observable<any> {
        return new Observable(observer => {
            const request = this.http.get(this.service.urlGetStopwatchesCount);
            request.subscribe((res: number) => {
                this.stopwatches = Array<TaskCreateJson>(res).fill(undefined);
                observer.next();
            });
        });
    }

    getTimersForPage(pager: any): Observable<TaskCreateJson[]> {
        return new Observable<TaskCreateJson[]>(observer => {
            let request = undefined;
            const paged = this.timers.slice(pager.startIndex, pager.endIndex + 1);
            if (paged.indexOf(undefined) === -1) {
                observer.next(paged);
            } else {
                const start = pager.startIndex + paged.indexOf(undefined);
                const end = pager.startIndex + paged.lastIndexOf(undefined);
                const length = end - start + 1;
                const revStart = this.timers.length - end - 1;
                request = this.getTimers(revStart, length);
                request.subscribe(data => {
                    let i = end;
                    for (let task of data) {
                        this.timers[i] = this.timerToTaskCreateJson(task);
                        this.timers[i].hour = Math.floor(task.elapsedTime / this.secondPerHour);
                        this.timers[i].minutes = Math.floor((task.elapsedTime % this.secondPerHour) / this.secondPerMinute);
                        this.timers[i].seconds = Math.floor((task.elapsedTime % this.secondPerHour) % this.secondPerMinute);
                        --i;
                    }
                    const paged = this.timers.slice(pager.startIndex, pager.endIndex + 1);
                    observer.next(paged);
                });
            }

            return {
                unsubscribe() {
                    if (request !== undefined) {
                        request.unsubscribe();
                    }
                }
            };
        });
    }

    getStopwatchesForPage(pager: any): Observable<TaskCreateJson[]> {
        return new Observable<TaskCreateJson[]>(observer => {
            let request = undefined;
            const paged = this.stopwatches.slice(pager.startIndex, pager.endIndex + 1);
            if (paged.indexOf(undefined) === -1) {
                observer.next(paged);
            } else {
                const start = pager.startIndex + paged.indexOf(undefined);
                const end = pager.startIndex + paged.lastIndexOf(undefined);
                const length = end - start + 1;
                const revStart = this.stopwatches.length - end - 1;
                request = this.getStopwatches(revStart, length);
                request.subscribe(data => {
                    let i = end;
                    for (let task of data) {
                        this.stopwatches[i] = this.stopwatchToTaskCreateJson(task);
                        --i;
                    }
                    const paged = this.stopwatches.slice(pager.startIndex, pager.endIndex + 1);
                    observer.next(paged);
                });
            }

            return {
                unsubscribe() {
                    if (request !== undefined) {
                        request.unsubscribe();
                    }
                }
            };
        });
    }

    stopwatchToTaskCreateJson(task: TaskJson): TaskCreateJson {
        let taskCreateJson: TaskCreateJson = {
            id: task.id,
            name: task.name,
            description: task.description,
            goal: task.goal,
            elapsedTime: task.elapsedTime,
            lastStartTime: task.lastStartTime,
            isRunning: task.isRunning,
            watchType: task.watchType,
            hour: Math.floor((task.elapsedTime / 1000) / this.secondPerHour),
            minutes: Math.floor(((task.elapsedTime / 1000) % this.secondPerHour) / this.secondPerMinute),
            seconds: Math.floor(((task.elapsedTime / 1000) % this.secondPerHour) % this.secondPerMinute),
            isStoped: false,
            currentSecond: 0,
            isCollapsed: true,
            maxValueHour: 0,
            maxValueMinute: 0,
            maxValueSecond: 0,
            isTimerFinished: false,
            goals: 0,
            ticksi: 0,
            isShowed: true
        };

        return taskCreateJson;
    }

    timerToTaskCreateJson(task: TaskJson): TaskCreateJson {
        let taskCreateJson: TaskCreateJson = {
            id: task.id,
            name: task.name,
            description: task.description,
            goal: task.goal,
            elapsedTime: task.elapsedTime,
            lastStartTime: task.lastStartTime,
            isRunning: task.isRunning,
            watchType: task.watchType,
            hour: Math.floor((task.elapsedTime / 1000) / this.secondPerHour),
            minutes: Math.floor(((task.elapsedTime / 1000) % this.secondPerHour) / this.secondPerMinute),
            seconds: Math.floor(((task.elapsedTime / 1000) % this.secondPerHour) % this.secondPerMinute),
            isStoped: false,
            currentSecond: 0,
            isCollapsed: true,
            maxValueHour: 0,
            maxValueMinute: 0,
            maxValueSecond: 0,
            isTimerFinished: false,
            goals: 0,
            ticksi: 0,
            isShowed: true
        };

        if (taskCreateJson.goal != null) {
            const time = taskCreateJson.goal.split(':');
            taskCreateJson.maxValueHour = Number(time[0]);
            taskCreateJson.maxValueMinute = Number(time[1]);
            taskCreateJson.maxValueSecond = Number(time[2]);
        }

        taskCreateJson.goals = ((taskCreateJson.maxValueHour * this.secondPerHour) + (taskCreateJson.maxValueMinute * this.secondPerMinute)
            + (taskCreateJson.maxValueSecond * this.secondPerSecond));

        return taskCreateJson;
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
        this.stopwatches.forEach(stopwatch => stopwatch.description = '');
        task.description = this.stopwatchService.description;
        this.stopwatchService.taskJson = task;
        this.toasterService.showToaster('Displayed on stopwatch page');
    }

    DisplayTaskOnTimerPage(task: TaskCreateJson) {
        this.timers.forEach(timer => timer.description = '');
        task.description = this.timerService.description;
        this.timerService.taskJson = task;
        this.toasterService.showToaster('Displayed on stopwatch page');
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
            if (this.createFromStopwatchPage) {
                if (self.createFromStopwatchPageAction) {
                    self.createFromStopwatchPageAction(data);
                }
            } else if (this.createFromTimerPage) {
                if (self.createFromTimerPageAction) {
                    self.createFromTimerPageAction(data);
                }
            } else {
                if (data.watchType === 0) {
                    if (self.createStopwatchAction) {
                        self.createStopwatchAction(data);
                    }
                } else {
                    if (self.createTimerAction) {
                        self.createTimerAction(data);
                    }
                }
            }
        });
    }

    public addStartTaskListener = () => {
        const self = this;
        this.hubConnection.on('StartTask', (data) => {
            if (data.watchType === 0) {
                const index = this.getIndexOfStopwatches(data);
                if (index !== -1) {
                    if (self.startStopwatchAction) {
                        self.startStopwatchAction(self.stopwatches[index]);
                    }
                }
            } else {
                const index = this.getIndexOfTimers(data);
                if (index !== -1) {
                    if (self.startTimerAction) {
                        self.startTimerAction(self.timers[index], data);
                    }
                }
            }
        });
    }

    public addPauseTaskListener = () => {
        const self = this;
        this.hubConnection.on('PauseTask', (data) => {
            if (data.watchType === 0) {
            const index = self.getIndexOfStopwatches(data);
            if (index !== -1) {
                if (self.pauseStopwatchAction) {
                    self.pauseStopwatchAction(self.stopwatches[index], data);
                }
            }
        }else {
            const index = self.getIndexOfTimers(data);
            if (index !== -1) {
                if (self.pauseTimerAction) {
                    self.pauseTimerAction(self.timers[index], data);
                }
            }
        }
        });;
    }

    public addDeleteTaskListener = () => {
        const self = this;
        this.hubConnection.on('DeleteTask', (data) => {
            let index = this.getIndexOfStopwatchesByTaskId(data);
            if (index !== -1) {
                if (self.deleteStopwatchAction) {
                    self.deleteStopwatchAction(index);
                }
            } else {
                index = self.getIndexOfTimersByTaskId(data);
                if (index !== -1) {
                    if (self.deleteTimerAction) {
                        self.deleteTimerAction(index);
                    }
                }
            }
        });
    }

    public addUpdateTaskListener = () => {
        const selt = this;
        this.hubConnection.on('UpdateTask', (data) => {
            if (this.updateFromStopwatchPage) {
                const index = selt.getIndexOfStopwatches(data);
                if (index !== -1) {
                    if (selt.updateFromStopwatchPageAction) {
                        selt.updateFromStopwatchPageAction(index, data);
                    }
                }
            } else if (this.updateFromTimerPage) {
                const index = selt.getIndexOfTimers(data);
                if (index !== -1) {
                    if (selt.updateFromTimerPageAction) {
                        selt.updateFromTimerPageAction(index, data);
                    }
                }
            } else {
                if (data.watchType === 0) {
                    const index = selt.getIndexOfStopwatches(data);
                    if (index !== -1) {
                        if (selt.updateStopwatchAction) {
                            selt.updateStopwatchAction(index, data);
                        }
                    }
                } else {
                    const index = selt.getIndexOfTimers(data);
                    if (index !== -1) {
                        if (selt.updateTimerAction) {
                            selt.updateTimerAction(index, data);
                        }
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
                    if (self.resetStopwatchAction) {
                        self.resetStopwatchAction(self.stopwatches[index]);
                    }
                }
            } else {
                const index = self.getIndexOfTimers(data);
                if (index !== -1) {
                    if (self.resetTimerAction) {
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
        const index = this.getIndexByTaskId(this.timers, taskId);

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

    setTimersPage(page: number) {
        const tempTimersPager = this.pagerService.getPager(this.timers.length, page, this.pageSizeList);
        this.getTimersForPage(tempTimersPager).subscribe(data => {
            this.pagedTimers = data;
            this.timerPager = tempTimersPager;
            this.runAfterGetTimers();
        });
    }

    addTimer() {
        const taskToPass: TaskCreateJson = {
            id: 0,
            name: this.taskName,
            description: '',
            elapsedTime: 0,
            goal: '',
            lastStartTime: '0001-01-01T00:00:00Z',
            isRunning: false,
            hour: 0,
            minutes: 0,
            seconds: 0,
            currentSecond: 0,
            isCollapsed: true,
            isShowed: true,
            isStoped: false,
            watchType: 1,
            maxValueHour: 0,
            maxValueMinute: 0,
            maxValueSecond: 0,
            isTimerFinished: false,
            goals: 0,
            ticksi: 0
        };
        this.broadcastCreateTask(taskToPass);
        this.taskName = '';
    }

    addTimerListener(task: any) {
        task.hour = 0;
        task.minutes = 0;
        task.seconds = 0;
        task.goals = 0;
        this.timers.unshift(this.timerToTaskCreateJson(task));
        this.setTimersPage(1);
    }

    update(task: TaskCreateJson) {
        task.isCollapsed = true;
        this.broadcastUpdateTask(task);
    }

    updateTimerListener(index: number, task: any) {
        this.timers[index].name = task.name;
    }

    pauseTimer(task: TaskCreateJson) {

        if (task.description === this.timerService.description) {
            this.timerService.taskJson = task;
            this.timers.forEach(timer => timer.description = '');
        }

        task.isRunning = false;
        task.isStoped = true;
        task.elapsedTime = task.ticksi;
        this.broadcastPauseTask(task);
        const timeStart = new Date(task.lastStartTime);
        const timeNow = new Date(new Date(Date.now()).toISOString().slice(0, -1));
        const stop = (new Date(Date.now())).toISOString().slice(0, -1);
        const recordToCreate: Record = {
            id: 0,
            name: task.name,
            description: task.description,
            startTime: task.lastStartTime,
            stopTime: stop,
            elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
                this.milisecondPerMinute + (timeNow.getSeconds() - timeStart.getSeconds()) * this.milisecondPerSecond + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
            watchType: task.watchType,
            action: 'Pause',
            taskId: task.id,
            userId: 0
        };
        this.historyService.createRecord(recordToCreate).subscribe();
        this.runAfterGetTimers();
    }

    resetTimer(task: TaskCreateJson) {
        task.hour = task.minutes = task.seconds = task.elapsedTime = 0;
        task.isStoped = task.isRunning = false;
        this.broadcastResetTask(task);
        const timeStart = new Date(task.lastStartTime);
        const timeNow = new Date(new Date(Date.now()).toISOString().slice(0, -1));
        const stop = (new Date(Date.now())).toISOString().slice(0, -1);
        const recordToCreate: Record = {
            id: 0,
            name: task.name,
            description: task.description,
            startTime: task.lastStartTime,
            stopTime: stop,
            elapsedTime: ((timeNow.getHours() - timeStart.getHours()) * 3600000 + (timeNow.getMinutes() - timeStart.getMinutes()) *
                this.milisecondPerMinute + (timeNow.getSeconds() - timeStart.getSeconds()) * this.milisecondPerSecond + (timeNow.getMilliseconds() - timeStart.getMilliseconds())),
            watchType: task.watchType,
            action: 'Reset',
            taskId: task.id,
            userId: 0
        };
        this.historyService.createRecord(recordToCreate).subscribe();
        this.runAfterGetTimers();
    }

    resetTimerListener(task: any) {
        task.hour = task.minutes = task.seconds = task.elapsedTime = 0;
        task.isStoped = task.isRunning = false;
    }

    updateTimeTimer(task: TaskCreateJson) {
        if (task.isRunning) {
            task.hour = Math.floor(task.ticksi / this.secondPerHour);
            task.minutes = Math.floor((task.ticksi % this.secondPerHour) / this.secondPerMinute);
            task.seconds = Math.floor((task.ticksi % this.secondPerHour) % this.secondPerMinute);
        }

        if (task.elapsedTime <= 0) {
            this.resetTimer(task);
        }

        if (task.minutes == 0 && task.seconds == 0 && task.hour == 0) {
            this.resetTimer(task);
            this.timerService.timerSound.src = this.configService.urlSoundTimer;
            this.timerService.timerSound.play();
            task.isTimerFinished = true;
        }
    }

    startTimer(task: TaskCreateJson) {

        if (task.description === this.timerService.description) {
            this.timerService.taskJson = task;
            this.timers.forEach(timer => timer.description = '');
        }

        if (task.goals != ((task.maxValueHour * this.secondPerHour) + (task.maxValueMinute * this.secondPerMinute)
            + (task.maxValueSecond * this.secondPerSecond))) {
            this.resetTimer(task);
            task.goals = ((task.maxValueHour * this.secondPerHour) + (task.maxValueMinute * this.secondPerMinute)
                + (task.maxValueSecond * this.secondPerSecond));
            task.elapsedTime = task.goals;
            this.startTimer(task);
        } else {
            this.startTimeTimer(task);
            task.lastStartTime = (new Date(Date.now())).toISOString().slice(0, -1);
            this.broadcastStartTask(task);
        }
    }

    startTimeTimer(task: TaskCreateJson) {
        task.isRunning = true;
        task.isStoped = false;
        if (task.maxValueHour == null) {
            task.maxValueHour = 0;
        }

        if (task.maxValueMinute == null) {
            task.maxValueMinute = 0;
        }

        if (task.maxValueSecond == null) {
            task.maxValueSecond = 0;
        }
        task.goal = task.maxValueHour.toString() + ':' + task.maxValueMinute.toString() + ':' + task.maxValueSecond.toString();

        if (task.elapsedTime === 0) {
            task.ticksi = ((task.maxValueHour * this.secondPerHour) + (task.maxValueMinute * this.secondPerMinute)
                + (task.maxValueSecond * this.secondPerSecond));
            task.elapsedTime = task.ticksi;
        } else {
            task.ticksi = task.elapsedTime;
        }

        this.timersSubscriptions.push(timer(0, this.milisecondPerSecond).subscribe((x) => {
            task.ticksi--; this.updateTimeTimer(task);
        }));
        return task.ticksi;
    }

    filterStopwatches(propertyName: string) {
        this.pagedStopwatches = this.pagedStopwatches.sort((a, b) => {
          switch (propertyName) {
            case 'name': return this.compare(a.name, b.name);
          }
        });
      }
    
    filterTimers(propertyName: string){
        this.pagedTimers = this.pagedTimers.sort((a, b) => {
            switch (propertyName) {
              case 'name': return this.compare(a.name, b.name);
            }
          });
    }
    compare(a: String, b: String) {
        return (a.toLowerCase() < b.toLowerCase() ? -1 : 1);
      }
}
