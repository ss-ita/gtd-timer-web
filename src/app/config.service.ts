import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  url='https://localhost:44398/api/LogIn';

  constructor() { }
}
