import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ToasterService } from '../services/toaster.service';
import { TasksService } from '../services/tasks.service';

export enum ChartTypes {
  Doughnut,
  Bar
}

export enum DataTypes {
  Tasks,
  Hashtags
}

export enum TaskTypes {
  Stopwatch,
  Timer
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})

export class StatisticsComponent implements OnInit {
  chart: Chart;
  tasks = [];
  colors = ['#FF80AB', '#2196F3', '#D81B60', '#00C853', '#FFEB3B', '#7986CB', '#F8BBD0', '#FFD600', '#FF5722', '#81D4FA'];
  dataTypes = DataTypes;
  chartTypes = ChartTypes;
  tasksTypes = TaskTypes;
  public hasData = true;
  public typeOfTasks;
  public typeOfChart = ChartTypes.Doughnut;
  public typeOfData = DataTypes.Tasks;
  public startDate: Date = null;
  public endDate: Date = null;
  public startDateFilter = (date: Date): boolean => {
    if (this.endDate !== null) {
      return this.endDate >= date;
    }
    return true;
  }
  public endDateFilter = (date: Date): boolean => {
    if (this.startDate !== null) {
      return this.startDate <= date;
    }
    return true;
  }

  constructor(
    private tasksService: TasksService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.tasksService.getAllRecordsCurrentUser().subscribe(
      (data: any[]) => {
        this.tasks = this.map(data);
        this.createInitialChart();
      },
      httpErrorResponse => {
        this.toasterService.showToaster(httpErrorResponse.error.Message);
      });
  }

  map(data: any[]) {
    const items = [];
    for (let i = 0; i < data.length; i++) {
      const task = {
        taskId: data[i].taskId,
        name: data[i].name,
        time: parseInt(data[i].elapsedTime, 10),
        type: data[i].watchType,
        startDate: new Date(data[i].startTime),
        stopDate: new Date(data[i].stopTime),
        hashtags: this.getHashtags(data[i].name)
      };
      items.push(task);
    }

    return items;
  }

  filterByDate(event: any) {
    this.redraw();
  }

  filterTasks(tasks: any[], type?: any) {
    const items = [];
    for (let i = 0; i < tasks.length; i++) {
      if ((type == undefined || tasks[i].type === type)
        && tasks[i].time > 0
        && (this.startDate == undefined || this.tasks[i].startDate >= this.startDate)
        && (this.endDate == undefined || this.tasks[i].stopDate <= this.endDate)) {
        items.push(tasks[i]);
      }
    }

    return items;
  }

  getTasksWithTotalTime(tasks: any) {
    const listOfTasksWithTotalTime = [];
    for (let i = 0; i < tasks.length; i++) {
      const index = this.getIndex(listOfTasksWithTotalTime, tasks[i].taskId);
      if (index !== -1) {
        listOfTasksWithTotalTime[index].time += tasks[i].time;
      } else {
        listOfTasksWithTotalTime.push(Object.assign({}, tasks[i]));
      }
    }

    return listOfTasksWithTotalTime;
  }

  getIndex(tasks: any, taskId: number) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].taskId === taskId) {
        return i;
      }
    }

    return -1;
  }

  prepareDataForChart(tasks: any[]) {
    const namesOfTasks = [];
    const durationsOfTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      namesOfTasks.push(tasks[i].name);
      durationsOfTasks.push(tasks[i].time);
    }
    const data = { names: namesOfTasks, durations: durationsOfTasks };

    return data;
  }

  initChart(namesOfTasks: any[], durationsOfTasks: any[]) {
    const type = this.getTypeOfChart();
    const self = this;
    this.chart = new Chart('canvasChart', {
      type: type,
      data: {
        labels: namesOfTasks,
        datasets: [{
          data: durationsOfTasks,
          backgroundColor: this.colors,
          borderColor: this.colors,
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          onHover: function (e) {
            e.target.style.cursor = 'pointer';
          }
        },
        hover: {
          onHover: function (e) {
            const point = this.getElementAtEvent(e);
            if (point.length) {
              e.target.style.cursor = 'pointer';
            } else {
              e.target.style.cursor = 'default';
            }
          }
        },
        cutoutPercentage: 60,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const time = self.millisecondsToElapsedTime(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
              const label = data.labels[tooltipItem.index] + ': ' + self.elepsedTimeToString(time);

              return label;
            }
          }
        }
      }
    });
  }

  createInitialChart() {
    const tasks = this.filterTasks(this.tasks);
    const listOfTasksWithTotalTime = this.getTasksWithTotalTime(tasks);
    const data = this.prepareDataForChart(listOfTasksWithTotalTime);
    this.hasData = (data.names.length != 0);
    this.initChart(data.names, data.durations);
  }

  redraw(type?: any) {
    this.typeOfTasks = type;
    switch (this.typeOfData) {
      case DataTypes.Tasks: {
        this.updateChart(this.typeOfTasks);
        break;
      }
      case DataTypes.Hashtags: {
        this.drawHashtagsChart(this.typeOfTasks);
        break;
      }
    }
  }

  updateChart(type: any) {
    const tasks = this.filterTasks(this.tasks, type);
    const listOfTasksWithTotalTime = this.getTasksWithTotalTime(tasks);
    const data = this.prepareDataForChart(listOfTasksWithTotalTime);
    this.hasData = (data.names.length != 0);
    this.updateChartData(data);
  }

  updateChartData(data: any) {
    this.chart.config.data.labels = data.names;
    this.chart.config.data.datasets[0].data = data.durations;
    this.chart.update();
  }

  millisecondsToElapsedTime(timeInMillisecond: number) {
    const millisecondInHours = 3600000;
    const millisecondInMinutes = 60000;
    const millisecondInSeconds = 1000;
    const hours = Math.floor(Number(timeInMillisecond) / millisecondInHours);
    const minutes = Math.floor((Number(timeInMillisecond) - hours * millisecondInHours) / millisecondInMinutes);
    const seconds = Math.floor((Number(timeInMillisecond) - hours * millisecondInHours - minutes * millisecondInMinutes)
      / millisecondInSeconds);
    const elapsedTime = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };

    return elapsedTime;
  }

  elepsedTimeToString(time: any) {
    const timeStr = this.numberToTimeString(time.hours) + ':'
      + this.numberToTimeString(time.minutes) + ':' + this.numberToTimeString(time.seconds);

    return timeStr;
  }

  numberToTimeString(digit: number) {
    const targetLength = 2;
    const str = digit.toString();
    return str.padStart(targetLength, '0');
  }

  getTypeOfChart() {
    let type;
    switch (this.typeOfChart) {
      case ChartTypes.Doughnut: {
        type = 'doughnut';
        break;
      }
      case ChartTypes.Bar: {
        type = 'bar';
        break;
      }
    }

    return type;
  }

  changeTypeOfChart(newTypeOfChart: ChartTypes) {
    this.typeOfChart = newTypeOfChart;
    this.updateChartConfig();
    this.chart.update();
  }

  updateChartConfig() {
    const self = this;
    const type = this.getTypeOfChart();
    const config = this.chart.config;
    config.type = type;
    if (config.options.scales) {
      config.options.scales.xAxes[0].display = type === 'bar';
      config.options.scales.yAxes[0].display = type === 'bar';
    }
    config.options.legend.display = type !== 'bar';
    if (config.type === 'bar') {
      config.options.scales = {
        yAxes: [{
          ticks: {
            callback: function (value) {
              const time = self.millisecondsToElapsedTime(parseInt(value, 10));
              const str = self.elepsedTimeToString(time);
              return str;
            }
          }
        }]
      };
    }
  }

  changeTypeOfData(newTypeOfData: DataTypes) {
    this.typeOfData = newTypeOfData;
    this.redraw();
  }

  getHashtags(text: string) {
    const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    const matches = [];
    let match;

    while ((match = regex.exec(text))) {
      matches.push(match[0]);
    }

    return matches;
  }

  drawHashtagsChart(type: any) {
    const filterTasks = this.filterTasks(this.tasks, type);
    const dictionary = this.getHashtagsData(filterTasks);
    this.hasData = (dictionary.length != 0);
    const data = this.prepareHashtagsDataForChart(dictionary);
    this.updateChartData(data);
  }

  getHashtagsData(filterTasks: any) {
    const dictionary = [];
    for (let i = 0; i < filterTasks.length; i++) {
      for (let j = 0; j < filterTasks[i].hashtags.length; j++) {
        const index = this.getIndexInDictionary(dictionary, filterTasks[i].hashtags[j]);
        if (index === -1) {
          dictionary.push({
            key: filterTasks[i].hashtags[j],
            value: filterTasks[i].time
          });
        } else {
          dictionary[index].value += filterTasks[i].time;
        }
      }
    }

    return dictionary;
  }

  prepareHashtagsDataForChart(dictionary: any) {
    const namesOfHashtags = [];
    const durationsOfHashtags = [];
    for (let i = 0; i < dictionary.length; i++) {
      namesOfHashtags.push(dictionary[i].key);
      durationsOfHashtags.push(dictionary[i].value);
    }

    const data = { names: namesOfHashtags, durations: durationsOfHashtags };

    return data;
  }

  getIndexInDictionary(dictionary: any, nameOfHashtag: string) {
    for (let i = 0; i < dictionary.length; i++) {
      if (dictionary[i].key === nameOfHashtag) {
        return i;
      }
    }

    return -1;
  }
}
