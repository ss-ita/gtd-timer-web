import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ToasterService } from '../services/toaster.service';
import { TasksService } from '../services/tasks.service';


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
  public isActiveChart = true;
  public typeOfChart = 0;

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
      const task = { name: data[i].name, time: parseInt(data[i].elapsedTime, 16), isActive: data[i].isActive };
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
    const data = { tasksName: namesOfTasks, tasksDurations: durationsOfTasks };

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
    const tasks = this.filterTasks(this.tasks, this.isActiveChart);
    const data = this.prepareDataForChart(tasks);
    this.hasData = (data.tasksName.length != 0);
    this.drawChart(data.tasksName, data.tasksDurations);
  }

  drawActiveTasks() {
    this.updateChart(true);
  }

  drawArchiveTasks() {
    this.updateChart(false);
  }

  updateChart(isActive: boolean) {
    const archiveTasks = this.filterTasks(this.tasks, isActive);
    const data = this.prepareDataForChart(archiveTasks);
    this.hasData = (data.tasksName.length != 0);
    this.isActiveChart = isActive;
    this.updateChartData(data);
  }

  updateChartData(data: any) {
    this.chart.config.data.labels = data.tasksName;
    this.chart.config.data.datasets[0].data = data.tasksDurations;
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

  changeTypeOfChart(digit: number) {
    this.typeOfChart = digit;
    const type = this.getTypeOfChart();
    this.chart.config.type = type;
    if (this.chart.config.options.scales) {
      this.chart.config.options.scales.xAxes[0].display = type == 'bar';
      this.chart.config.options.scales.yAxes[0].display = type == 'bar';
    }
    this.chart.config.options.legend.display = type != 'bar';
    this.chart.update();
  }
}
