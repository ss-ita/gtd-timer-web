import { PresetModel, Timer, PresetModelJson, TimerJson } from '../models/preset.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { TimerService } from './timer.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })

export class PresetService {

  presetModelJson: PresetModelJson;
  timerJsonArray: TimerJson[] = [];
  presetsArray: PresetModel[];
  presetModel: PresetModel;
  presetIndex: number;

  constructor(
    private configService: ConfigService,
    private timerService: TimerService,
    private httpClient: HttpClient,
    private jwthelper: JwtHelperService) { }

  createPreset(presetModel: PresetModel) {
    this.pushPresetToLocalArray(presetModel);
    this.presetModelJson = this.convertToPresetModelJson(presetModel);
    return this.httpClient.post(this.configService.urlPreset + 'CreatePreset', this.presetModelJson);
  }

  getAllStandardPresetsFromServer(): Observable<PresetModelJson[]> {
    return this.httpClient.get<PresetModelJson[]>(this.configService.urlPreset + 'GetAllStandardPresets');
  }

  getAllCustomPresetsFromServer(): Observable<PresetModelJson[]> {

    return this.httpClient.get<PresetModelJson[]>(this.configService.urlPreset + 'GetAllCustomPresets');
  }

  pushPresetToLocalArray(preset: PresetModel) {
    this.presetsArray.push(preset);
  }

  getCreatedPreset() {
    return this.presetsArray[this.presetsArray.length - 1].presetName;
  }

  startPresetTimers() {
    this.getChosenPresetIndex();
    this.timerService.initializeTimersArray(this.presetsArray[this.presetIndex].timers);
  }

  getChosenPresetIndex() {
    for (let index = 0; index < this.presetsArray.length; index++) {
      if (this.presetsArray[index].presetName === (this.timerService.currentPreset).substring(1)) {
        this.presetIndex = index;
      }
    }
  }

  convertToPresetModelJson(presetModel: PresetModel) {
    this.presetModelJson = new PresetModelJson();
    this.presetModelJson.presetName = presetModel.presetName;
    this.presetModelJson.timers = this.timerJsonArray;
    for (let index = 0; index < presetModel.timers.length; index++) {
      this.presetModelJson.timers[index] = new TimerJson();
      this.presetModelJson.timers[index].name = presetModel.timers[index].timerName;
      this.presetModelJson.timers[index].interval = presetModel.timers[index].hours + ':' + presetModel.timers[index].minutes
        + ':' + presetModel.timers[index].seconds;
    }
    return this.presetModelJson;
  }

  convertToPresetModel(presetModelJson: PresetModelJson) {
    this.presetModel = new PresetModel();
    this.presetModel.presetName = presetModelJson.presetName;
    this.presetModel.timers = [];
    for (let index = 0; index < presetModelJson.timers.length; index++) {
      this.presetModel.timers[index] = new Timer();
      this.presetModel.timers[index].timerName = presetModelJson.timers[index].name;
      const interval = presetModelJson.timers[index].interval;
      const splitInterval = interval.split(':');
      this.presetModel.timers[index].hours = Number(splitInterval[0]);
      this.presetModel.timers[index].minutes = Number(splitInterval[1]);
      this.presetModel.timers[index].seconds = Number(splitInterval[2]);
    }
    return this.presetModel;
  }
}
