import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Api1Service } from 'src/app/service/api1.service';
import { GlobleService } from 'src/app/service/globle.service';
import { HttpService } from 'src/app/service/http.service';
import { APIURLs } from 'src/environments/apiUrls';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formObj: any = {}
  loginForm! : FormGroup;
  isSubmitted : boolean = false;


  constructor(
    private api1: Api1Service,
    public gs: GlobleService,
    public httpService: HttpService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      "email" : new FormControl('',[Validators.required,Validators.email]),
      "password" : new FormControl('',[Validators.required,Validators.minLength(6)]),
    })
  }


  login() {
    this.isSubmitted = true;
    if(this.loginForm.valid){
      this.httpService.post(APIURLs.loginAPI,this.loginForm.value).subscribe((res: any) => {
        if (res && res.status) {
          // Store token properly
          this.gs.setItem('token', res?.data?.token);
          this.gs.isLogin = true;
          this.router.navigate(['/dashboard']);
          this.gs.successToaster(res?.msg || "Login successful!");
          this.isSubmitted = false;
        } else {
          this.gs.errorToaster(res?.msg || "Login failed. Please try again.");
        }
      },(err) => {
        this.gs.errorToaster(err?.error?.msg || "Something went wrong!");
        this.isSubmitted = false;
      })
    }
  }

}
