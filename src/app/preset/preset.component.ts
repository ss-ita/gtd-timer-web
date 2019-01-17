import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PresetService } from '../services/preset.service';
import { TimerService } from '../services/timer.service';
import { PresetModel } from '../models/preset.model';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-preset',
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.css'],
  providers: [SignupDialogComponent]
})

export class PresetComponent implements OnInit {

  presetModel: PresetModel;
  selectedPreset: string;
  presetForm: FormGroup;
  isViewable: boolean;
  isLoggedIn: boolean;
  isValid: boolean;

  constructor(
    private presetsFormDialogRef: MatDialogRef<PresetComponent>,
    private signupDialogComponent: SignupDialogComponent,
    private presetService: PresetService,
    private timerService: TimerService,
    private formBuilder: FormBuilder) { }

  onCreate() {
    this.presetService.createPreset(this.presetForm.value).subscribe();
    this.selectedPreset = this.presetService.getCreatedPreset();
    this.toggle();
  }

  onSave() {
    this.timerService.currentPreset = '#' + this.selectedPreset;
    this.onClose();
    this.presetService.startPresetTimers();
  }

  onClose() {
    this.presetsFormDialogRef.close();
  }

  toggle() {
    this.isViewable = !this.isViewable;
  }

  openSignUpDialogComponent() {
    this.signupDialogComponent.openSignUpForm();
    this.onClose();
  }

  get returnTimersFormGroupArray() {
    return this.presetForm.get('timers') as FormArray;
  }

  get returnPresetsArray() {
    return this.presetService.presetsArray;
  }

  getIsLoggedIn() {
    if (localStorage.getItem('access_token') === null) {
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
    return item.controls['timerName'].hasError('required') ? 'This field is required' :
      item.controls['timerName'].hasError('maxlength') ? 'Max length - 35 symbols' : '';
  }

  getErrorMessageHours() {
    return 'From 0 to 23';
  }

  getErrorMessageMinutesAndSeconds() {
    return 'From 0 to 59';
  }

  getAllStandardAndCustomPresets() {
    this.presetService.presetsArray = [];

    if (this.isLoggedIn) {
      this.getAllCustomPresetsFromServer();
    }

    this.presetService.getAllStandardPresetsFromServer().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        this.presetModel = new PresetModel();
        this.presetModel = this.presetService.convertToPresetModel(data[index]);
        this.presetService.pushPresetToLocalArray(this.presetModel);
      }
    });
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

  deleteTimerGroupRow(index) {
    if (this.returnTimersFormGroupArray.length !== 1) {
      this.returnTimersFormGroupArray.removeAt(index);
    }
  }

  addTimerGroupRow() {
    (<FormArray>this.presetForm.get('timers')).push(this.addTimerFormGroup());
  }

  addTimerFormGroup(): FormGroup {
    return this.formBuilder.group({
      timerName: ['', [Validators.required, Validators.maxLength(35)]],
      hours: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
      minutes: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
      seconds: ['', [Validators.required, Validators.min(0), Validators.max(59)]]
    });
  }

  ngOnInit() {
    this.presetForm = this.formBuilder.group({
      presetName: ['', [Validators.required, Validators.maxLength(35)]],
      timers: this.formBuilder.array([this.addTimerFormGroup()])
    });
    this.isValid = true;
    this.isViewable = false;
    this.selectedPreset = 'Standard №1';
    this.isLoggedIn = this.getIsLoggedIn();
  }
}
