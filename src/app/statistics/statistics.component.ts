import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ToasterService } from '../services/toaster.service';
import { TasksService } from '../services/tasks.service';

export enum ChartTypes {
  Doughnut,
  Bar
}

export enum DataTypes {
  Active,
  Archive
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
  public hasData = true;
  public isActive = true;
  public typeOfChart = ChartTypes.Doughnut;
  public typeOfData: number = DataTypes.Active;

  constructor(
    private tasksService: TasksService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.tasksService.getAllTasks().subscribe(
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
        name: data[i].name, time: parseInt(data[i].elapsedTime, 10),
        isActive: data[i].isActive, hashtags: this.getHashtags(data[i].name)
      };
      items.push(task);
    }

    return items;
  }

  filterTasks(tasks: any[], isActive: boolean) {
    const items = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].isActive === isActive && tasks[i].time > 0) {
        items.push(tasks[i]);
      }
    }

    return items;
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

  drawChart(namesOfTasks: any[], durationsOfTasks: any[]) {
    const type = this.getTypeOfChart();
    const self = this;
    this.chart = new Chart('tasksChart', {
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
    const tasks = this.filterTasks(this.tasks, this.isActive);
    const data = this.prepareDataForChart(tasks);
    this.hasData = (data.names.length != 0);
    this.drawChart(data.names, data.durations);
  }

  drawActiveTasks() {
    this.isActive = true;
    switch (this.typeOfData) {
      case 0: {
        this.updateChart(true);
        break;
      }
      case 1: {
        this.drawHashtags(true);
        break;
      }
      default: {
        break;
      }

    }
  }

  drawArchiveTasks() {
    this.isActive = false;
    switch (this.typeOfData) {
      case 0: {
        this.updateChart(false);
        break;
      }
      case 1: {
        this.drawHashtags(false);
        break;
      }
      default: {
        break;
      }

    }
  }

  updateChart(isActive: boolean) {
    const archiveTasks = this.filterTasks(this.tasks, isActive);
    const data = this.prepareDataForChart(archiveTasks);
    this.hasData = (data.names.length != 0);
    this.isActive = isActive;
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
      case 0: {
        type = 'doughnut';
        break;
      }
      case 1: {
        type = 'bar';
        break;
      }
      default: {
        break;
      }
    }

    return type;
  }

  changeTypeOfChart(newTypeOfChart: number) {
    const self = this;
    this.typeOfChart = newTypeOfChart;
    const type = this.getTypeOfChart();
    this.chart.config.type = type;
    if (this.chart.config.options.scales) {
      this.chart.config.options.scales.xAxes[0].display = type === 'bar';
      this.chart.config.options.scales.yAxes[0].display = type === 'bar';
    }
    this.chart.config.options.legend.display = type !== 'bar';
    if (this.chart.config.type === 'bar') {
      this.chart.config.options.scales = {
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
    this.chart.update();
  }

  changeTypeOfData(newTypeOfData: number) {
    this.typeOfData = newTypeOfData;
    if (this.isActive) {
      this.drawActiveTasks();
    } else {
      this.drawArchiveTasks();
    }
  }

  public getHashtags(text: string) {
    const regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    const matches = [];
    let match;

    while ((match = regex.exec(text))) {
      matches.push(match[0]);
    }

    return matches;
  }

  drawHashtags(isActiveData: boolean) {
    const dictionary = this.getHashtagsData(isActiveData);
    this.hasData = (dictionary.length != 0);
    const data = this.prepareHashtagsDataForChart(dictionary);
    this.updateChartData(data);
  }

  getHashtagsData(isActiveData: boolean) {
    const dictionary = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].isActive === isActiveData) {
        for (let j = 0; j < this.tasks[i].hashtags.length; j++) {
          const index = this.getHashtagsIndexInDictionary(dictionary, this.tasks[i].hashtags[j]);
          if (index === -1) {
            dictionary.push({
              key: this.tasks[i].hashtags[j],
              value: this.tasks[i].time
            });
          } else {
            dictionary[index].value += this.tasks[i].time;
          }
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

  getHashtagsIndexInDictionary(dictionary: any, nameOfHashtag: string) {
    for (let i = 0; i < dictionary.length; i++) {
      if (dictionary[i].key === nameOfHashtag) {
        return i;
      }
    }

    return -1;
  }
}
