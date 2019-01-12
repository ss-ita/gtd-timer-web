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
  doughnutChart: Chart;
  tasks = [];
  colors = ['#DEB887', '#A9A9A9', '#DC143C', '#F4A460', '#2E8B57', '#F08080', '#008000', '#FFFF00', '#EE82EE', '#4169E1', '#FFE4B5', '#00FA9A', '#BA55D3', '#FF4500'];
  public hasData: boolean = true;
  public isActiveChart: boolean = true;

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
        this.toasterService.showToaster(httpErrorResponse.error.Message)
      });
  }

  map(data: any[]) {
    var items = [];
    for (var i = 0; i < data.length; i++) {
      var task = { name: data[i].name, time: parseInt(data[i].elapsedTime), isActive: data[i].isActive };
      items.push(task);
    }

    return items;
  }

  filterTasks(tasks: any[], isActive: boolean) {
    var items = [];
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].isActive === isActive) {
        items.push(tasks[i]);
      }
    }

    return items;
  }

  prepareDataForDoughnutChart(tasks: any[]) {
    var namesOfTasks = [];
    var durationsOfTasks = [];
    for (var i = 0; i < tasks.length; i++) {
      namesOfTasks.push(tasks[i].name);
      durationsOfTasks.push(tasks[i].time);
    }
    var data = { tasksName: namesOfTasks, tasksDurations: durationsOfTasks };

    return data;
  }

  drawDoughnutChart(namesOfTasks: any[], durationsOfTasks: any[]) {
    var self = this;
    this.doughnutChart = new Chart('doughnutChart', {
      type: 'doughnut',
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
              var time = self.millisecondsToElapsedTime(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
              var label = data.labels[tooltipItem.index] + ': ' + self.elepsedTimeToString(time);

              return label;
            }
          }
        }
      }
    });
  }

  createInitialChart() {
    var activeTasks = this.filterTasks(this.tasks, true);
    var data = this.prepareDataForDoughnutChart(activeTasks);
    this.hasData = (data.tasksName.length != 0);
    this.drawDoughnutChart(data.tasksName, data.tasksDurations);
  }

  drawActiveTasks() {
    this.updateChart(true);
  }

  drawArchiveTasks() {
    this.updateChart(false);
  }

  updateChart(isActive: boolean) {
    var archiveTasks = this.filterTasks(this.tasks, isActive);
    var data = this.prepareDataForDoughnutChart(archiveTasks);
    this.hasData = (data.tasksName.length != 0);
    this.isActiveChart = isActive;
    this.updateChartData(data);
  }

  updateChartData(data: any) {
    this.doughnutChart.config.data.labels = data.tasksName;
    this.doughnutChart.config.data.datasets[0].data = data.tasksDurations;
    this.doughnutChart.update();
  }

  millisecondsToElapsedTime(timeInMillisecond: number) {
    var millisecondInHours = 3600000;
    var millisecondInMinutes = 60000;
    var millisecondInSeconds = 1000;
    let hours = Math.floor(Number(timeInMillisecond) / millisecondInHours);
    let minutes = Math.floor((Number(timeInMillisecond) - hours * millisecondInHours) / millisecondInMinutes);
    let seconds = Math.floor((Number(timeInMillisecond) - hours * millisecondInHours - minutes * millisecondInMinutes) / millisecondInSeconds)
    var elapsedTime = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }

    return elapsedTime;
  }

  elepsedTimeToString(time: any) {
    var timeStr = this.numberToTimeString(time.hours) + ':'
      + this.numberToTimeString(time.minutes) + ':' + this.numberToTimeString(time.seconds);

    return timeStr;
  }

  numberToTimeString(digit: number) {
    if (digit < 9) {
      return '0' + digit;
    }

    return digit;
  }
}
