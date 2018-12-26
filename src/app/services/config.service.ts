import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  readonly urlSignUp = 'https://localhost:44398/api/signup';
  readonly urlLogIn='https://localhost:44398/api/LogIn';
  readonly urlSoundAlarm='https://www.freespecialeffects.co.uk/soundfx/animals/cuckoo.wav';
  readonly urlSoundTimer='https://www.freespecialeffects.co.uk/soundfx/sirens/alarm_01.wav';

  constructor() { }
}
