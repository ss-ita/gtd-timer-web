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
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  verifyEmail() {
    const email = this.route.snapshot.paramMap.get('email');
    const token = this.route.snapshot.paramMap.get('token');
    if (!this.isLoggedIn()) {
      this.userService.signInWithEmail(email);
    }
    this.userService.verifyEmail(email, token);
  }

  isLoggedIn() {
    return localStorage.getItem('access_token') === null ? false : true;
  }

  ngOnInit() {
    this.router.navigateByUrl('/');
    this.verifyEmail();
  }
}
