import { PresetModel, Timer, PresetModelJson, TimerJson, PresetModelToUpdate, TimerUpdate } from '../models/preset.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { TimerService } from './timer.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class PresetService {

  presetModelToUpdate: PresetModelToUpdate;
  standardPresets: PresetModel[] = [];
  presetModelJson: PresetModelJson;
  timerJsonArray: TimerJson[] = [];
  presetsArray: PresetModel[];
  presetIndexToUpdate: number;
  presetToUpdate: PresetModel;
  presetModel: PresetModel;
  presetIndex: number;

  constructor(
    private configService: ConfigService,
    private timerService: TimerService,
    private httpClient: HttpClient) { }

  createPreset(presetModel: PresetModel) {
    this.pushPresetToLocalArray(presetModel);
    this.presetModelJson = this.convertToPresetModelJson(presetModel);
    this.prepareModelToCreate();
    return this.httpClient.post<PresetModelJson>(this.configService.urlPreset + 'CreatePreset', this.presetModelJson);
  }

  createTimer(timerToCreate: TimerUpdate) {
    return this.httpClient.post<TimerUpdate>(this.configService.urlPreset + 'CreateTimer', timerToCreate);
  }

  updatePreset(presetModel: PresetModel, presetToUpdate: PresetModel) {
    this.convertToPresetUpdateModel(presetModel, presetToUpdate);
    return this.httpClient.put(this.configService.urlPreset + 'UpdatePreset', this.presetModelToUpdate);
  }

  deletePreset(id: number) {
    return this.httpClient.delete(this.configService.urlPreset + 'DeletePreset/' + id.toString);
  }

  deleteTimer(id: number) {
    return this.httpClient.delete(this.configService.urlPreset + 'DeleteTimer/' + id.toString());
  }

  getAllStandardPresetsFromServer(): Observable<PresetModelJson[]> {
    return this.httpClient.get<PresetModelJson[]>(this.configService.urlPreset + 'GetAllStandardPresets');
  }

  getAllCustomPresetsFromServer(): Observable<PresetModelJson[]> {

    return this.httpClient.get<PresetModelJson[]>(this.configService.urlPreset + 'GetAllCustomPresets');
  }

  deletePresetFromLocalArrayAndServer(presetIndex) {
    this.deletePreset(this.presetsArray[presetIndex].id).subscribe();
    const indexPresetToDelete = this.presetsArray.indexOf(this.presetsArray[presetIndex], 0);
    this.presetsArray.splice(indexPresetToDelete, 1);
  }

  deleteTimerFromLocalArrayAndServer(timerIndex, presetIndex, presetToUpdate) {
    this.presetToUpdate = presetToUpdate;
    this.deleteTimer(this.presetsArray[presetIndex].timers[timerIndex].id).subscribe();
    const indexTimerToDelete = this.presetsArray[presetIndex].timers.indexOf(this.presetsArray[presetIndex].timers[timerIndex], 0);
    presetToUpdate.timers.splice(indexTimerToDelete, 1);
  }

  updatePresetInLocalArrayAndServer(presetModel: PresetModel, presetToUpdate: PresetModel, presetIndex: number) {
    this.presetIndexToUpdate = presetIndex;
    this.updatePreset(presetModel, presetToUpdate).subscribe();
    this.presetsArray[presetIndex] = presetModel;
    this.presetsArray[presetIndex].id = presetToUpdate.id;
    for (let index = 0; index < presetToUpdate.timers.length; index++) {
      this.presetsArray[presetIndex].timers[index].id = presetToUpdate.timers[index].id;
    }
  }

  pushPresetToLocalArray(preset: PresetModel) {
    this.presetsArray.push(preset);
  }

  pushToStandardPresetsArray(preset: PresetModel) {
    this.standardPresets.push(preset);
  }

  getPresetByIndex(index) {
    return this.presetsArray[index];
  }

  getPresetNameByIndex(index) {
    return this.presetsArray[index].presetName;
  }

  getCreatedPresetName() {
    return this.presetsArray[this.presetsArray.length - 1].presetName;
  }

  getCreatedPreset() {
    return this.presetsArray[this.presetsArray.length - 1];
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

  prepareModelToCreate() {
    this.presetModelJson.id = 0;
    for (let index = 0; index < this.presetModelJson.timers.length; index++) {
      this.presetModelJson.timers[index].id = 0;
    }
  }

  convertToPresetModelJson(presetModel: PresetModel) {
    this.presetModelJson = new PresetModelJson();
    this.presetModelJson.presetName = presetModel.presetName;
    this.presetModelJson.id = presetModel.id;
    this.presetModelJson.timers = [];
    for (let index = 0; index < presetModel.timers.length; index++) {
      this.presetModelJson.timers[index] = new TimerJson();
      this.presetModelJson.timers[index].id = presetModel.timers[index].id;
      this.presetModelJson.timers[index].name = presetModel.timers[index].timerName;
      this.presetModelJson.timers[index].interval = presetModel.timers[index].hours + ':' + presetModel.timers[index].minutes
        + ':' + presetModel.timers[index].seconds;
    }
    return this.presetModelJson;
  }

  convertToPresetModel(presetModelJson: PresetModelJson) {
    this.presetModel = new PresetModel();
    this.presetModel.presetName = presetModelJson.presetName;
    this.presetModel.id = presetModelJson.id;
    this.presetModel.timers = [];
    for (let index = 0; index < presetModelJson.timers.length; index++) {
      this.presetModel.timers[index] = new Timer();
      this.presetModel.timers[index].id = presetModelJson.timers[index].id;
      this.presetModel.timers[index].timerName = presetModelJson.timers[index].name;
      const interval = presetModelJson.timers[index].interval;
      const splitInterval = interval.split(':');
      this.presetModel.timers[index].hours = Number(splitInterval[0]);
      this.presetModel.timers[index].minutes = Number(splitInterval[1]);
      this.presetModel.timers[index].seconds = Number(splitInterval[2]);
    }
    return this.presetModel;
  }

  convertToPresetUpdateModel(presetModel: PresetModel, presetToUpdate: PresetModel) {
    this.presetModelToUpdate = new PresetModelToUpdate();
    this.presetModelToUpdate.presetName = presetModel.presetName;
    this.presetModelToUpdate.id = presetToUpdate.id;
    this.presetModelToUpdate.timers = [];
    for (let index = 0; index < presetModel.timers.length; index++) {
      if (index >= presetToUpdate.timers.length) {
        const timerToCreate = new TimerUpdate();
        timerToCreate.id = 0;
        timerToCreate.name = presetModel.timers[index].timerName;
        timerToCreate.presetId = presetToUpdate.id;
        timerToCreate.interval = presetModel.timers[index].hours + ':' + presetModel.timers[index].minutes
          + ':' + presetModel.timers[index].seconds;
        this.createTimer(timerToCreate).subscribe(data => {
          this.presetsArray[this.presetIndexToUpdate].timers[index].id = data.id;
        });
      } else {
        this.presetModelToUpdate.timers[index] = new TimerUpdate();
        this.presetModelToUpdate.timers[index].name = presetModel.timers[index].timerName;
        this.presetModelToUpdate.timers[index].presetId = presetToUpdate.id;
        this.presetModelToUpdate.timers[index].interval = presetModel.timers[index].hours + ':'
          + presetModel.timers[index].minutes + ':' + presetModel.timers[index].seconds;
        this.presetModelToUpdate.timers[index].id = presetToUpdate.timers[index].id;
      }
    }
  }
}
