import { Component, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-admine-page',
  templateUrl: './admine-page.component.html',
  styleUrls: ['./admine-page.component.css']
})
export class AdminePageComponent implements OnInit {
  searchText: string;

  constructor(public roleService: RoleService) {
   }

  ngOnInit() {
    this.roleService.emailOfUsers = [];
    this.roleService.emailOfAdmins = [];
    this.roleService.getEmails('User');
    this.roleService.getEmails('Admin');
  }
}
