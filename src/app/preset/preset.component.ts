import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MatIconRegistry, MatDialog } from '@angular/material';
import { PresetService } from '../services/preset.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TimerService } from '../services/timer.service';
import { PresetModel } from '../models/preset.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preset',
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.css'],
  providers: [ConfirmationDialogComponent]
})

export class PresetComponent implements OnInit {

  minTimersGroupFormArrayLength: number;
  presetToUpdate: PresetModel;
  presetModel: PresetModel;
  selectedPreset: string;
  isUpdateState: boolean;
  isCreateState: boolean;
  timersToDelete: any[];
  presetForm: FormGroup;
  presetIndex: number;
  isViewable: boolean;
  isLoggedIn: boolean;
  isValid: boolean;

  constructor(
    private presetsFormDialogRef: MatDialogRef<PresetComponent>,
    private presetService: PresetService,
    private timerService: TimerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/img/delete.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/img/edit.svg'));
    this.timersToDelete = [];
  }

  onCreate() {
    this.presetService.createPreset(this.presetForm.value).subscribe(data => {
      this.presetService.presetsArray[this.presetService.presetsArray.length - 1].id = data.id;
      for (let index = 0; index < data.tasks.length; index++) {
        this.presetService.presetsArray[this.presetService.presetsArray.length - 1].tasks[index].id = data.tasks[index].id;
      }
    });
    this.selectedPreset = this.presetService.getCreatedPresetName();
    for (let index = 0; index < this.presetService.getCreatedPreset().tasks.length; index++) {
      this.returnTimersFormGroupArray.removeAt(index);
    }
    this.toggle();
  }

  onUpdate() {
    for (let index = 0; index < this.timersToDelete.length; index++) {
      this.presetService.deleteTimerFromLocalArrayAndServer(this.timersToDelete[index], this.presetIndex, this.presetToUpdate);
    }
    this.presetService.updatePresetInLocalArrayAndServer(this.presetForm.value, this.presetToUpdate, this.presetIndex);
    this.selectedPreset = this.presetService.getPresetNameByIndex(this.presetIndex);
    this.cleanUpTheTimersFormGroupArray();
    this.switchTheCreateAndUpdateState();
    this.toggle();
  }

  onUpdateIcon(presetIndex) {
    this.presetIndex = presetIndex;
    this.presetToUpdate = this.presetService.getPresetByIndex(presetIndex);
    this.cleanUpTheTimersFormGroupArray();
    this.loadDataToUpdateMenu(this.presetToUpdate);
    this.switchTheCreateAndUpdateState();
    this.toggle();
  }

  onDeletePreset(presetIndex) {
    this.presetService.deletePresetFromLocalArrayAndServer(presetIndex);
    this.selectedPreset = this.getFirstStandardPreset();
  }

  onDeleteTimer(index) {
    if (this.isUpdateState && this.returnTimersFormGroupArray.length >= this.minTimersGroupFormArrayLength) {
      if (index >= this.presetToUpdate.tasks.length) {
        this.returnTimersFormGroupArray.removeAt(index);
      } else {
        this.timersToDelete.push(index);
        this.returnTimersFormGroupArray.removeAt(index);
      }
    }
    if (this.isCreateState && this.returnTimersFormGroupArray.length !== 1) {
      this.returnTimersFormGroupArray.removeAt(index);
    }
  }

  onSave() {
    this.timerService.currentPreset = this.selectedPreset;
    this.onClose();
    this.presetService.startPresetTimers();
  }

  onClose() {
    this.presetsFormDialogRef.close();
    this.isUpdateState = !this.isUpdateState;
  }

  onSignIn() {
    this.router.navigateByUrl('/signin');
    this.onClose();
  }

  openConfirmationDialog(presetIndex) {
    const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: false
    });
    confirmationDialogRef.componentInstance.title = 'Warning';
    confirmationDialogRef.componentInstance.message = 'Are you sure to delete preset?';
    confirmationDialogRef.componentInstance.btnCancelText = 'Cancel';
    confirmationDialogRef.componentInstance.btnOkText = 'Confirm';
    confirmationDialogRef.componentInstance.acceptAction = () => {
      this.onDeletePreset(presetIndex);
    };
    confirmationDialogRef.componentInstance.declineAction = () => {
      this.selectedPreset = this.getFirstStandardPreset();
    };
  }

  cleanUpTheTimersFormGroupArray() {
    for (let index = 0; index < this.presetToUpdate.tasks.length; index++) {
      this.returnTimersFormGroupArray.removeAt(index);
    }
  }

  toggle() {
    this.isViewable = !this.isViewable;
    this.isCreateState = !this.isCreateState;
  }

  switchTheCreateAndUpdateState() {
    this.isUpdateState = !this.isUpdateState;
    this.isCreateState = !this.isCreateState;
  }

  get returnTimersFormGroupArray() {
    return this.presetForm.get('tasks') as FormArray;
  }

  get returnPresetsArray() {
    return this.presetService.presetsArray;
  }

  getFirstStandardPreset() {
    return this.presetService.standardPresets[0].presetName;
  }

  getIsLoggedIn() {
    return localStorage.getItem('access_token') === null ? false : true;
  }

  isPresetStandard(preset: PresetModel) {
    if (preset.id === this.presetService.standardPresets[0].id
      || preset.id === this.presetService.standardPresets[1].id) {
      return false;
    } else {
      return true;
    }
  }

  getErrorMessagePresetName() {
    return this.presetForm.controls['presetName'].hasError('required') ? 'This field is required' :
      this.presetForm.controls['presetName'].hasError('maxlength') ? 'Max length - 35 symbols' : '';
  }

  getErrorMessageTimerName(item: FormGroup) {
    return item.controls['taskName'].hasError('required') ? 'This field is required' :
      item.controls['taskName'].hasError('maxlength') ? 'Max length - 35 symbols' : '';
  }

  getErrorMessageHours() {
    return 'From 0 to 23';
  }

  getErrorMessageMinutesAndSeconds() {
    return 'From 0 to 59';
  }

  getAllStandardAndCustomPresets() {
    this.presetService.presetsArray = [];

    this.presetService.getAllStandardPresetsFromServer().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        this.presetModel = new PresetModel();
        this.presetModel = this.presetService.convertToPresetModel(data[index]);
        this.presetService.pushPresetToLocalArray(this.presetModel);
        this.presetService.pushToStandardPresetsArray(this.presetModel);
      }
    });

    this.getIsLoggedIn();
    if (this.isLoggedIn) {
      this.getAllCustomPresetsFromServer();
    }
  }

  getAllCustomPresetsFromServer() {
    this.presetService.getAllCustomPresetsFromServer().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        this.presetModel = new PresetModel();
        this.presetModel = this.presetService.convertToPresetModel(data[index]);
        this.presetService.pushPresetToLocalArray(this.presetModel);
      }
    });
  }

  addTimerGroupRow() {
    (<FormArray>this.presetForm.get('tasks')).push(this.addTimerFormGroup());
  }

  addTimerFormGroup(): FormGroup {
    return this.formBuilder.group({
      taskName: ['', [Validators.required, Validators.maxLength(35)]],
      hours: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
      minutes: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
      seconds: ['', [Validators.required, Validators.min(0), Validators.max(59)]]
    });
  }

  loadDataToUpdateMenu(presetToUpdate: PresetModel) {
    this.returnTimersFormGroupArray.removeAt(0);
    this.presetForm.controls['presetName'].setValue(presetToUpdate.presetName);
    for (let index = 0; index < presetToUpdate.tasks.length; index++) {
      (<FormArray>this.presetForm.get('tasks')).push(this.formBuilder.group({
        taskName: [presetToUpdate.tasks[index].taskName, [Validators.required, Validators.maxLength(35)]],
        hours: [presetToUpdate.tasks[index].hours, [Validators.required, Validators.min(0), Validators.max(23)]],
        minutes: [presetToUpdate.tasks[index].minutes, [Validators.required, Validators.min(0), Validators.max(59)]],
        seconds: [presetToUpdate.tasks[index].seconds, [Validators.required, Validators.min(0), Validators.max(59)]]
      }));
    }
  }

  ngOnInit() {
    this.presetForm = this.formBuilder.group({
      presetName: ['', [Validators.required, Validators.maxLength(35)]],
      tasks: this.formBuilder.array([this.addTimerFormGroup()])
    });
    this.isValid = true;
    this.isViewable = false;
    this.isUpdateState = false;
    this.isCreateState = false;
    this.minTimersGroupFormArrayLength = 2;
    this.isLoggedIn = this.getIsLoggedIn();
    this.selectedPreset = this.getFirstStandardPreset();
  }
}
