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
        icon: 'fa-clock fa-lg',
        index: 0
      }, {
        label: 'Alarm',
        link: './alarm',
        icon: 'fa-bell fa-lg',
        index: 1
      }, {
        label: 'Stopwatch',
        link: './stopwatch',
        icon: 'fa-stopwatch fa-lg',
        index: 2
      }, {
        label: 'Sign In',
        link: './signin',
        icon: 'fa-sign-in-alt fa-lg',
        index: 3
      }
    ]);
  show: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  email: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('email'));
}
