import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Options } from 'select2';
import { fontModel } from './fontModel';
import { jsPDF } from 'jspdf';
import { Console } from 'console';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/api/user';
import { CommonService } from 'src/app/theme/components/commonservice/commonservice.component';
import { CommonPager } from 'src/app/theme/components/commonpager/commonpager';
import { ReportViewer } from '../reportviewer/reportviewer';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
import { DataService } from 'src/app/api/api.dataservice.service';
import { PagerService } from 'src/app/api/api.pager.service';
import { Conversion } from 'src/app/api/api.conversion.service';

declare var $: any;

@Component({
    selector: 'app-applicantforms',
    templateUrl: './applicantforms.component.html',
    styleUrls: ['./applicantforms.component.scss'],
    providers: [PagerService]
    //providers: [Conversion]
})

export class ApplicantFormsComponent implements OnInit {
//   @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
//   @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
//   @ViewChild(ReportViewer) _rptViewer: ReportViewer;
//   public settings: Settings;
//   public options: Options;
//   private userID = sessionStorage.getItem("userID");
//   public loggedUserId: string = sessionStorage.getItem("userID");
//   public cmnEntity: any = {};
//   public isToggleMaster: boolean = true;
//   public res: any;
//   public resmessage: string;
//   public requirementForm: FormGroup;
//   public pageSize: number = 10;
//   public listJobPost: any;
//   public itemListByPage: any = [];
//   public jobPostList:any;
//   public skillList:any;
//   public benifitList:any;
//   public requirementList:any;
//   public otherRequirementList:any;
//   public responsibilityList:any;
//   public masterList:any;
//   public masterDiv:boolean=true;
//   public detailDiv:boolean=false;
//   public applyForm:boolean=false
//  public mstrId!: string;


//   constructor(public appSettings:AppSettings, 
//     private rout: ActivatedRoute,
//     private _pathValidation: pathValidation,
//     private formBuilder: FormBuilder,
//     public fb: FormBuilder, 
//     public router:Router, 
//     public _apiService : ApiService, 
//     private toastr: ToastrService,
//     private _dataservice:DataService, 
//     @Inject(DOCUMENT) private document: any
//     ){
    
//      this.settings = this.appSettings.settings;
//      this._pathValidation.validate(this.document.location);
//      this.cmnEntity = this._pathValidation.rowEntities();
     

 
//   }
  
//   getNameToNumDate(strDate: string) {
//     debugger;
//     var nDate = new Date(strDate);
//     var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
//     return Nowdate;
    
// }

//   ngOnInit(){
//     this.mstrId = this._dataservice.getMasterListId();
//   }



//   cmnbtnAction(evmodel) {
//     debugger
//     this[evmodel.func](evmodel);
// }

// showHide() {

// }

// setToggling(divName) {
//   debugger;
//   if (divName == 'Master') {
//     this.isToggleMaster = this.isToggleMaster ? false : true;
//   }


// }


// createForm() {
//   this.requirementForm = this.formBuilder.group({
//     applicantId: null,
//     jobTitle: new FormControl(null, Validators.required),
//     company: new FormControl(null, Validators.required),
//     department: new FormControl(null, Validators.required),
//     appliedPost: new FormControl(null, Validators.required),
//     mobileNumber: new FormControl(null, Validators.required),
//     name: new FormControl(null, Validators.required),
//     fatherName: new FormControl(null, Validators.required),
//     motherName: new FormControl(null, Validators.required),
//     nid: new FormControl(null, Validators.required),
//     dateOfBirth: new FormControl(null, Validators.required),
//     birthPlace: new FormControl(null, Validators.required),
//     relegion: new FormControl(null, Validators.required),
//     bloodGroup: new FormControl(null, Validators.required),
//     gender: new FormControl(null, Validators.required),
//     maritialStatus: new FormControl(null, Validators.required),
//     spouseName: new FormControl(null, Validators.required),
//     email: new FormControl(null, Validators.required),
  
//     isActive: new FormControl(null, Validators.required),
//     preAddDivision: new FormControl(null, Validators.required),
//     preAddDistrict: new FormControl(null, Validators.required),
//     preAddThana: new FormControl(null, Validators.required),
//     preAddPostOffice: new FormControl(null, Validators.required),
//     preAddVillage: new FormControl(null, Validators.required),
//     parAddDivision: new FormControl(null, Validators.required),
//     parAddDistrict: new FormControl(null, Validators.required),
//     parAddThana: new FormControl(null, Validators.required),
//     parAddPostOffice: new FormControl(null, Validators.required),
//     parAddVillage: new FormControl(null, Validators.required),
//     expectedSelery: new FormControl(null, Validators.required),
//     appliedBy: new FormControl(null, Validators.required),
   
   
//     companyDeptPost: new FormControl(null, Validators.required),
//     companyDeptPostOpnDate: new FormControl(null, Validators.required),
//     companyDeptPostActvStatus: new FormControl(null, Validators.required),
//     imagePath: new FormControl(null, Validators.required),
//     signaturePath: new FormControl(null, Validators.required),
//     cvPath: new FormControl(null, Validators.required),
//     academicQualifications: this.formBuilder.array([]),
//     workExperiences: this.formBuilder.array([]), 

    
//   });












@ViewChild('cmnsrv', { static: false }) _msg: CommonService;
@ViewChild('cmnpager', { static: false }) _pg: CommonPager;
@ViewChild(ReportViewer) _rptViewer: ReportViewer;
public settings: Settings;
public options: Options;
private userID = sessionStorage.getItem("userID");
public loggedUserId: string = sessionStorage.getItem("userID");
public cmnEntity: any = {};
public isToggleMaster: boolean = true;
public res: any;
public resmessage: string;
public requirementForm: FormGroup;
public pageSize: number = 10;
public listJobPost: any;
public itemListByPage: any = [];
public mstrId:string


constructor(public appSettings:AppSettings, 
  private _pathValidation: pathValidation,
  private formBuilder: FormBuilder,
  public fb: FormBuilder, 
  //private _conversion: Conversion,
  public router:Router, 
  public _apiService : ApiService, 
  private toastr: ToastrService,
  private _dataservice:DataService, 
  @Inject(DOCUMENT) private document: any
  ){
    //this.options = this._pathValidation.ngSelect2Option();
   this.settings = this.appSettings.settings;
   this._pathValidation.validate(this.document.location);
   this.cmnEntity = this._pathValidation.rowEntities();
   


}

getNameToNumDate(strDate: string) {
  debugger;
  var nDate = new Date(strDate);
  var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
  return Nowdate;
  
}
ngOnInit(){
  this.mstrId = this._dataservice.getMasterListId();
  this.createForm();


}
cmnbtnAction(evmodel) {
  debugger
  this[evmodel.func](evmodel);
}

showHide() {
  debugger;
  this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
}

setToggling(divName) {
debugger;
if (divName == 'Master') {
  this.isToggleMaster = this.isToggleMaster ? false : true;
}


}





public responseTag: string = 'listJobPost';
public jobPostLists: any = [];
public _listByPageUrl: string = 'jobpost/getbypages/';
getListByPage(pageSize) {
setTimeout(() => {
  this._pg.getListByPage(1, true, pageSize, '');
    setTimeout(() => {
    }, 300);
}, 0);
}
sendToList(ev) {
this.jobPostLists = ev;
}





createForm() {
  this.requirementForm = this.formBuilder.group({
    jbPostId: null,
    jobTitle: new FormControl(null, Validators.required),
    company: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
    post: new FormControl(null, Validators.required),
    startDate: new FormControl(null, Validators.required),
    endDate: new FormControl(null, Validators.required),
  
    education: new FormControl(null, Validators.required),
    experience: new FormControl(null, Validators.required),
    workPlace: new FormControl(null, Validators.required),
    employeeStatus: new FormControl(null, Validators.required),
    jobLocation: new FormControl(null, Validators.required),
    criteria: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    business: new FormControl(null, Validators.required),
    salaryRange: new FormControl(null, Validators.required),
    isActive: true,
    applicantSkill: this.formBuilder.array([]), 
    applicantResponsibility: this.formBuilder.array([]),
    applicantRequirement: this.formBuilder.array([]),
    applicantOtherRequirement: this.formBuilder.array([]),
    applicantBenifit: this.formBuilder.array([]),
    

  });
  
}



































reset() {
debugger
  this.requirementForm.setValue({
    jbPostId: null,
    jobTitle:null,
    company: null,
    department:null,
    post:null,
    startDate: null,
    endDate: null,
    education: null,
    experience: null,
    workPlace: null,
    employeeStatus: null,
    jobLocation: null,
    criteria: null,
    address:null,
    business: null,
    salaryRange: null,
    isActive: null,
    //applicantSkill: this.formBuilder.array([]), 

    

  })}

//EDIT UPDATE DATA
public jobSkill:any;
public _getbyIdUrl: string = 'jobpost/getbyid';
edit(modelEvnt) {
  debugger;
  modelEvnt.event.preventDefault();
  //var param = { strId: modelEvnt.model.quotationId, strId2: modelEvnt.model.categoryId };
  var param = { strId: modelEvnt.model.jobOid, strId2: modelEvnt.model.categoryId };
  var apiUrl = this._getbyIdUrl
  this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
          this.res = response;
          console.log("this.Total data ",this.res)
          var jobSkill = JSON.parse(this.res.resdata.jobSkill);
          var benefit = JSON.parse(this.res.resdata.jobBenefit);
          var requirement = JSON.parse(this.res.resdata.jobRequirement);
          var otherRequirement = JSON.parse(this.res.resdata.jobOtherRequirement);
          var responsibilityList = JSON.parse(this.res.resdata.jobResponsibility);

          console.log("this.jobSkill ",jobSkill)
          if (this.res.resdata.jobPostMaster != '') {
            var jobPost = JSON.parse(this.res.resdata.jobPostMaster)[0];
          
            console.log("this.jobPost",jobPost)
            debugger;
            this.requirementForm.setValue({
              jbPostId: jobPost.jbPostId,
              jobTitle: jobPost.jobTitle,
              company: jobPost.company,
              department:jobPost.department,
              post: jobPost.post,
              startDate: jobPost.startDate == null ? null : this.getNameToNumDate(jobPost.startDate),
              //startDate:jobPost.startDate,
              //endDate: jobPost.endDate,
              endDate: jobPost.endDate == null ? null : this.getNameToNumDate(jobPost.endDate),
              education: jobPost.education,
              experience: jobPost.experience,
              workPlace: jobPost.workPlace,
              employeeStatus: jobPost.employeeStatus,
              jobLocation: jobPost.jobLocation,
              criteria:jobPost.criteria,
              address: jobPost.address,
              business: jobPost.business,
              salaryRange: jobPost.salaryRange,
              isActive: jobPost.isActive === 0? false:true,
              applicantSkill: this.formBuilder.array([]), 
              applicantResponsibility: this.formBuilder.array([]),
              applicantRequirement: this.formBuilder.array([]),
              applicantOtherRequirement: this.formBuilder.array([]),
              applicantBenifit: this.formBuilder.array([]),

            });
            console.log("this.this.jobPostForm",this.requirementForm)
        }
          this.reset();
         
      
      }, error => {
          console.log(error);
      });

    
}










  
}


























  





















 


 



 
