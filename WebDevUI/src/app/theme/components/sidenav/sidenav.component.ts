import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { Employee } from '../../../api/employee';
import { DataService } from 'src/app/api/api.dataservice.service';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {
  public cmnEntity: any = {};
  public res: any;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };

  public settings: Settings;
  constructor(public appSettings: AppSettings, private _dataservice: DataService, private _pathValidation: pathValidation) {//, public menuService:MenuService
    this.settings = this.appSettings.settings;
    this._pathValidation.validateLoggedUser();
    this.cmnEntity = this._pathValidation.rowEntities();
    this.loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

  }


  public userID;
  public password;
  public loggedUser: any;
  public my_employee = new Employee("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");

  public exployeeName;
  public employeeDesignation;
  public employeeEmail;
  public employeePhoto;
  public employeeMobile;

  ngOnInit() {
    this.userID = sessionStorage.getItem('userID');
    this.password = sessionStorage.getItem('password');
    this.loadEmployeeDetails();
    this.getParofileInfoByuserID(this.loggedUser)
  }

  public _getUrl: string = 'jobusers/loggeduserdetails';
  loadEmployeeDetails() {
    var param = { UserId: this.cmnEntity.userId, IsTrue: this.loggedUser.isSys };
    var apiUrl = this._getUrl;
    this._dataservice.getWithMultipleModel_Sync(apiUrl, param)
      .then(response => {
        debugger;
        this.res = response;
        if (this.res.resdata.data.length > 0 && this.res.resdata.resstate) {
          var datas = JSON.parse(this.res.resdata.data);
          console.log("employee photo detials is ", datas)
          this.my_employee = datas as Employee;
          this.exployeeName = this.my_employee.EMP_NAME;
          this.employeeDesignation = this.my_employee.EMP_DSIG;
          this.employeeEmail = this.my_employee.OFFICE_MAIL;
          this.employeeMobile = this.my_employee.MOBILE_NO;
          this.employeePhoto = this.loggedUser.isSys ? this.my_employee.EMP_PHOTO : 'data:image/png;base64,' + this.my_employee.EMP_PHOTO;
        }
      }, error => {
        console.log(error);
      }
      );
  }


  //added later

  public _getUserInUrl: string = 'ereqdropdown/getProfileInfoById';
  getParofileInfoByuserID(id: any) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getUserInUrl;
    var param = id.userId;
    this._dataservice.getbyid(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listuserInfo.length > 0) {
            console.log("this.res is detils ny id  ssssss=====+>", this.res)
            var oid = this.res.resdata.listuserInfo[0].oid
            this.getUserDetail(oid)
          }


        }, error => {
          console.log(error);
        });
  }



  public imageUrl: string = '';
  public _geteditUrl: string = 'reqform/getcandidatedetailsbyid';
  getUserDetail(userid: any) {
    var param = { strId: userid };
    var apiUrl = this._geteditUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        if (this.res) {
          var detals = JSON.parse(this.res.resdata.regApplicantMaster)
          var image = detals[0].docPhotoVPath
          this.imageUrl = image
        }
      }, error => {
        console.log(error);
      });
  }









}
