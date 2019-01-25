import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../services/stopwatch.service';
import { StyleService } from '../services/style.service';
import { TasksComponent } from '../tasks/tasks.component';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})

export class StopwatchComponent implements OnInit {

  constructor(public stopwatchService: StopwatchService, public styleService: StyleService, public taskService: TasksService) { }

  ngOnInit() {

  }

}
