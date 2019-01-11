import { Component, OnInit } from '@angular/core';
import { StopwatchService } from '../services/stopwatch.service';
import { StyleService } from '../services/style.service';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})

export class StopwatchComponent implements OnInit { 

  constructor( private stopwatchService: StopwatchService, private styleService: StyleService) { }
  
  ngOnInit() {

  }

}
