import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { NavbarService } from '../services/navbar.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { PresetComponent } from '../preset/preset.component';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { AlarmService } from '../services/alarm.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [PresetComponent , SignupDialogComponent]
})
export class NavBarComponent implements OnInit {

  title = 'myApp';
  navLinks: any[];
  activeLinkIndex = -1;
  show = false;
  email = localStorage.getItem('email');
  hours = 24;
  milisecinhours = 3600000;
  signinLink = '/signin';

  constructor(private router: Router,
    private jwtservice: JwtService,
    private navservice: NavbarService,
    public roleService: RoleService,
    private jwthelper: JwtHelperService,
    private userService: UserService,
    private presetComponent: PresetComponent,
    private alarmService: AlarmService) {
    this.navservice.navLinks.subscribe(value => { this.navLinks = value; });
    this.navservice.show.subscribe(value => { this.show = value; });
    this.navservice.email.subscribe(value => { this.email = value; });
    if (localStorage.getItem('access_token')) {
      this.show = true;
      this.roleService.getRoles();
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
        }, {
          label: 'History',
          link: './history',
          index: 5
        }
      ];
    } else {
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
          label: 'Sign In',
          link: './signin',
          index: 3
        }
      ];
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
      if (this.router.url != this.signinLink) {
        this.userService.redirectUrl = this.router.url;
      }
    });
  }

  btnClickSettings(): void {
    this.router.navigateByUrl('/settings');
  }

  btnClickInfo(): void {
    this.router.navigateByUrl('/info');
  }

  btnClickAdmin(): void {
    this.router.navigateByUrl('/admin');
  }

  signout(): void {
    this.jwtservice.signout();
    this.navLinks = this.navLinks.slice(0, 3);
    this.navLinks.push({
      label: 'Sign In',
      link: './signin',
      index: 3
    });
    this.show = false;
    const link = this.navLinks.find(tab => tab.link === '.' + this.userService.redirectUrl);
    this.router.navigateByUrl(link ? this.userService.redirectUrl : this.signinLink);
    this.presetComponent.getAllStandardAndCustomPresets();
    this.alarmService.clearData();
  }

  tokenexpire() {
    if ((this.jwthelper.getTokenExpirationDate(localStorage.getItem('access_token')).getTime()
      - this.hours * this.milisecinhours) < (new Date()).getTime()) {
      this.signout();
    }
  }

  signin(): void {
    this.navLinks.push(
      {
        label: 'Tasks',
        link: './tasks',
        index: 3
      }, {
        label: 'Statistics',
        link: './statistics',
        index: 4
      }, {
        label: 'History',
        link: './history',
        index: 5
      });
  }
}
