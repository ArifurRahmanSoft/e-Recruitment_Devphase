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
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ["./forgotpass.component.scss"]
})

export class ForgotPassComponent {

  public res: any;

  public userID;
  public userPassword;
  public user = {};

  public usrPlaceHolder:string='Employee ID...(e.g. 06739)';
  public usrPlaceMsgs:string='Employee';
  public form: FormGroup;
  public settings: Settings;
  public otp:string='';
  public loading: boolean = false;
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
      'email': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'rememberMe': false
    }//add it later wirth , 
  );
 
  }

  ngOnInit() {
    //this.onRedirect();
  }


 userEmail:any;
 public verifymail: string = 'otp/sendotp';
  public onSubmit(): void {
  debugger;
  var values = { email: this.form.value.email };
  this.userEmail = this.form.value.email;

  if (this.form.valid) {
    this.loading = true; // Start spinner
    this.userID = values;
    var apiUrl = this.verifymail;

    this._dataservice.postMultipleModel(apiUrl, this.userID)
      .subscribe({
        next: (response) => {
          this.res = response;
          console.log("this.res", this.res);
          var resMessage = this.res.message;

          if (this.res.otp) {
            this.toastr.success(resMessage, 'Success');
            this._dataservice.setEmail(this.form.value.email);
            this.router.navigate(['/verifyotp']);
            this.otp = this.res.otp;
          } else {
            this.toastr.error(resMessage, 'OPPS!');
          }
        },
        error: (error) => {
          this.toastr.error("Something went wrong!", "Error");
        },
        complete: () => {
          this.loading = false; // Stop spinner
        }
      });
  }
}




  // public onSubmit(): void {
  //   debugger
  //   var values = { email: this.form.value.email }
  //   this.userEmail=this.form.value.email;
  //   if (this.form.valid) {
  //      this.loading = true;
  //     this.userID = values
  //     var apiUrl = this.verifymail;
  //     this._dataservice.postMultipleModel(apiUrl, this.userID)
  //       .subscribe(response => {
  //         debugger;
  //         this.res = response;
  //         console.log(" this.res", this.res)
  //     var resMessage=this.res.message
  //         if (this.res.otp) {
  //            this.toastr.success(resMessage, 'Success');
  //            this._dataservice.setEmail(this.form.value.email);
  //           this.router.navigate(['/verifyotp']);
  //           this.otp=this.res.otp
  //         } else {
  //           this.toastr.error(resMessage, 'OPPS!');
  //         }
  //       });
  //   }
  // }







 
            






  ngAfterViewInit() {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    });
  }


































}