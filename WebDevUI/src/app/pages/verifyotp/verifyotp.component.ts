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
  selector: 'app-verifyotp',
  templateUrl: './verifyotp.component.html',
  styleUrls: ["./verifyotp.component.scss"]
})

export class VerifyOtpComponent {

  public res: any;

  public userID;
   public email;
  public userPassword;
  public user = {};

  public usrPlaceHolder:string='Employee ID...(e.g. 06739)';
  public usrPlaceMsgs:string='Employee';
  public form: FormGroup;
  public settings: Settings;
  public otp:string='';
  userModel = {
    otp: ''
  };

  //userModel = new User('', '');

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
      'otp': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'rememberMe': false
    });

  }

  ngOnInit() {
    //this.onRedirect();
    this.email = this._dataservice.getEmail();
  }






 public verifyOtp: string = 'otp/verifyotp';
  public onSubmit(): void {
    debugger
    var values = { otp: this.form.value.otp,email:this.email }
    if (this.form.valid) {
      this.userID = values
      var apiUrl = this.verifyOtp;
      this._dataservice.postMultipleModel(apiUrl, this.userID)
        .subscribe(response => {
          debugger;
          this.res = response;
          var resMessage=this.res.message
          console.log(" this.res", this.res)
      
          if (this.res.otp) {
            this._dataservice.setEmail(this.email);
            this._dataservice.setOTP(this.form.value.otp);
            this.toastr.success(resMessage, 'success!');
             this.router.navigate(['/changepass']);
          } else {
            this.toastr.error(resMessage,'OPS!');
          }
        });
    }
  }









  ngAfterViewInit() {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    });
  }


































}