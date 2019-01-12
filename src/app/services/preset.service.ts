import { PresetModel, Timer, PresetModelJson, TimerJson } from '../models/preset.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { TimerService } from './timer.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PresetService {

  presetModelJson: PresetModelJson;
  timerJsonArray: TimerJson[] = [];
  presetsArray: PresetModel[];
  presetModel: PresetModel;
  presetIndex: number;

  constructor(
    private timerService: TimerService,
    private config: ConfigService,
    private http: HttpClient) { }

  private getHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
    return headers;
  }

  createPreset(presetModelJson: PresetModelJson) {
    return this.http.post(this.config.urlPreset + 'CreatePreset', presetModelJson, { headers: this.getHeaders() });
  }

  getGetAllStandardPresetsFromServer(): Observable<PresetModelJson[]> {
    return this.http.get<PresetModelJson[]>(this.config.urlPreset + 'GetAllStandardPresets', { headers: this.getHeaders() });
  }

  getGetAllCustomPresetsFromServer(): Observable<PresetModelJson[]> {
    return this.http.get<PresetModelJson[]>(this.config.urlPreset + 'GetAllCustomPresets', { headers: this.getHeaders() });
  }

  pushPreset(preset: PresetModel) {
    this.pushPresetToArrayFromServer(preset);
    return this.createPreset(this.convertToPresetModelJson(preset));
  }

  pushPresetToArrayFromServer(preset: PresetModel) {
    this.presetsArray.push(preset);
  }
  getCreatedSchema() {
    return this.presetsArray[this.presetsArray.length - 1].presetName;
  }

  startPresetTimers() {
    this.getChoosenPresetIndex();
    this.timerService.initializeTimerArray(this.presetsArray[this.presetIndex].timers);
  }

  getChoosenPresetIndex() {
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
      this.presetModelJson.timers[index].interval = presetModel.timers[index].hours + ":" + presetModel.timers[index].minutes + ":" + presetModel.timers[index].seconds;
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
      var interval = presetModelJson.timers[index].interval;
      var splitInterval = interval.split(':');
      this.presetModel.timers[index].hours = Number(splitInterval[0]);
      this.presetModel.timers[index].minutes = Number(splitInterval[1]);
      this.presetModel.timers[index].seconds = Number(splitInterval[2]);
    }
    return this.presetModel;
  }
}
