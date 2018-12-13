import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SignService {

  constructor(private http: HttpClient) { }
  getUserDetails(email,password)
  {
    return this.http.post('url',
    {
      email,
      password
    }).subscribe(data => {
      console.log(data, "is what we got fro the server")
    })
  }
}
