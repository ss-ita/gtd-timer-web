import { Component, OnInit } from '@angular/core';
import { Record } from '../models/record.model';

@Component({
  selector: 'app-record-info',
  templateUrl: './record-info.component.html',
  styleUrls: ['./record-info.component.css']
})
export class RecordInfoComponent implements OnInit {

  record: Record;

  constructor() { }

  ngOnInit() {
  }
}
