import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { TasksService } from '../services/tasks.service';
import { timer, Subscription } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { HistoryService } from '../services/history.service';
import { Record } from '../models/record.model';
import { PagerService } from '../services/pager.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  providers: [TasksService],


})

export class TasksComponent implements OnInit {
  constructor(
    public taskService: TasksService,
    private configService: ConfigService,
    private historyService: HistoryService,
    private pagerService: PagerService
  ) { }

  readonly progress: Observable<number>;
  public searchText: string;
  public taskName: string;
  subscribe: Subscription;
  displayStopwatch = true;
  displayTimer = false;
  ticks = 0;
  milisecondPerSecond = 1000;
  milisecondPerMinute = 60000;
  milisecondPerHour = 3600000;
  secondPerHour = 3600;
  secondPerMinute = 60;
  secondPerSecond = 1;
  pagedTimers: TaskCreateJson[];
  timerPager: any = {};
  public pageSizes: any = [
    { "id": 5, "value": 5 },
    { "id": 10, "value": 10 },
    { "id": 25, "value": 25 },
    { "id": "Display all", "value": Number.MAX_VALUE }
  ];

  displayStopwatches() {
    this.displayStopwatch = true;
    this.displayTimer = false;
  }

  displayTimers() {
    this.displayStopwatch = false;
    this.displayTimer = true;
    this.setTimersPage(1);
  }

  setTimersPage(page: number) {
    const tempTimersPager = this.pagerService.getPager(this.taskService.timers.length, page, this.taskService.pageSizeList);
    this.taskService.getTimersForPage(tempTimersPager).subscribe(data => { 
      this.pagedTimers = data; 
      this.timerPager = tempTimersPager;
    });
  }

  refreshStopwatchesPage() {
    if (this.taskService.pagedStopwatches.length > 1) {
      this.taskService.setStopwatchesPage(this.taskService.stopwatchPager.currentPage);
    } else {
      this.taskService.setStopwatchesPage(this.taskService.stopwatchPager.currentPage - 1);
    }
  }

  refreshTimersPage() {
    if (this.pagedTimers.length > 1) {
      this.setTimersPage(this.timerPager.currentPage);
    } else {
      this.setTimersPage(this.timerPager.currentPage - 1);
    }
  }

  toggleCollapsed(task: TaskCreateJson) {
    task.isCollapsed = !task.isCollapsed;
  }
  inputShowed(task: TaskCreateJson) {
    task.isShowed = !task.isShowed;
  }
  fillTime(task) {
    task.currentSecond = task.elapsedTime / this.milisecondPerSecond;
    task.hour = Math.floor(task.currentSecond / this.secondPerHour);
    task.minutes = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) / this.secondPerMinute);
    task.seconds = Math.floor((task.currentSecond - (this.secondPerHour * task.hour)) % this.secondPerMinute);
    return task;
  }

  fillTimeAll(list) {
    for (const task of list) {
      this.fillTime(task);
    }
    return list;
  }


  ngOnInit() {
    this.taskService.initTimers().subscribe(() => { this.setTimersPage(1) });
    this.taskService.addCreateTaskListener();
    this.taskService.addStartTaskListener();
    this.taskService.addPauseTaskListener();
    this.taskService.addDeleteTaskListener();
    this.taskService.addUpdateTaskListener();
    this.taskService.addResetTaskListener();
    this.taskService.startStopwatchAction = (task) => {
      this.taskService.start(task);
    };
    this.taskService.pauseStopwatchAction = (task, data) => {
      this.taskService.pauseStopwatchListener(task, data);
    };
    this.taskService.resetStopwatchAction = (task) => {
      this.taskService.resetStopwatchListener(task);
    };
    this.taskService.createStopwatchAction = (task) => {
      this.taskService.addStopwatchListener(task);
    };
    this.taskService.resetTimerAction = (task) => {
      this.resetTimerListener(task);
    };
    this.taskService.createTimerAction = (task) => {
      this.addTimerListener(task);

    };
    this.taskService.deleteStopwatchAction = (index) => {
      this.deleteStopwatchListener(index);
    };
    this.taskService.deleteTimerAction = (index) => {
      this.deleteTimerListener(index);
    };
    this.taskService.updateStopwatchAction = (index, task) => {
      this.taskService.updateStopwatchListener(index, task);
    };
    this.taskService.updateTimerAction = (index, task) => {
      this.updateTimerListener(index, task);
    };
  }

  filterByProperty(propertyName: string) {
    this.taskService.stopwatches = this.taskService.stopwatches.sort((a, b) => {
      switch (propertyName) {
        case 'name': return this.compare(a.name, b.name);
      }
    });
  }

  compare(a: String, b: String) {
    return (a.toLowerCase() < b.toLowerCase() ? -1 : 1);
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
    this.taskService.broadcastCreateTask(taskToPass);
  }

  addTimerListener(task: any) {
    task.hour = 0;
    task.minutes = 0;
    task.seconds = 0;
    task.goals = 0;
    this.taskService.timers.unshift(this.taskService.timerToTaskCreateJson(task));
    this.setTimersPage(1);
  }

  deleteTask(task: TaskCreateJson) {
    this.taskService.broadcastDeleteTask(task.id);
    const indexTaskToDelete = this.taskService.stopwatches.indexOf(task, 0);
    this.taskService.stopwatches.splice(indexTaskToDelete, 1);
    this.refreshStopwatchesPage();
  }

  deleteStopwatchListener(index: number) {
    this.taskService.stopwatches.splice(index, 1);
    this.refreshStopwatchesPage();
  }

  deleteTimer(task: TaskCreateJson) {
    this.taskService.broadcastDeleteTask(task.id);
    const indexTaskToDelete = this.taskService.timers.indexOf(task, 0);
    this.taskService.timers.splice(indexTaskToDelete, 1);
    this.refreshTimersPage();
  }

  deleteTimerListener(index: number) {
    this.taskService.timers.splice(index, 1);
    this.refreshTimersPage();
  }

  updateTask(task: TaskCreateJson) {
    task.isCollapsed = true;
    this.taskService.broadcastUpdateTask(task);
  }

  updateTimerListener(index: number, task: any) {
    this.taskService.timers[index].name = task.name;
  }

  getTimers() {
    this.taskService.getTimers().subscribe(data => {
      this.taskService.timers = [];
      let time: any;
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

        if (toPush.goal != null) {
          time = toPush.goal.split(':');
          toPush.maxValueHour = Number(time[0]);
          toPush.maxValueMinute = Number(time[1]);
          toPush.maxValueSecond = Number(time[2]);
        }
        this.taskService.timers.push(toPush);
      }
      this.setTimersPage(1);
    });
  }

  browseFile(event: any) {
    this.taskService.importFile(event)
      .subscribe(
        data => {
          data.reverse();
          this.taskService.stopwatches.unshift(...this.fillTimeAll(data).filter(task => task.watchType === 0));
          this.taskService.timers.unshift(...data.filter(task => task.watchType === 1));
          this.taskService.setStopwatchesPage(1);
          this.setTimersPage(1);
        }
      );
  }

  exportAllTasksAsXml() {
    this.taskService.downloadFile('all_tasks.xml', this.configService.urlExportAllTasksAsXml);
  }

  exportAllTasksAsCsv() {
    this.taskService.downloadFile('all_tasks.csv', this.configService.urlExportAllTasksAsCsv);
  }

  exportAllStopwatchesAsCsv() {
    this.taskService.downloadFile('all_stopwatches.csv', this.configService.urlExportAllStopwatchesAsCsv);
  }

  exportAllTimersAsCsv() {
    this.taskService.downloadFile('all_timers.csv', this.configService.urlExportAllTimersAsCsv);
  }

  exportAllStopwatchesAsXml() {
    this.taskService.downloadFile('all_stopwatches.xml', this.configService.urlExportAllStopwatchesAsXml);
  }

  exportAllTimersAsXml() {
    this.taskService.downloadFile('all_timers.xml', this.configService.urlExportAllTimersAsXml);
  }

  pauseTimer(task: TaskCreateJson) {
    task.isRunning = false;
    task.isStoped = true;
    this.taskService.pauseTask(task).subscribe();
    task.elapsedTime = task.ticksi;
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
  }

  resetTimer(task: TaskCreateJson) {
    task.hour = task.minutes = task.seconds = task.elapsedTime = 0;
    task.isStoped = task.isRunning = false;
    this.taskService.broadcastResetTask(task);
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
      userId:0
    };
    this.historyService.createRecord(recordToCreate).subscribe();

  }

  resetTimerListener(task: any) {
    task.hour = task.minutes = task.seconds = task.elapsedTime = 0;
    task.isStoped = task.isRunning = false;
  }

/*finishTimer(task:TaskCreateJson){
  if(task.isRunning===true){
    if(task.minutes==0 && task.seconds==0&&task.hour==0){
      task.isRunning=false;
      task.isTimerFinished=true;
    }
  }
}*/
 updateTimeTimer(task: TaskCreateJson) {
    if (task.isRunning) {
      task.hour = Math.floor(task.ticksi / this.secondPerHour);
      task.minutes = Math.floor((task.ticksi % this.secondPerHour) / this.secondPerMinute);
      task.seconds = Math.floor((task.ticksi % this.secondPerHour) % this.secondPerMinute);
    }
    //this.finishTimer(task);
  }

  startTimer(task: TaskCreateJson) {
    this.startTimeTimer(task);
    task.lastStartTime = (new Date(Date.now())).toISOString().slice(0, -1);
    this.taskService.startTask(task).subscribe();
  }

  startTimeTimer(task: TaskCreateJson) {
    task.isRunning = true;
    if (!task.isStoped) {
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
      task.hour = task.maxValueHour;
      task.minutes = task.maxValueMinute;
      task.seconds = task.maxValueSecond;
      task.ticksi = (task.hour * this.secondPerHour) + (task.minutes * this.secondPerMinute) + (task.seconds * this.secondPerSecond);
      this.subscribe = timer(0, this.milisecondPerSecond).subscribe((x) => {
        task.ticksi--; this.updateTimeTimer(task);
      });
    }
    return task.ticksi;
  }
}

