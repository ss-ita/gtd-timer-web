import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  readonly urlSignUp = 'https://localhost:44398/api/signup';
  readonly urlLogIn='https://localhost:44398/api/LogIn';

  constructor() { }
}
