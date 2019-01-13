import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-line-progress',
  templateUrl: './line-progress.component.html',
  styleUrls: ['./line-progress.component.css']
})
export class LineProgressComponent implements OnInit {
  @Input() value = 0;
  @Input() isActive: boolean;
  @Input() isPaused: boolean;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
