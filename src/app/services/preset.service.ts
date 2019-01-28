import { PresetModel, Task, PresetModelJson, TaskJson, PresetModelToUpdate, TimerUpdate } from '../models/preset.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { TimerService } from './timer.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({ providedIn: 'root' })

export class PresetService {

  presetModelToUpdate: PresetModelToUpdate;
  standardPresets: PresetModel[] = [];
  presetModelJson: PresetModelJson;
  taskJsonArray: TaskJson[] = [];
  presetsArray: PresetModel[];
  presetIndexToUpdate: number;
  presetToUpdate: PresetModel;
  presetModel: PresetModel;
  presetIndex: number;
  timer = 0;

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

  createTask(taskToCreate: TaskJson) {
    return this.httpClient.post<TaskJson>(this.configService.urlTask + 'CreateTask', taskToCreate);
  }

  updatePreset(presetModel: PresetModel, presetToUpdate: PresetModel) {
    this.convertToPresetUpdateModel(presetModel, presetToUpdate);
    return this.httpClient.put<PresetModelToUpdate>(this.configService.urlPreset + 'UpdatePreset', this.presetModelToUpdate);
  }

  deletePreset(id: number) {
    return this.httpClient.delete(this.configService.urlPreset + 'DeletePreset/' + id.toString());
  }

  deleteTimer(id: number) {
    return this.httpClient.delete(this.configService.urlTask + 'DeleteTask/' + id.toString());
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
    this.deleteTimer(this.presetsArray[presetIndex].tasks[timerIndex].id).subscribe();
    const indexTimerToDelete = this.presetsArray[presetIndex].tasks.indexOf(this.presetsArray[presetIndex].tasks[timerIndex], 0);
    presetToUpdate.tasks.splice(indexTimerToDelete, 1);
  }

  updatePresetInLocalArrayAndServer(presetModel: PresetModel, presetToUpdate: PresetModel, presetIndex: number) {
    this.presetIndexToUpdate = presetIndex;
    this.updatePreset(presetModel, presetToUpdate).subscribe(data => {
      this.presetsArray[presetIndex].presetName = data.presetName;
      for (let index = 0; index < data.tasks.length; index++) {
        const times = data.tasks[index].goal.split(':');
        if (index >= this.presetsArray[presetIndex].tasks.length) {
          const task = new Task();
          task.id = data.tasks[index].id;
          task.taskName = data.tasks[index].name;
          task.hours = Number(times[0]);
          task.minutes = Number(times[1]);
          task.seconds = Number(times[2]);
          this.presetsArray[presetIndex].tasks.push(task);
        } else {
          this.presetsArray[presetIndex].tasks[index].id = data.tasks[index].id;
          this.presetsArray[presetIndex].tasks[index].taskName = data.tasks[index].name;
          this.presetsArray[presetIndex].tasks[index].hours = Number(times[0]);
          this.presetsArray[presetIndex].tasks[index].minutes = Number(times[1]);
          this.presetsArray[presetIndex].tasks[index].seconds = Number(times[2]);
        }
      }
    });
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
    this.timerService.initializeTimersArray(this.presetsArray[this.presetIndex].tasks);
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
    for (let index = 0; index < this.presetModelJson.tasks.length; index++) {
      this.presetModelJson.tasks[index].id = 0;
    }
  }

  convertToPresetModelJson(presetModel: PresetModel) {
    this.presetModelJson = new PresetModelJson();
    this.presetModelJson.presetName = presetModel.presetName;
    this.presetModelJson.id = presetModel.id;
    this.presetModelJson.tasks = [];
    for (let index = 0; index < presetModel.tasks.length; index++) {
      this.presetModelJson.tasks[index] = new TaskJson();
      this.presetModelJson.tasks[index].id = presetModel.tasks[index].id;
      this.presetModelJson.tasks[index].name = presetModel.tasks[index].taskName;
      this.presetModelJson.tasks[index].description = '';
      this.presetModelJson.tasks[index].elapsedTime = 0;
      this.presetModelJson.tasks[index].lastStartTime = '0001-01-01T00:00:00Z';
      this.presetModelJson.tasks[index].goal = presetModel.tasks[index].hours + ':' + presetModel.tasks[index].minutes
        + ':' + presetModel.tasks[index].seconds;
      this.presetModelJson.tasks[index].isActive = false;
      this.presetModelJson.tasks[index].isRunning = false;
      this.presetModelJson.tasks[index].watchtype = this.timer;
    }
    return this.presetModelJson;
  }

  convertToPresetModel(presetModelJson: PresetModelJson) {
    this.presetModel = new PresetModel();
    this.presetModel.presetName = presetModelJson.presetName;
    this.presetModel.id = presetModelJson.id;
    this.presetModel.tasks = [];
    for (let index = 0; index < presetModelJson.tasks.length; index++) {
      this.presetModel.tasks[index] = new Task();
      this.presetModel.tasks[index].id = presetModelJson.tasks[index].id;
      this.presetModel.tasks[index].taskName = presetModelJson.tasks[index].name;
      const interval = presetModelJson.tasks[index].goal;
      const splitInterval = interval.split(':');
      this.presetModel.tasks[index].hours = Number(splitInterval[0]);
      this.presetModel.tasks[index].minutes = Number(splitInterval[1]);
      this.presetModel.tasks[index].seconds = Number(splitInterval[2]);
    }
    return this.presetModel;
  }

  convertToPresetUpdateModel(presetModel: PresetModel, presetToUpdate: PresetModel) {
    this.presetModelToUpdate = new PresetModelToUpdate();
    this.presetModelToUpdate.presetName = presetModel.presetName;
    this.presetModelToUpdate.id = presetToUpdate.id;
    this.presetModelToUpdate.tasks = [];
    for (let index = 0; index < presetModel.tasks.length; index++) {
      this.presetModelToUpdate.tasks[index] = new TaskJson();
      this.presetModelToUpdate.tasks[index].name = presetModel.tasks[index].taskName;
      this.presetModelToUpdate.tasks[index].goal = presetModel.tasks[index].hours + ':'
        + presetModel.tasks[index].minutes + ':' + presetModel.tasks[index].seconds;
      if (index >= presetToUpdate.tasks.length) {
        this.presetModelToUpdate.tasks[index].id = 0;
      } else {
        this.presetModelToUpdate.tasks[index].id = presetToUpdate.tasks[index].id;
      }
      this.presetModelToUpdate.tasks[index].description = '';
      this.presetModelToUpdate.tasks[index].elapsedTime = 0;
      this.presetModelToUpdate.tasks[index].isActive = false;
      this.presetModelToUpdate.tasks[index].isRunning = false;
      this.presetModelToUpdate.tasks[index].watchtype = this.timer;
      this.presetModelToUpdate.tasks[index].lastStartTime = '0001-01-01T00:00:00Z';
    }
  }
}
