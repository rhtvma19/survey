import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  constructor(public auth: AuthService, public router: Router) { }
  ngOnInit(): void {

    setTimeout(() => {
      this.isLoggedIn = this.auth.isLoggedIn();
    }, 500);
  }

  logout() {
    this.auth.logout();
  }
}
