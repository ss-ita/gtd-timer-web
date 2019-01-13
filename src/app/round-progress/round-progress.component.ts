import { Component, OnInit, Input } from '@angular/core';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-round-progress',
  templateUrl: './round-progress.component.html',
  styleUrls: ['./round-progress.component.css']
})
export class RoundProgressComponent implements OnInit {
  @Input() value = 0;
  @Input() color = 'blue';
  @Input() text: string;
  @Input() max = 0;

  constructor(private timerService: TimerService) { }

  ngOnInit() {
  }

}
