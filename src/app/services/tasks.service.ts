import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class TasksService implements OnInit {
    constructor(private http: HttpClient,
        private service: ConfigService) { }
    ngOnInit() { }

    private getHeaders() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        });
        return headers;
    }
}
