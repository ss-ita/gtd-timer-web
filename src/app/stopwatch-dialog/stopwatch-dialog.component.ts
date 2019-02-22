import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { TasksService } from '../services/tasks.service';
import { StopwatchService } from '../services/stopwatch.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-stopwatch-dialog',
  templateUrl: './stopwatch-dialog.component.html',
  styleUrls: ['./stopwatch-dialog.component.css']
})
export class StopwatchDialogComponent implements OnInit {

  stopwatchDialogForm: FormGroup;
  stopwatchName = 'New stopwatch';
  stopwatchTag = 'None';

  
  constructor(
    private stopwatchDialogRef: MatDialogRef<StopwatchDialogComponent>,
    private formBuilder: FormBuilder,
    public stopwatchService: StopwatchService,
    private taskService: TasksService,
    private toasterService: ToasterService
  ) { }

  onSave() {
    let name: string;

    if (this.stopwatchTag === 'None') {
      name = this.stopwatchName;
    } else {
      name = this.stopwatchName + ' ' + '#' + this.stopwatchTag;
    }

    this.stopwatchService.taskJson.name = name;

    this.taskService.updateStopwatch(this.stopwatchService.taskJson)

    this.toasterService.showToaster('Title changed');
    this.onClose();
  }

  onClose() {
    this.stopwatchDialogRef.close();
  }

  getErrorMessageNameAndTag() {
    return 'You have typed too many characters or have not entered at least one';
  }

  ngOnInit() {
    this.stopwatchDialogForm = this.formBuilder.group({
      'stopwatchName': [this.stopwatchName, [Validators.required, Validators.maxLength(35)]],
      'stopwatchTag': [this.stopwatchTag, [Validators.required, Validators.maxLength(35)]]
    });
  }

}
