import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UserService } from '../services/user.service';
import { ToasterService } from '../services/toaster.service';
import { Condition } from 'selenium-webdriver';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  doughnutChart: Chart;
  tasks = [];
  colors = ['#F08080', '#008000', '#FFFF00', '#EE82EE', '#4169E1', '#FFE4B5', '#00FA9A', '#BA55D3', '#FF4500'];
  public hasData: boolean = false;

  constructor(
    private userService: UserService,
    private toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.userService.getAllTasks().subscribe(
      (data: any[]) => {
        this.map(data);
        this.createInitialChart();
      },
      httpErrorResponse => {
        this.toasterService.showToaster(httpErrorResponse.error.Message)
      });
  }

  map(data: any[]) {
    for (var i = 0; i < data.length; i++) {
      var task = { name: data[i].name, time: parseInt(data[i].elapsedTime), isActive: data[i].isActive };
      this.tasks.push(task);
    }
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
      seconds: seconds,
      milliseconds: timeInMillisecond - (hours * millisecondInHours + minutes * millisecondInMinutes + seconds * millisecondInSeconds)
    }

    return elapsedTime;
  }

  prepareDataForPieChart(tasks: any[]) {
    var namesOfTasks = [];
    var durationsOfTasks = [];
    for (var i = 0; i < tasks.length; i++) {
      namesOfTasks.push(tasks[i].name);
      durationsOfTasks.push(tasks[i].time);
    }
    var data = { tasksName: namesOfTasks, tasksDurations: durationsOfTasks };

    return data;
  }

  drawPieChart(namesOfTasks: any[], durationsOfTasks: any[]) {
    var self = this;
    this.doughnutChart = new Chart('pieChart', {
      type: 'doughnut',
      data: {
        labels: namesOfTasks,
        datasets: [{
          label: 'tasks',
          data: durationsOfTasks,
          backgroundColor: this.colors,
          borderColor: this.colors,
          borderWidth: 1
        }]
      },
      options: {
        /*title: {
          text: "Pie Chart",
          display: true
        },*/
        cutoutPercentage: 60,
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var time = self.millisecondsToElapsedTime(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
              var label = data.labels[tooltipItem.index] + ': ' + self.numberToTime(time.hours) + ':'
                + self.numberToTime(time.minutes) + ':' + self.numberToTime(time.seconds) + ':'
                + self.numberToTime(time.milliseconds);

              return label;
            }
          }
        }
      }
    });
  }

  numberToTime(item: number) {
    if (item < 9) {
      return '0' + item;
    }

    return item;
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

  createInitialChart() {
    var activeTasks = this.filterTasks(this.tasks, true);
    var data = this.prepareDataForPieChart(activeTasks);
    this.hasData = (data.tasksName.length != 0);
    this.drawPieChart(data.tasksName, data.tasksDurations);
  }

  drawActiveTasks() {
    var activeTasks = this.filterTasks(this.tasks, true);
    var data = this.prepareDataForPieChart(activeTasks);
    this.hasData = (data.tasksName.length != 0);
    this.resetChart(data);
  }

  drawArchiveTasks() {
    var archiveTasks = this.filterTasks(this.tasks, false);
    var data = this.prepareDataForPieChart(archiveTasks);
    this.hasData = (data.tasksName.length != 0);
    this.resetChart(data);
  }

  resetChart(data: any) {
    this.doughnutChart.config.data.labels = data.tasksName;
    this.doughnutChart.config.data.datasets[0].data = data.tasksDurations;
    this.doughnutChart.update();
  }
}
