import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn} from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import {ApiService} from '../../api/api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/pages/register/register_user_model';
import { DataService } from 'src/app/api/api.dataservice.service';
import { UrlBranch } from 'src/app/api/api.urlbranch.service';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls : ["./register.component.scss"]
})



export class RegisterComponent implements OnInit{
  

  //common
  public res: any;

  public userID;
  public userPassword;
  public user = {};


  public form : FormGroup;
  public settings: Settings;
  public RegisterForm: FormGroup;
  public addApplicantRolesGroup: FormGroup;
  public resmessage: string;
  public fullName:string;
  public email:string;

  userModel = new User('', '','','','');

  constructor(public appSettings:AppSettings, 
    private formBuilder: FormBuilder,
    public fb: FormBuilder, 
    public router:Router, 
    public _apiService : ApiService, 
    private toastr: ToastrService,
    private _dataservice:DataService, 
    ){

     this.settings = this.appSettings.settings;
      this.form = this.fb.group({
       'userid': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
       'mobile': [null, Validators.compose([Validators.required, Validators.minLength(11)])],
       'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
       
      
       'rememberMe': false
      });
  }
  

  ngOnInit(){
    this.createForm();

    
  }




  createForm() {
    this.RegisterForm = this.formBuilder.group({
        oid: null,
        userid: null,
        username:null,
        //mobileNumber: new FormControl(null, [Validators.required,Validators.minLength(11)]),
        mobileNumber: new FormControl(null, [
          Validators.required, 
          Validators.minLength(11), 
          Validators.maxLength(11), 
          Validators.pattern(/^01\d{9}$/), // Pattern to ensure it starts with 01 and has 11 digits
         
      ]),
        password: new FormControl(null, [Validators.required,Validators.minLength(5)]),
         confirmPassword: new FormControl(null, [Validators.required]),
        fullName: new FormControl(null, [Validators.required,Validators.minLength(6)]),
        isActive: true,
        //email: new FormControl(null, [Validators.required,Validators.minLength(4)]),
        email:  new FormControl(null, [
          Validators.required,
          Validators.email, // Ensures valid email format
          Validators.pattern(/.+@.+/) // Ensures '@' is present in the email
      ]),
        photo: null,
        designation: "Applicant",
        department: null,
       // isReg: null,
      
    }, { validators: this.passwordMatchValidator }//add it later wirth , 
  );
    this.addApplicantRoles();
}


passwordMatchValidator(form: FormGroup) {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}


addApplicantRoles() {
   this.addApplicantRolesGroup = this.formBuilder.group({
    userId: null,
    roleId: 10,
    userroleId: null
   
  });
}

onSubmit(){
  this.RegisterForm.controls['userid'].setValue(this.RegisterForm.controls['email'].value);
  this.RegisterForm.controls['username'].setValue(this.RegisterForm.controls['fullName'].value);
  this.addApplicantRolesGroup.controls['userId'].setValue(this.RegisterForm.controls['email'].value);

  this.onSubmits()
  console.log(" this.RegisterForm.controls.userid", this.RegisterForm.controls)
}



public _saveUrl: string = 'register/saveupdate';
onSubmits() {
  debugger

    //var param = { loggedUserId: this.userID };
    var param = { loggedUserId: "Applicant" };
    var ModelsArray = [param, this.RegisterForm.value,this.addApplicantRolesGroup.value];
    var apiUrl = this._saveUrl;
    this._dataservice.postMultipleModel(apiUrl, ModelsArray)
        .subscribe(response => {
            this.res = response;
            this.resmessage = this.res.resdata.message;
            if (this.res.resdata.resstate) {
              this.toastr.success('Register Successful', 'Success');
              this.router.navigate(['login'])
               
            } 
            else {
              this.toastr.error(this.res.resdata.message, 'Failed');
            }
            
        }, error => {
          
            console.log(error);
        });
}


reset() {
  this.RegisterForm.setValue({
    oid: null,
    userid: null,
    username:null,
    mobileNumber: null,
    password: null,
    fullName: null,
    isActive: true,
    email: null,
    photo: null,
    designation: null,
    department: null,
    //isReg: null,
  });

  // this.resmessage = null;
  // $('#clientName').focus();
}























  // public login:string ='jobusers/register';
  // public onSubmit(values:Object):void {
  //   sessionStorage.clear();
  //   if (this.form.valid) {
  //     this.userID = this.form.value.userid;
  //     this.userPassword = this.form.value.password;
  //     this.user = {
  //       "EmpID": this.userID,
  //       "UserPassw": this.userPassword
  //       }    
    
  //   var apiUrl=this.login;    
  //   this._dataservice.postMultipleModel(apiUrl, this.user)
  //   .subscribe(response =>{
  //       debugger;
  //       this.res=response;
  //       var resMessage=this.res.resdata.message;
  //       if (this.res.resdata.resstate) {          
  //         sessionStorage.clear();          
  //         sessionStorage.setItem('isLoggedIn', 'true');
  //         sessionStorage.setItem('loggedUser', JSON.stringify(this.res.resdata.loggeduser));
  //         sessionStorage.setItem('userID', this.userID);
  //         sessionStorage.setItem('password', this.userPassword);
  //         this.toastr.success(resMessage, 'Success!'); 
  //         this.router.navigate(['/home']);          
  //       } else {
  //         this.toastr.error(resMessage, 'OPPS!'); 
  //       }
  //     });
  //   }
  // }

  ngAfterViewInit(){
    setTimeout(() => {
      this.settings.loadingSpinner = false; 
    }); 
  }
}