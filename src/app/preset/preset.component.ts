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
  isValidate = true;

  constructor(
    private presetsFormDialogRef: MatDialogRef<PresetComponent>,
    private signupDialogComponent: SignupDialogComponent,
    private presetService: PresetService,
    private timerService: TimerService,
    private formBuilder: FormBuilder) { }

  onCreate() {
    this.presetService.pushPreset(this.presetForm.value).subscribe(
      response => console.log('Success!', response),
      error => console.error('Error!', error));
    this.selectedPreset = this.presetService.getCreatedSchema();
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

  openSinUpDialogComponent() {
    this.signupDialogComponent.openSignUpForm();
    this.onClose();
  }

  get returnTimerFormGroupArray() {
    return this.presetForm.get('timers') as FormArray;
  }

  get returnPresetArray() {
    return this.presetService.presetsArray;
  }

  getAllStandartAndCustomPresets() {
    this.presetService.presetsArray = [];

    if (this.isLoggedIn) {
      this.getAllCustomPresets();
    }

    this.presetService.getGetAllStandardPresetsFromServer().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        this.presetModel = new PresetModel();
        this.presetModel = this.presetService.convertToPresetModel(data[index]);
        this.presetService.pushPresetToArrayFromServer(this.presetModel);
      }
    });
  }

  getAllCustomPresets() {
    this.presetService.getGetAllCustomPresetsFromServer().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        this.presetModel = new PresetModel();
        this.presetModel = this.presetService.convertToPresetModel(data[index]);
        this.presetService.pushPresetToArrayFromServer(this.presetModel);
      }
    });
  }

  addTimerGroupRow() {
    (<FormArray>this.presetForm.get('timers')).push(this.addTimerFormGroup());
  }

  deleteTimerGroupRow(index) {
    this.returnTimerFormGroupArray.removeAt(index);
  }

  returnIsLoggedIn() {
    if (localStorage.getItem('access_token') === null) {
      return false;
    } else {
      return true;
    }
  }

  getErrorMessagePresetName() {
    return this.presetForm.controls['presetName'].hasError('required') ? 'This field is required' : '';
  }
  getErrorMessageTimerName(item: FormGroup) {
    return item.controls['timerName'].hasError('required') ? 'This field is required' : '';
  }
  getErrorMessageHours() {
    return 'From 0 to 24';
  }
  getErrorMessageMinutesAndSeconds() {
    return 'From 0 to 60';
  }

  ngOnInit() {
    this.presetForm = this.formBuilder.group({
      presetName: ['', [Validators.required]],
      timers: this.formBuilder.array([this.addTimerFormGroup()])
    });
    this.isViewable = false;
    this.isValidate = true;
    this.selectedPreset = 'standard';
    this.isLoggedIn = this.returnIsLoggedIn();
  }

  addTimerFormGroup(): FormGroup {
    return this.formBuilder.group({
      timerName: ['', [Validators.required]],
      hours: ['', [Validators.required, Validators.min(0), Validators.max(23)]],
      minutes: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
      seconds: ['', [Validators.required, Validators.min(0), Validators.max(59)]]
    });
  }
}
