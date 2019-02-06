import { Component, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  searchText: string;
  selected = 'Users';

  constructor(public roleService: RoleService,
    private router: Router) {
   }

  ngOnInit() {
    this.roleService.emailOfUsers = [];
    this.roleService.emailOfAdmins = [];
    this.roleService.getEmails('User');
    this.roleService.getEmails('Admin');
  }

  isAdmin(){
    if(!this.roleService.isAdmin){
      this.router.navigate(['stopwatch']);
    }
  }
}
