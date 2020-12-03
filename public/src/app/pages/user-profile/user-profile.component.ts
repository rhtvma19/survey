import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service';
import { AuthService } from 'src/app/common/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  currentuser: any = [];
  constructor(
    private apiService: ApiService,
    public router: Router,
    public authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.apiService.get('user/' + this.authService.getUserId())
      .subscribe(
        response => {
          console.log(response);
          this.toastr.success(response.message || 'user details fetch Successful');
          this.currentuser = response.data;
        },
        error => {
          this.toastr.error(error.error.message);
          console.log(error);
        });
  }

}
