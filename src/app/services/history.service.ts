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

  getAllRecords():Observable<Record[]>{
    return this.httpClient.get<Record[]>(this.configService.urlTask+'GetAllRecordsByUserId');
  }

  deleteRecord(recordId:number){
    return this.httpClient.delete(this.configService.urlTask+ 'DeleteRecordById' + '/recordId');
  }

}
