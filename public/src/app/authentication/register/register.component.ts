import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private _apiService: ApiService) { }


  ngOnInit(): void {
  }

  get f() {
    return this.form.controls;
  }

  registerUser(): void {
    debugger;
    if (this.form.status === 'VALID') {
      console.log(this.form.value);
    }

    const data = this.form.value;

    this._apiService.create('register', data)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
        },
        error => {
          console.log(error);
        });
  }

}
