import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { TasksService } from '../services/tasks.service';
import { TimerService } from '../services/timer.service';
import { TaskCreateJson } from '../models/taskCreateJson.model';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-timer-dialog',
  templateUrl: './timer-dialog.component.html',
  styleUrls: ['./timer-dialog.component.css']
})
export class TimerDialogComponent implements OnInit {

  timerDialogForm: FormGroup;
  timerName = 'New timer';
  timerTag = 'None';

  constructor(
    private timerDialogRef: MatDialogRef<TimerDialogComponent>,
    private formBuilder: FormBuilder,
    public timerService: TimerService,
    private taskService: TasksService,
    private toasterService: ToasterService
  ) { }

  onSave() {
    let name: string;

    if (this.timerTag === 'None') {
      name = this.timerName;
    } else {
      name = this.timerName + ' ' + '#' + this.timerTag;
    }
    
    this.timerService.taskJson.name = name;

    this.taskService.updateTimeTimer(this.timerService.taskJson)
    this.toasterService.showToaster('Title changed');
    this.onClose();
  }

  onClose() {
    this.timerDialogRef.close();
  }

  getErrorMessageNameAndTag() {
    return 'You have typed too many characters or have not entered at least one';
  }

  ngOnInit() {
    this.timerDialogForm = this.formBuilder.group({
      'timerName': [this.timerName, [Validators.required, Validators.maxLength(35)]],
      'timerTag': [this.timerTag, [Validators.required, Validators.maxLength(35)]]
    });
  }

}
