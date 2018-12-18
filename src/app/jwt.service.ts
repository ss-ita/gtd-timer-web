import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
providedIn: 'root'
})

export class JwtService {
    constructor(private httpClient: HttpClient) { }

  signin(email:string, password:string) {
      return this.httpClient.post<any>('https://localhost:44398/api/LogIn', {email, password}).pipe(map(value => {
       if(value&&value.token)
      localStorage.setItem('access_token',JSON.stringify(value));

      return value;
  }));
  }
  
  signout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }
  
  
}
