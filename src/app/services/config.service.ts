import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  readonly baseUrl = 'https://localhost:44398';
  readonly urlLogIn = this.baseUrl + '/api/LogIn';
  readonly urlSoundAlarm = 'https://www.freespecialeffects.co.uk/soundfx/animals/cuckoo.wav';
  readonly urlSoundTimer = 'https://www.freespecialeffects.co.uk/soundfx/sirens/alarm_01.wav';
  readonly urlUser = this.baseUrl + '/api/user';

  constructor() { }
}
