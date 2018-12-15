import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserCred } from './userschemasignin';

@Injectable()
export class AuthService {
     
    constructor(private http: HttpClient) {
    }
      
    login(email:string, password:string ) {
        return this.http.post<UserCred>('/api/login', {email, password})
    }
}