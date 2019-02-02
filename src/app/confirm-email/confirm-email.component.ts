import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) { }

  verifyEmail() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = this.route.snapshot.paramMap.get('token');
    this.userService.verifyEmail(id, token);
  }

  ngOnInit() {
    this.router.navigateByUrl('/');
    this.verifyEmail();
  }
}
