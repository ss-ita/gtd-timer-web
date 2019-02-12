import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  public readonly baseUrl: string = environment.apiUrl;
  public readonly urlAdmin: string = this.baseUrl + '/api/User/';
  public readonly urlTask: string = this.baseUrl + '/api/Tasks/';
  public readonly urlPreset: string = this.baseUrl + '/api/Preset/';
  public readonly urlAlarm: string = this.baseUrl + '/api/Alarm/';
  public readonly urlLogIn: string = this.baseUrl + '/api/LogIn';
  public readonly urlGoogleLogIn: string = this.baseUrl + '/api/LogIn/GoogleLogin';
  public readonly urlFacebookLogIn: string = this.baseUrl + '/api/LogIn/FacebookLogin';
  public readonly urlExportAllTasksAsXml: string = this.baseUrl + '/api/Tasks/ExportAllTasksAsXmlByUserId';
  public readonly urlExportTaskAsXmlById: string = this.baseUrl + '/api/Tasks/ExportTaskAsXmlById/';
  public readonly urlExportAllTasksAsCsv: string = this.baseUrl + '/api/Tasks/ExportAllTasksAsCsvByUserId';
  public readonly urlExportAllStopwatchesAsCsv: string = this.baseUrl + '/api/Tasks/ExportAllStopwatchesAsCsvByUserId';
  public readonly urlExportAllTimersAsCsv: string = this.baseUrl + '/api/Tasks/ExportAllTimersAsCsvByUserId';
  public readonly urlExportAllStopwatchesAsXml: string = this.baseUrl + '/api/Tasks/ExportAllStopwatchesAsXmlByUserId';
  public readonly urlExportAllTimersAsXml: string = this.baseUrl + '/api/Tasks/ExportAllTimersAsXmlByUserId';
  public readonly urlExportTaskAsCsvById: string = this.baseUrl + '/api/Tasks/ExportTaskAsCsvById/';
  public readonly urlExportAllRecordsAsCsv: string = this.baseUrl + '/api/Tasks/ExportAllRecordsAsCsvByUserId';
  public readonly urlExportAllRecordsAsXml: string = this.baseUrl + '/api/Tasks/ExportAllRecordsAsXmlByUserId';
  public readonly urlExportAllStopwatchesRecordsAsCsv: string = this.baseUrl + '/api/Tasks/ExportAllStopwatchesRecordsAsCsvByUserId';
  public readonly urlExportAllStopwatchesRecordsAsXml: string = this.baseUrl + '/api/Tasks/ExportAllStopwatchesRecordsAsXmlByUserId';
  public readonly urlExportAllTimersRecordsAsCsv: string = this.baseUrl + '/api/Tasks/ExportAllTimersRecordsAsCsvByUserId';
  public readonly urlExportAllTimersRecordsAsXml: string = this.baseUrl + '/api/Tasks/ExportAllTimersRecordsAsXmlByUserId';
  public readonly urlImportTasksAsCsv: string = this.baseUrl + '/api/Tasks/ImportTasksAsCsv';
  public readonly urlImportTasksAsXml: string = this.baseUrl + '/api/Tasks/ImportTasksAsXml';
  public readonly urlSoundAlarm: string = 'https://www.freespecialeffects.co.uk/soundfx/animals/cuckoo.wav';
  public readonly urlSoundTimer: string = 'https://www.freespecialeffects.co.uk/soundfx/bells/church_bells_02.wav';
  public readonly urlFacebookIcon: string = 'https://img.icons8.com/color/48/000000/facebook.png';
  public readonly urlGoogleIcon: string = 'https://img.icons8.com/color/48/000000/google-plus.png';
  public readonly urlUser: string = this.baseUrl + '/api/user';
  public readonly urlGetAllTasks: string = this.baseUrl + '/api/tasks/GetAllTasksByUserId';
  public readonly urlGetAllRecordsByUserId: string = this.baseUrl + '/api/tasks/GetAllRecordsByUserId';
  public readonly urlHub: string = this.baseUrl + '/Hubs/Task';
  public readonly delay: number = 3000;

  constructor() { }
}

