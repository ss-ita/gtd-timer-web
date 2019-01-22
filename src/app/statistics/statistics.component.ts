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
  public hasData = true;
  public isActive = true;
  public typeOfChart = ChartTypes.Doughnut;
  public typeOfData = DataTypes.Tasks;

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
    this.initChart(data.names, data.durations);
  }

  redraw(isActive: boolean) {
    this.isActive = isActive;
    switch (this.typeOfData) {
      case DataTypes.Tasks: {
        this.updateChart(isActive);
        break;
      }
      case DataTypes.Hashtags: {
        this.drawHashtagsChart(isActive);
        break;
      }
    }
  }

  updateChart(isActive: boolean) {
    const archiveTasks = this.filterTasks(this.tasks, isActive);
    const data = this.prepareDataForChart(archiveTasks);
    this.hasData = (data.names.length != 0);
    //this.isActive = isActive;
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
    let config = this.chart.config;
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
    this.redraw(this.isActive);
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

  drawHashtagsChart(isActiveData: boolean) {
    const filterTasks = this.filterTasks(this.tasks, isActiveData);
    const dictionary = this.getHashtagsData(filterTasks);
    this.hasData = (dictionary.length != 0);
    const data = this.prepareHashtagsDataForChart(dictionary);
    this.updateChartData(data);
  }

  getHashtagsData(filterTasks: any) {
    const dictionary = [];
    for (let i = 0; i < filterTasks.length; i++) {
      for (let j = 0; j < filterTasks[i].hashtags.length; j++) {
        const index = this.getHashtagsIndexInDictionary(dictionary, filterTasks[i].hashtags[j]);
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

  getHashtagsIndexInDictionary(dictionary: any, nameOfHashtag: string) {
    for (let i = 0; i < dictionary.length; i++) {
      if (dictionary[i].key === nameOfHashtag) {
        return i;
      }
    }

    return -1;
  }
}
