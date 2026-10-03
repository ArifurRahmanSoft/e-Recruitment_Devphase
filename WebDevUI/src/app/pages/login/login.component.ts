import { AfterViewInit, Component, HostListener, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { ApiService } from '../../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/pages/login/login_user_model';
import { DataService } from 'src/app/api/api.dataservice.service';
import { UrlBranch } from 'src/app/api/api.urlbranch.service';
//import { Options } from 'select2';
import { Options } from 'select2';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
import { NgSelect2Component } from 'ng-select2';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';








@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ["./login.component.scss"]
})

export class LoginComponent {

  public res: any;

  public userID;
  public userPassword;
  public user = {};

  public usrPlaceHolder:string='Employee ID...(e.g. 06739)';
  public usrPlaceMsgs:string='Employee';
  public form: FormGroup;
  public settings: Settings;

  userModel = new User('', '');

  constructor(public appSettings: AppSettings,
    public fb: FormBuilder,
    public router: Router,
    public acrout: ActivatedRoute,
    public _location: Location,
    public _apiService: ApiService,
    private toastr: ToastrService,
    private _dataservice: DataService,
  ) {
    debugger;
    var host=window.location.origin;
    if(host=='https://hr.citygroupbd.com')
    {
      this.usrPlaceHolder='Email ID...(e.g. emailid@mail.com)';
      this.usrPlaceMsgs='Email';
    }else{
      this.usrPlaceHolder='Employee ID...(e.g. 06739)';
      this.usrPlaceMsgs='Employee';
    }
    

    this.settings = this.appSettings.settings;
    this.form = this.fb.group({
      'password': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'userid': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'rememberMe': false
    });

    //  // 'email': [null, Validators.compose([Validators.required, emailValidator])],
  }

  ngOnInit() {
    this.onRedirect();
  }

  onRedirect() {
    debugger;
    var rdModels: any = this.acrout.queryParams;
    var values = rdModels._value;
    this._location.replaceState("/login");
    if (values != undefined) {
      // console.log('redirect', JSON.stringify(values));
      var value = { userid: values.userid, password: '     ', isredirect: values.isredirect }
      this.form.controls.userid.setValue(value.userid);
      this.form.controls.password.setValue(value.password);
      this.onSubmit(value);
    }
  }

  onLogin() {
    var values = { userid: this.form.value.userid, password: this.form.value.password, isredirect: '0' }
    this.onSubmit(values);
  }

  public login: string = 'jobusers/login';
  public onSubmit(values: any): void {
    sessionStorage.clear();
    if (this.form.valid) {
      this.userID = values.userid;
      this.userPassword = values.password;
      this.user = {
        "EmpID": this.userID,
        "UserPassw": this.userPassword,
        "IsRedirect": values.isredirect
      }

      var apiUrl = this.login;
      this._dataservice.postMultipleModel(apiUrl, this.user)
        .subscribe(response => {
          debugger;
          this.res = response;
          console.log(" this.res", this.res)
          var resMessage = this.res.resdata.message;
          if (this.res.resdata.resstate) {
            sessionStorage.clear();
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('loggedUser', JSON.stringify(this.res.resdata.loggeduser));
            sessionStorage.setItem('userID', this.userID);
            sessionStorage.setItem('password', this.userPassword);
            this.toastr.success(resMessage, 'Success!');
            //this.router.navigate(['/requirement']);    
            this.router.navigate(['/home']);
          } else {
            this.toastr.error(resMessage, 'OPPS!');
          }
        });
    }
  }

showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}


  ngAfterViewInit() {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    });
  }


































}