import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService { 
  public readonly urlTask = 'https://localhost:44398/api/Tasks/';
  public readonly baseUrl: string = 'https://localhost:44398';
  public readonly urlPreset =  'https://localhost:44398/api/Preset/';
  public readonly urlLogIn: string = this.baseUrl + '/api/LogIn';
  public readonly urlGoogleLogIn: string = this.baseUrl + '/api/LogIn/GoogleLogin';
  public readonly urlFacebookLogIn: string = this.baseUrl + '/api/LogIn/FacebookLogin';
  public readonly urlSoundAlarm: string = 'https://www.freespecialeffects.co.uk/soundfx/animals/cuckoo.wav';
  public readonly urlSoundTimer: string = 'https://www.freespecialeffects.co.uk/soundfx/bells/church_bells_02.wav';
  public readonly urlFacebookIcon: string = 'https://img.icons8.com/color/48/000000/facebook.png';
  public readonly urlGoogleIcon: string = 'https://img.icons8.com/color/48/000000/google-plus.png';
  public readonly urlUser: string = this.baseUrl + '/api/user';
  public readonly urlGetAllTasks: string = this.baseUrl + '/api/tasks/GetAllTasksByUserId';
  public readonly delay: number = 3000;


  constructor() { }
}
export function jwtTokenGetter() {
  return ()=>localStorage.getItem('access_token');
}

