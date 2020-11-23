import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private _apiService: ApiService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  get f() {
    return this.form.controls;
  }

  loginUser(): void {
    if (this.form.status === 'VALID') {
      console.log(this.form.value);
    }

    const data = this.form.value;

    this._apiService.create('login', data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        },
        error => {
          this.toastr.error(error.error.message);
          console.log(error);
        });
  }

}
