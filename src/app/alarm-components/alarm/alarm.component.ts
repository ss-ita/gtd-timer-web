import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlarmService } from '../../services/alarm.service';
import { StyleService } from '../../services/style.service';
import { MatDialog } from '@angular/material';
import { AlarmDialogComponent } from '../alarm-dialog/alarm-dialog.component';
import { AlarmModel } from '../../models/alarm.model';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {

  isViewable = false;
  innerWidth: any;

  constructor(
    public alarmService: AlarmService,
    public styleService: StyleService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_) {
    this.innerWidth = window.innerWidth;
  }

  openEditWindow(alarmModel: AlarmModel) {
    if (!alarmModel.isOn) {
      this.dialog.open(AlarmDialogComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        disableClose: true,
        data: {
          model: alarmModel
        }
      });
    }
  }

  toggle() {
    this.isViewable = !this.isViewable;
  }

  openSetAlarmPage() {
    this.openAlarmForm();
  }

  openAlarmForm() {
    this.dialog.open(AlarmDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true
    });
  }

  openConfirmationDialog(index: number) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    confirmationDialogRef.componentInstance.title = 'Warning';
    confirmationDialogRef.componentInstance.message = 'Are you sure to permanently delete alarm?';
    confirmationDialogRef.componentInstance.btnCancelText = 'Cancel';
    confirmationDialogRef.componentInstance.btnOkText = 'Confirm';
    confirmationDialogRef.componentInstance.acceptAction = () => {
      this.alarmService.deleteAlarm(index);
    };
  }

  openDialogDeleteAllAlarm() {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    confirmationDialogRef.componentInstance.title = 'Warning';
    confirmationDialogRef.componentInstance.message = 'Are you sure to permanently delete all alarms?';
    confirmationDialogRef.componentInstance.btnCancelText = 'Cancel';
    confirmationDialogRef.componentInstance.btnOkText = 'Confirm';
    confirmationDialogRef.componentInstance.acceptAction = () => {
      this.alarmService.deleteAllAlarms();
    };
  }
}
