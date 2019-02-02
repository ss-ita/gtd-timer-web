import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import {Record}from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private configService: ConfigService,private httpClient: HttpClient) { }

  createRecord(record:Record){
    return this.httpClient.post(this.configService.urlTask + 'CreateRecord',record );
  }

  getAllRecords():Observable<Record[]>{
    return this.httpClient.get<Record[]>(this.configService.urlTask+'GetAllRecordsByUserId');
  }

  deleteRecord(recordId:number){
    return this.httpClient.delete(this.configService.urlTask+ 'DeleteRecordById/' + recordId.toString());
  }

  resetAndStartTask(recordId:number){
    return this.httpClient.get(this.configService.urlTask + 'ResetTaskFromHistory/' + recordId.toString());
  }
}
