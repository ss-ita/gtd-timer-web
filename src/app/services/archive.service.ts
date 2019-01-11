import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { ConfigService } from './config.service';
import {Observable} from 'rxjs';
import { TaskJson } from '../models/taskjson.model';
import {Task} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService implements OnInit{

  constructor(private http:HttpClient,
    private service: ConfigService) { }
 
  ngOnInit(){
  }

  _url:string = 'assets/data.json';

  getTasksFromServer():Observable<TaskJson[]>{
    const headers = this.getHeaders();
    return this.http.get<TaskJson[]>(this.service.urlTask+'GetAllArchivedTasksByUserId',{headers:headers});
    } 
    
  deleteTask(id:Number){
    const headers = this.getHeaders();
    return this.http.delete(this.service.urlTask+'DeleteTask/'+id.toString(),{headers:headers});
  };

  updateTask(task:Task){
    const headers = this.getHeaders();
    return this.http.put<TaskJson>(this.service.urlTask+'SwitchArchivedStatus',task.convertToTaskJson(),{headers:headers});
  };

  private getHeaders()
  {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });

    return headers;
  }
}
