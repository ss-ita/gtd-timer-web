import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service'


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  title = 'myApp';
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private router: Router,
    private jwtservice: JwtService) 
    {
     
    if(localStorage.getItem('access_token')){
    this.navLinks = [
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
        label: 'Tasks',
        link: './tasks',
        index: 3
      }, {
        label: 'Statistics',
        link: './statistics',
        index: 4
      },{
        label: 'Archive',
        link: './archive',
        index: 5
      }, {
        label: 'Welcome '+localStorage.getItem('email'),
        link: './sett',
        index: 6
      }
  ];
}
else{
  this.navLinks = [
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
        label: 'Task Management',
        link: './task-management',
        index: 3
    }, {
       label: 'Sign In',
       link: './signin',
       index: 4
    }
  ];
}
}
ngOnInit(): void {
  this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
  });
}
signout():void{
    this.jwtservice.signout();
    window.location.reload();
    this.router.navigate(['signin']);
}
}
