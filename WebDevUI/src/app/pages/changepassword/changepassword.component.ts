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
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ["./changepassword.component.scss"]
})

export class ChangePasswordComponent {

  public res: any;

  public userID;
  public userPassword;
  public user = {};

  public usrPlaceHolder:string='Employee ID...(e.g. 06739)';
  public usrPlaceMsgs:string='Employee';
  public form: FormGroup;
  public settings: Settings;
  public otp:string='';
   public loggedUserId: string = sessionStorage.getItem("userID");
 public email:string='';

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




  }


 createForm() {

    this.form = this.fb.group({
      'password': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      confirmPassword: new FormControl(null, [Validators.required]),
      'rememberMe': false
    }, { validators: this.passwordMatchValidator }
  );


 }



passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}



  ngOnInit() {
    this.email = this._dataservice.getEmail();
    this.otp = this._dataservice.getOTP();
    this.createForm();
  }





public pass:any;
 public updatePass: string = 'otp/updatepassword';
  public onSubmit(): void {
    debugger
    var values = {email:this.email, password: this.form.value.password,otp:this.otp}
    if (this.form.valid) {
      var pass = values
      var apiUrl = this.updatePass;
      this._dataservice.postMultipleModel(apiUrl, pass)
        .subscribe(response => {
          debugger;
          this.res = response;
          var resMessage=this.res.message
          console.log(" this.res", this.res)
      
          if (this.res.password) {
            sessionStorage.clear();
             this.toastr.success(resMessage);
            this.router.navigate(['/home']);
          } else {
           this.toastr.error(resMessage, 'OPPS!');
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