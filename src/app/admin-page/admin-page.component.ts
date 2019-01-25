import { Component, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
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
