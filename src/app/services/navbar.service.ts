import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  navLinks: BehaviorSubject<any[]> = new BehaviorSubject<any[]>
    ([
      {
        label: 'Timer',
        link: './timer',
        index: 0
      }, {
        label: 'Alarm',
        link: './alarm',
        index: 1
      }, {
        label: 'Stopwatch',
        link: './stopwatch',
        index: 2
      }, {
        label: 'Sign In',
        link: './signin',
        index: 3
      }
    ]);
  show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  email: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('email'));
}
