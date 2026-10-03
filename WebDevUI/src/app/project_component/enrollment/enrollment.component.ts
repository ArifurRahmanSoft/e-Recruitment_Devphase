import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Options } from 'select2';
import { fontModel } from './fontModel';
import { jsPDF } from 'jspdf';
import { Console } from 'console';
import { Router } from '@angular/router';
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
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


declare var $: any;

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss'],
  providers: [PagerService]
  //providers: [Conversion]
})

export class EnrollmentComponent implements OnInit {
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
  public jobPostForm: FormGroup;
  public pageSize: number = 10;
  public listJobPost: any;
  public itemListByPage: any = [];
  public companyList: any;
  public iTaxCompanyList: any;
  public DepartmentList: any;
  public designationList: any;
  public jobShowDiv: boolean = false;
  public jobPostList: any = [];
  public JobIdList: any = [];
  public appliedJobIds: string[] = [];
  public skillList: any;
  public benifitList: any;
  public requirementList: any;
  public experienceList: any;
  public otherRequirementList: any;
  public responsibilityList: any;
  public masterList: any;
  public accQlfList: any;
  public wrkExpList: any;

  public company: string;
   public approvalProcess: string='1';
  public department: string;
  public post: string;
  page: number = 1;
  public eDate: Date;
  public sDate: Date;
  public fromDate: any;
  public toDate: any;
  public Role: string;
  public   Status: string;


  public proCirtificateList: any;
  genderList: string[] = ['Male', 'Female', 'Both'];

  sourceList: string[] = ['BD Jobs', 'LinkedIn', 'Facebook', 'City Group Website', 'Other']
  bloodGroupList: Array<{ id: string, text: string }> = [
    { id: '', text: 'Select Blood Group' }, { id: '1', text: 'A+' }, { id: '5', text: 'B+' }, { id: '7', text: 'O+' }, { id: '3', text: 'AB+' },
    { id: '2', text: 'A-' }, { id: '6', text: 'B-' }, { id: '8', text: 'O-' }, { id: '4', text: 'AB-' }
  ];
  genderAList: Array<{ id: string, text: string }> = [{ id: 'M', text: 'Male' }, { id: 'F', text: 'Female' }, { id: 'O', text: 'Other' }];
  maritialStatusList: Array<{ id: string, text: string }> = [{ id: '2', text: 'Single' }, { id: '3', text: 'Married' }, { id: '4', text: 'Divorced' }, { id: '5', text: 'Widow' }];
  religionList: Array<{ id: string, text: string }> = [{ id: '1', text: 'Islam' }, { id: '2', text: 'Shonaton' }, { id: '3', text: 'Buddhist' }, { id: '4', text: 'Christian' }, { id: '5', text: 'Others' }];
  public degreeList: any = [];
  recruitTypeList: Array<{ id: string, text: string }> = [{ id: '1', text: 'New' }, { id: '2', text: 'Replace' }];



  constructor(public appSettings: AppSettings,
    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    public fb: FormBuilder,
    //private _conversion: Conversion,
    public router: Router,
    public _apiService: ApiService,
    private toastr: ToastrService,
    private _dataservice: DataService,
    public dialog: MatDialog,
    
       private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) {
    //this.options = this._pathValidation.ngSelect2Option();
    this.settings = this.appSettings.settings;
    this._pathValidation.validate(this.document.location);
    this.cmnEntity = this._pathValidation.rowEntities();
    console.log("this.cmnEntity", this.cmnEntity)



  }

  getNameToNumDate(strDate: string) {
    debugger;
    var nDate = new Date(strDate);
    var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
    return Nowdate;

  }

   public today = new Date().toISOString().split('T')[0];
  ngOnInit() {
    this.createForm();
    this.createForms();
    this.getAllCompany();
    this.getAllItaxCompany();
    this.getAllDepartment();
    this.getAllPost();
    this.getAllBusinessType();
    //this.getAllLocation();
    this.getAllDistrict();
    this.getAllThana();
    this.getAllGrade();
    this.getAllArea();
    this.getAllTaxZone();
    this.getAllTaxCircle();
    this.getAllLocation();
    this.loadSuppliers();



  }
  cmnbtnAction(evmodel) {
    debugger
    this.jobShowDiv = false;
    this[evmodel.func](evmodel);
  }

  showHide() {
    debugger;
    this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
  }

  setToggling(divName) {
    debugger

    debugger;
    if (divName == 'Master') {

      this.isToggleMaster = this.isToggleMaster ? false : true;

    }


  }





  public responseTag: string = 'listEnrollment';
  public enrollmentLists: any = [];
  public _listByPageUrl: string = 'reqform/getenrollmentbypages/';
  getListByPage(pageSize) {
    debugger
    setTimeout(() => {
      this._pg.getListByPage(1, true, pageSize, '');
      setTimeout(() => {
      }, 300);
    }, 0);
  }
  sendToList(ev) {
    this.enrollmentLists = ev;
    console.log("this.enrollmentLists", this.enrollmentLists)
  }



  public checkedModel: any;
  public responseTags: string = 'listApproval';
  public listApproval: any = [];
  public approvalList: any = [];
  public _listByPageUrls: string = 'reqform/getapprovalbypages';
  GetApprovalList(pageSize) {
    debugger
    this.checkedModel = undefined;
    setTimeout(() => {
      this._pg.getListByPage(1, true, pageSize, '');
      setTimeout(() => {

        this.setSringToBools();
      }, 300);
    }, 0);
  }
  setSringToBools() {
    debugger
    if (this.listApproval.length > 0) {
      this.listApproval.forEach((item, index) => {
      });

      this.approvalList = this.listApproval;
    }
  }
  sendToLists(ev) {
    this.listApproval = ev;
    console.log("   this.quotqtionLists", this.listApproval)
    setTimeout(() => {
      this.setSringToBools();
    }, 300);
  }



// public responseTags: string = 'listJobPost';
//   public joApplicationLists: any = [];
//   public _listByPageUrls: string = 'candidateinfo/getapplicationlstbypageHrDirector'; //getapplicationlstbypageHrDirector getapplicationlstbypagesEnrollment
//   GetApprovalList(pageSize) {
//     debugger
//     setTimeout(() => {
//       this._pg.getListByPage(1, true, pageSize, '');
//       setTimeout(() => {
//       }, 300);
//     }, 0);
//   }
//   sendToLists(ev) {
//     this.joApplicationLists = ev;
//     console.log("this.jobPostLists==>", this.joApplicationLists)
//   }


  createForm() {
    this.jobPostForm = this.formBuilder.group({
      jbPostId: null,
      requsitonId: null,
      jobTitle: new FormControl(null, Validators.required),
      company: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      post: new FormControl(null, Validators.required),
      //post: null,
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),

      education: new FormControl(null, Validators.required),
      experience: new FormControl(null, Validators.required),
      workPlace: null,
      employeeStatus: new FormControl(null, Validators.required),
      jobLocation: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      business: new FormControl(null, Validators.required),
      salaryRange: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      isActive: true,
      applicantSkill: this.formBuilder.array([]),
      applicantResponsibility: this.formBuilder.array([]),
      applicantRequirement: this.formBuilder.array([]),
      applicantExperience: this.formBuilder.array([]),
      applicantOtherRequirement: this.formBuilder.array([]),
      applicantBenifit: this.formBuilder.array([]),


    });
  }

  public enrollmentForm: any;
  createForms() {

    this.enrollmentForm = this.formBuilder.group({
      oId: null,
      aprvOid:null,
      applicantId: null,
      name: new FormControl(null, Validators.required),
      BnName: new FormControl(null, Validators.required),//l
      fatherName: new FormControl(null, Validators.required),
      motherName: new FormControl(null, Validators.required),
      spouseName: null,
      email: new FormControl(null, Validators.required),
      OfficeEmail: new FormControl(null),//a
      mobileNumber: new FormControl(null),
      EmergncyMobileNumber: new FormControl(null),
      gender: new FormControl(null, Validators.required),
      maritialStatus: new FormControl(null, Validators.required),
      bloodGroup: new FormControl(null),
      relegion: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),

      supervisorId: new FormControl(null),//
      recruitType: new FormControl(null),//
      replaceId: new FormControl(null),//
      recruitNote: new FormControl(null),//
      nationality: new FormControl(null),//
      nidN: new FormControl(null, Validators.required),
      passport: new FormControl(null),//
      BankAc: new FormControl(null),//

      preAddDetai: new FormControl(null, Validators.required),
      parAddDetai: new FormControl(null, Validators.required),
      preAddDistrict: new FormControl(null, Validators.required),
      preAddThana: new FormControl(null, Validators.required),

      location: new FormControl(null),//
      company: new FormControl(null, Validators.required),
      taxCompany: new FormControl(null),//new FormControl(null),
      atnSchedule: new FormControl(null),//
      department: new FormControl(null),
      areaStatus: new FormControl(null),//
      taxZone: new FormControl(null),//

      idCardNo: new FormControl(null),//
      issueGrade: new FormControl(null),//
      grade: new FormControl(null, Validators.required),//
      grossAmnt: new FormControl(null),//
      dptUnit: new FormControl(null),//
      tin: new FormControl(null),
      taxCircule: new FormControl(null),//

      cashAmnt: new FormControl(null),//
      dateOfJoin: new FormControl(null, Validators.required),//
      confirmDate:new FormControl(this.today),// new FormControl(null, Validators.required),//
      designation: new FormControl(null, Validators.required),//
      workingArea: new FormControl(null),//
      taxDistrict: new FormControl(null),//


      imagePath: null,
      signaturePath: null,
    });

  }







  //Modal Entry
  @ViewChild('modalEntry') modalEntry: TemplateRef<any>;
  private _dialogRef: MatDialogRef<TemplateRef<any>>;
  public modalType: string = '';
  public modalControlName: string = '';
  public modalLabelName: string = '';
  openModalEntryDialog(modaltype): void {
    debugger
    const _config = new MatDialogConfig();
    _config.restoreFocus = false;
    _config.autoFocus = false;
    _config.role = 'dialog';
    if (modaltype == 'WorkOrder') {
      _config.width = '80%';

    }
    if (modaltype != 'WorkOrder') {
      _config.width = '40%';
      _config.panelClass = 'modalTopPosition';
    }



    this.modalType = modaltype;
    //this.modalLabelName = modaltype == 'srvHeadGroup' ? 'Head Group' : 'Head';
    this.modalControlName = modaltype;
    modaltype != '' ? this.createModalForm(modaltype) : null;

    this._dialogRef = this.dialog.open(this.modalEntry, _config);

    this._dialogRef.afterClosed().subscribe(result => {
      this.resetModal();
    });
  }


  //create modal
  public modalForm: FormGroup;
  public bassetTypeForm: FormGroup;
  createModalForm(modalName) {
    debugger
    this.modalForm = new FormGroup({});

    switch (modalName) {

      case 'WorkOrder':
        this.modalLabelName = 'Quotation';
        this.bassetTypeForm = new FormGroup({
          bassetTypeId: new FormControl(null),
          bassetTypeCode: new FormControl(null),
          bassetTypeName: new FormControl(null, Validators.required),
          bassetTypeSName: new FormControl(null),
          categoryId: new FormControl(this.jobPostForm.controls.post.value, Validators.required),
          isActive: new FormControl(true)
        });


        break;


    }
  }

  resetModal() {
    this.modalForm = new FormGroup({});
  }
  // createFormd() {
  //   this.jobPostForm = this.formBuilder.group({
  //     jbPostId: null,
  //     jobTitle: new FormControl(null, Validators.required),
  //     company: new FormControl(null, Validators.required),
  //     department: null,
  //     post: null,
  //     startDate: new FormControl(null, Validators.required),
  //     endDate: new FormControl(null, Validators.required),
  //     education: new FormControl(null, Validators.required),
  //     experience: new FormControl(null, Validators.required),
  //     workPlace: null,
  //     employeeStatus: new FormControl(null, Validators.required),
  //     jobLocation: new FormControl(null, Validators.required),
  //     gender: new FormControl(null, Validators.required),
  //     address: new FormControl(null, Validators.required),
  //     business: new FormControl(null, Validators.required),
  //     salaryRange: new FormControl(null, Validators.required),
  //     isActive: true,
  //     applicantSkill: this.formBuilder.array([]),
  //     applicantResponsibility: this.formBuilder.array([]),
  //     applicantRequirement: this.formBuilder.array([]),
  //     applicantExperience: this.formBuilder.array([]),
  //     applicantOtherRequirement: this.formBuilder.array([]),
  //     applicantBenifit: this.formBuilder.array([]),


  //   });

  // }







  onCheckboxChange(event: any) {
    debugger
    const isChecked = event.target.checked;
    this.jobPostForm.get('isActive')?.setValue(isChecked ? true : false);
    console.log(" this.jobPostForm", this.jobPostForm)
  }

  //SKILL
  get applicantSkill(): FormArray {
    return this.jobPostForm.get('applicantSkill') as FormArray;
  }

  addSkill() {
    const skillGroup = this.formBuilder.group({
      applicantSkillId: null,
      jobPostId: null,
      skill: [null, Validators.required],
    });

    this.applicantSkill.push(skillGroup);
    console.log("this.applicantSkill.", this.applicantSkill)
  }


  removeSkill(index: number) {
    debugger
    this.applicantSkill.removeAt(index);
  }


  //RESPONSIBILITY
  get applicantResponsibility(): FormArray {
    return this.jobPostForm.get('applicantResponsibility') as FormArray;
  }

  addResponsibility() {
    const ResponsibilityGroup = this.formBuilder.group({
      applicantResponId: null,
      jobPostId: null,
      responsibility: [null, Validators.required],
    });

    this.applicantResponsibility.push(ResponsibilityGroup);
  }

  removeResponsibility(index: number) {
    this.applicantResponsibility.removeAt(index);
  }


  //REQUIREMRNT
  get applicantRequirement(): FormArray {
    return this.jobPostForm.get('applicantRequirement') as FormArray;
  }

  addRequirement() {
    const RequirementGroup = this.formBuilder.group({
      applicantRequirementId: null,
      jobPostId: null,
      requirement: [null, Validators.required],
    });

    this.applicantRequirement.push(RequirementGroup);
  }

  removeRequirement(index: number) {
    this.applicantRequirement.removeAt(index);
  }

  //EXPERIENCE
  get applicantExperience(): FormArray {
    return this.jobPostForm.get('applicantExperience') as FormArray;
  }

  addExperience() {
    const ExperienceGroup = this.formBuilder.group({
      applicantExperienceId: null,
      jobPostId: null,
      experience: [null, Validators.required],
    });

    this.applicantExperience.push(ExperienceGroup);
  }

  removeExperience(index: number) {
    this.applicantExperience.removeAt(index);
  }



  //OTHER REQUIREMENT
  get applicantOtherRequirement(): FormArray {
    return this.jobPostForm.get('applicantOtherRequirement') as FormArray;
  }

  addOtherRequirement() {
    const OtherRequirementGroup = this.formBuilder.group({
      applicantOtherRequirementId: null,
      jobPostId: null,
      requirement: [null, Validators.required],
    });

    this.applicantOtherRequirement.push(OtherRequirementGroup);
  }

  removeOtherRequirement(index: number) {
    this.applicantOtherRequirement.removeAt(index);
  }



  //BENIFIT
  get applicantBenifit(): FormArray {
    return this.jobPostForm.get('applicantBenifit') as FormArray;
  }

  // Add new work experience form group
  addBenifit() {
    const BenifitGroup = this.formBuilder.group({
      applicantBenefitsId: null,
      jobPostId: null,
      benefits: [null, Validators.required],
    });

    this.applicantBenifit.push(BenifitGroup);
  }

  // Remove work experience by index
  removeBenifit(index: number) {
    this.applicantBenifit.removeAt(index);
  }







  public _saveUrl: string = 'reqform/saveupdaenrollment';
  onSubmit(): void {
    let formValues = this.enrollmentForm.value;
    const enrollmentFrom = formValues;
    console.log("param is----------------",formValues)
    
    const param = {
      loggedUserId: this.loggedUserId,
      strId: this.enrollmentForm.controls.aprvOid.value,
      strId2: this.userID
    };
    console.log("param is----------------",param)
    const ModelsArray = [param, [enrollmentFrom]];
    this._dataservice.postMultipleModel(this._saveUrl, ModelsArray)
      .subscribe(response => {
        this.res = response;
        this.resmessage = this.res.resdata.message;
        if (this.res.resdata.resstate) {
          this._msg.success(this.resmessage);
          window.location.reload();
          this.reset();

        }
      }, error => {
        console.log(error);
      });
  }


  resetss() {
    this.createForm();
    this.setAsnewJob = '';
  }

  reset() {
    // window.location.reload()
    debugger
    this.photoPath=null;
    this.signature=null
    this.empList=[];
    this.selectedId = '';
     this.selectedText = "";
    this.enrollmentForm.setValue({
      oId: null,
      aprvOid:null,
      applicantId: null,
      name: null,
      BnName: null,
      fatherName: null,
      motherName: null,
      spouseName: null,
      email: null,
      OfficeEmail: null,
      mobileNumber: null,
      EmergncyMobileNumber: null,
      gender: null,
      maritialStatus: null,
      bloodGroup: null,
      relegion: null,
      dateOfBirth: null,

      supervisorId: null,
      recruitType: null,
      replaceId: null,
      recruitNote: null,
      nationality: null,
      nidN: null,
      passport: null,
      BankAc: null,

      preAddDetai: null,
      parAddDetai: null,
      preAddDistrict: null,
      preAddThana: null,

      location: null,
      company: null,
      taxCompany: null,
      atnSchedule: null,
      department: null,
      areaStatus: null,
      taxZone: null,

      idCardNo: null,
      issueGrade:null,
      grade: null,
      grossAmnt: null,
      dptUnit: null,
      tin: null,
      taxCircule: null,

      cashAmnt: null,
      dateOfJoin: null,
      confirmDate:null,
      designation: null,
      workingArea: null,
      taxDistrict: null,


      imagePath: null,
      signaturePath: null,

    })
  }






  async getCandidateWithAprvlal(modelEvnt) {
    debugger
    await this.getcandidateDetail(modelEvnt)
    await this.getApprovalMstr(modelEvnt)

    setTimeout(()=>{
  this.setApprovalMaster();
    },1000)
  
  

  }




  public photoPath: any; public signature: any;
  public candidateMaster: any;
  public hTrainingList: any;
  public hReferenceList: any;
  public _getcanDeIdUrl: string = 'reqform/getcandidatedetailsbyid';
  getcandidateDetail(modelEvnt) {
    debugger;
    console.log("modelEvnt", modelEvnt)
    var param = { strId: modelEvnt.profileId };
    var apiUrl = this._getcanDeIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
     
     
        this.masterList = JSON.parse(this.res.resdata.regApplicantMaster)
        this.masterListDetails = this.masterList[0];
        this.candidateMaster = this.masterListDetails
        this.photoPath = this.candidateMaster.docPhotoVPath;
        this.signature = this.candidateMaster.docSignatureVPath;

        console.log("this.candidateMaster this.candidateMaster", this.candidateMaster)


      }, error => {
        console.log(error);
      });
  }





  public apprvMaster: any
   public _getAprcMstrUrl: string = 'reqform/geaprvOffcInfobyid';
  getApprovalMstr(modelEvnt) {
    debugger
     this.selectedId = '';
    this.selectedText = '';
    var param = { strId: modelEvnt.oid };
    var apiUrl = this._getAprcMstrUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        var arrMaster = JSON.parse(this.res.resdata.userAprvMaster)
        var masterDetail = arrMaster[0];
        this.apprvMaster = masterDetail;

         this.selectedId =  this.apprvMaster.lineManager;
        this.selectedText =  this.apprvMaster.lineManagerName;

        console.log("this.apprvMaster this.apprvMaster", this.apprvMaster)
      }, error => {
        console.log(error);
      });
  }


  setApprovalMaster() {
    debugger

    this.enrollmentForm.patchValue({
      oId: null,
      aprvOid:this.apprvMaster.oid,
      applicantId: this.candidateMaster.candidateOid,


      name: this.candidateMaster.name,
      BnName: this.candidateMaster.BnName,
      fatherName: this.candidateMaster.father_name,
      motherName: this.candidateMaster.mother_name,
      spouseName: this.candidateMaster.spouse_name,
      email: this.candidateMaster.email,
      OfficeEmail: null,
      mobileNumber: this.candidateMaster.mobile_number,
      EmergncyMobileNumber: null,
      gender: this.candidateMaster.gender,
      maritialStatus: this.candidateMaster.marital_status,
      bloodGroup: this.candidateMaster.blood_group,
      relegion: this.candidateMaster.religion,
      dateOfBirth: this.candidateMaster.date_of_birth == null ? null : this.getNameToNumDate(this.candidateMaster.date_of_birth),

       supervisorId: this.apprvMaster.lineManager,
       recruitType: this.apprvMaster.jobType,
       replaceId: null,
       recruitNote: null,
      nationality: "Bangladeshi",
      nidN: this.candidateMaster.nid,
       passport: null,
       BankAc: null,

      preAddDetai: this.candidateMaster.pre_add_detail,
      parAddDetai: this.candidateMaster.par_add_detail,
      preAddDistrict: this.candidateMaster.per_add_district,
      preAddThana: this.candidateMaster.pre_add_thana,

       location: null,
      company: this.candidateMaster.company_name,
       taxCompany: null,
       atnSchedule: null,
      department: this.candidateMaster.department,
       areaStatus: null,
       taxZone: this.candidateMaster.taxZone,

       idCardNo: null,
       issueGrade: this.apprvMaster.salaryGrade,
      grade: this.apprvMaster.salaryGrade,
      grossAmnt: this.apprvMaster.salary,
       dptUnit: null,
       tin: this.candidateMaster.tin,
      taxCircule: this.candidateMaster.taxCircule,

      cashAmnt: this.apprvMaster.salary,
      dateOfJoin: this.today,
       confirmDate:this.today,
      designation: this.apprvMaster.desigmation,
      workingArea:null,
      taxDistrict: this.candidateMaster.taxDistrict,

      imagePath: this.candidateMaster.docPhotoVPath,


    })

  }










  //EDIT UPDATE DATA
  setAsnewJob: string = '';
  public jobSkill: any;
  public _getbyIdUrl: string = 'reqform/getenrollbyid';
  edit(modelEvnt) {
    debugger;
    this.setAsnewJob = '';
    this.setAsnewJob = modelEvnt.model.jobOid;
    this.photoPath='';
    this.signature='';
    //modelEvnt.event.preventDefault();
    var param = { strId: modelEvnt.model.oid };
    var apiUrl = this._getbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        

        if (this.res.resdata.enrollMaster != '') {
          var enroll = JSON.parse(this.res.resdata.enrollMaster)[0];
          this.selectedId = enroll.supervisorId;
          this.selectedText = enroll.supervisorName;
          this.photoPath=enroll.imagePath;
          this.signature=enroll.signaturePath;

          console.log("this.Total data ", enroll)
          this.enrollmentForm.setValue({
            oId:  null,
            aprvOid:null,
            applicantId:  enroll.applicantId,
            name:  enroll.name,
            BnName:  enroll.BnName,
            fatherName:  enroll.fatherName,
            motherName:  enroll.motherName,
            spouseName:  enroll.spouseName,
            email:  enroll.email,
            OfficeEmail:  enroll.OfficeEmail,
            mobileNumber:  enroll.mobileNumber,
            EmergncyMobileNumber:  enroll.EmergncyMobileNumber,
            gender:  enroll.gender,
            maritialStatus:  enroll.maritialStatus,
            bloodGroup:  enroll.bloodGroup,
            relegion:  enroll.relegion,
            dateOfBirth: enroll.dateOfBirth == null ? null : this.getNameToNumDate(enroll.dateOfBirth), 
            supervisorId: enroll.supervisorId,
            recruitType:  enroll.recruitType,
            replaceId:  enroll.replaceId,
            recruitNote:  enroll.recruitNote,
            nationality:  enroll.nationality,
            nidN:  enroll.nidN,
            passport:  enroll.passport,
            BankAc:  enroll.BankAc,
            preAddDetai:  enroll.preAddDetai,
            parAddDetai:  enroll.parAddDetai,
            preAddDistrict:  enroll.preAddDistrict,
            preAddThana:  enroll.preAddThana,
            location:  enroll.location,
            company:  enroll.company,
            taxCompany:  enroll.taxCompany,
            atnSchedule:  enroll.atnSchedule,
            department:  enroll.department,
            areaStatus:  enroll.areaStatus,
            taxZone:  enroll.taxZone,
            idCardNo:  enroll.idCardNo,
            issueGrade:  enroll.issueGrade,
            grade:  enroll.grade,
            grossAmnt:  enroll.grossAmnt,
            dptUnit:  enroll.dptUnit,
            tin:  enroll.tin,
            taxCircule:  enroll.taxCircule,
            cashAmnt:  enroll.cashAmnt,
            dateOfJoin: enroll.dateOfJoin == null ? null : this.getNameToNumDate(enroll.dateOfJoin),  
            confirmDate: enroll.confirmDate == null ? null : this.getNameToNumDate(enroll.confirmDate), 
            designation:  enroll.designation,
            workingArea:  enroll.workingArea,
            taxDistrict:  enroll.taxDistrict,

            imagePath: enroll.imagePath,
            signaturePath: enroll.signaturePath,


          });
        // this.enrollmentForm.controls.supervisorId.setValue(enroll.supervisorId);
        }
        //this.reset();
      }, error => {
        console.log(error);
      });
  }




  public _divUrl: string = 'jobdropdown/getallcompany';
  getAllCompany() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._divUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllComp.length > 0) {
            var itemList = this.res.resdata.listAllComp;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.divName });
            });
            this.companyList = list;

          }
        }, error => {
          console.log(error);
        });
  }


    public _iTaxUrl: string = 'jobdropdown/getallitaxcompany';
  getAllItaxCompany() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._iTaxUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllComp.length > 0) {
            var itemList = this.res.resdata.listAllComp;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.divName });
            });
            this.iTaxCompanyList = list;

          }
        }, error => {
          console.log(error);
        });
  }

  public _DptUrl: string = 'jobdropdown/getalldepartment';
  getAllDepartment() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    //var list: Array< any > = [   "Please Select" ];
    var apiUrl = this._DptUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllDept.length > 0) {
            var itemList = this.res.resdata.listAllDept;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.deptName });
            });
            this.DepartmentList = list;
          }
        }, error => {
          console.log(error);
        });
  }


  public _desUrl: string = 'jobdropdown/getalldesignation';
  getAllPost() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    //var list: Array< any > = [   "Please Select" ];
    var apiUrl = this._desUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllDes.length > 0) {
            var itemList = this.res.resdata.listAllDes;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.dsigName });
            });
            this.designationList = list;
          }
        }, error => {
          console.log(error);
        });
  }


  public _locUrl: string = 'jobdropdown/getlocationlist-------';
  getAllLocation1() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    //var list: Array< any > = [   "Please Select" ];
    var apiUrl = this._locUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          console.log("get all locaiton is ", this.res);
          if (this.res.resdata.listAllDes.length > 0) {
            var itemList = this.res.resdata.listAllDes;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.dsigName });
            });
            this.designationList = list;
          }
        }, error => {
          console.log(error);
        });
  }


  public DistrictList: any
  public _DistUrl: string = 'jobdropdown/getalldistrict';
  getAllDistrict() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    //var list: Array< any > = [   "Please Select" ];
    var apiUrl = this._DistUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllDis.length > 0) {
            var itemList = this.res.resdata.listAllDis;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.disName });
            });
            this.DistrictList = list;
          }
        }, error => {
          console.log(error);
        });
  }



  public thanaList: any
  public _thanUrl: string = 'jobdropdown/getallthana';
  getAllThana() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    //var list: Array< any > = [   "Please Select" ];
    var apiUrl = this._thanUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllThna.length > 0) {
            var itemList = this.res.resdata.listAllThna;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.thanaName });
            });
            this.thanaList = list;
          }
        }, error => {
          console.log(error);
        });
  }



  public gradeList: any;
  public _gradUrl: string = 'reqform/getgradebylist';
  getAllGrade() {
    //var list: Array<{text:any }> = [{ text: "Please Select" }];
    var list: Array<any> = ["Please Select"];
    var apiUrl = this._gradUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listGrade.length > 0) {
            var itemList = this.res.resdata.listGrade;
            var arItem = JSON.parse(itemList)
            this.gradeList = arItem.map(item => item.name)
          }
        }, error => {
          console.log(error);
        });
  }

    public areaList: any;
  public _areaUrl: string = 'reqform/getareabylist';
  getAllArea() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._areaUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listArea.length > 0) {
            var itemList = this.res.resdata.listArea;
            var arItem = JSON.parse(itemList)
            arItem.forEach(item=>{
              list.push({id:item.oid,text:item.name})
            })
            this.areaList = list;
            console.log("area list is ",this.areaList)
          }
        }, error => {
          console.log(error);
        });
  }

    public taxZoneList: any;
  public _taxZoneUrl: string = 'reqform/gettaxzonelist';
  getAllTaxZone() {
    //var list: Array<{text:any }> = [{ text: "Please Select" }];
    var list: Array<any> = ["Please Select"];
    var apiUrl = this._taxZoneUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listTaxZone.length > 0) {
            var itemList = this.res.resdata.listTaxZone;
            var arItem = JSON.parse(itemList)
            this.taxZoneList = arItem.map(item => item.tinZone)
            // Map to get tinZone, then filter for strings that contain ONLY digits
          // this.taxZoneList = arItem
          //   .map((item: any) => item.tinZone)
          //   .filter((val: any) => val && /^\d+$/.test(val.toString().trim()));

          console.log("taxZoneList list is ", this.taxZoneList);
             
          }
        }, error => {
          console.log(error);
        });
  }

      public taxCicleList: any;
  public _taxCicleUrl: string = 'reqform/gettaxcirclelist';
  getAllTaxCircle() {
    //var list: Array<{text:any }> = [{ text: "Please Select" }];
    var list: Array<any> = ["Please Select"];
    var apiUrl = this._taxCicleUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listTaxCircle.length > 0) {
            var itemList = this.res.resdata.listTaxCircle;
            var arItem = JSON.parse(itemList)
            this.taxCicleList = arItem.map(item => item.tinCircular)
            console.log("taxCicleList  list is ",this.taxCicleList)
          }
        }, error => {
          console.log(error);
        });
  }

      public locationList: any;
  public _locationUrl: string = 'reqform/getlocation';
  getAllLocation() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._locationUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
           console.log("locationList list is ",this.res)
          if (this.res.resdata.listLocation.length > 0) {
            var itemList = this.res.resdata.listLocation;
            var arItem = JSON.parse(itemList)
            arItem.forEach(item=>{
              list.push({id:item.oid,text:item.name})
            })
            this.locationList = list;
            console.log("locationList list is ",this.locationList)
          }
        }, error => {
          console.log(error);
        });
  }



//GET ALL ALL EMP
 public _supplyUrl: string = 'reqform/getempbypage';
    empList: Array<{ id: number | string, text: string }> = [];

    pageNumber = 0;
    pageSizes = 100;
    searchText = '';
    loading = false;
    finished = false;
    selectedId: number | string | null = null;


    onSearch(text: string) {
        debugger
        this.searchText = text;
        this.loadSuppliers(true); // reset and fetch
    }

    loadSuppliers(reset: boolean = false) {
        debugger
        if (this.loading) return;
        if (reset) {
            this.pageNumber = 1;
            this.finished = false;
            this.empList = [];
        }

        if (this.finished) return;
        this.loading = true;
        const param = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSizes,
            searchVal: this.searchText,
            LoggedUserId: this.loggedUserId
        };

        this._dataservice.getWithMultipleModel_Sync(this._supplyUrl, param)
            .then((response: any) => {
                this.loading = false;

                const data = JSON.parse(response.resdata.listEmp || '[]');
               
                if (!data || data.length === 0) {
                    if (reset) { this.empList = []; } // ensure empty for search
                    this.finished = true;
                    return;
                }
                data.forEach((item: any) => {
                    if (!this.empList.some(x => x.id === item.oid)) {
                        this.empList.push({ id: item.oid, text: item.name });
                    }
                });
            })
            .catch(err => {
                console.error('loadSuppliers error', err);
                this.loading = false;
            });
    }

    selectOption(item: { id: any, text: string }) {
        debugger
        this.selectedId = item.id;
        this.selectedText = item.text;
        this.enrollmentForm.controls.supervisorId.setValue(item.id);
       // this.setReference?.();
        this.dropdownOpen = false;
    }

    isSelected(item: { id: any }) {
        return this.selectedId === item.id;
    }

    // SCROLL handler
    onScroll(event: any) {
      debugger

        const el = event.target as HTMLElement;
        const thresholdPx = 40; // start loading when within 40px of bottom

        const position = el.scrollTop + el.clientHeight;
        const height = el.scrollHeight;

        if (position + thresholdPx >= height && !this.loading && !this.finished) {
            this.pageNumber++;
            this.loadSuppliers(false);
        }
    }



    dropdownOpen = false;
    selectedText: string | null = null;

    toggleDropdown() {
      debugger
        this.dropdownOpen = !this.dropdownOpen;

        if (this.dropdownOpen && this.empList.length === 0) {
            this.loadSuppliers(true);
        }
    }


    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {

        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.dropdownOpen = false;
        }
    }




    //END ALL EMP 





  public businessTypeList: any = [];
  public _businessUrl: string = 'ereqdropdown/getallbusinesstype';
  getAllBusinessType() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    //var list: Array< any > = [   "Please Select" ];
    var apiUrl = this._businessUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;

          if (this.res.resdata.listAllBusiness.length > 0) {
            var itemList = this.res.resdata.listAllBusiness;
            itemList.forEach(item => {
              list.push({ id: item.id, text: item.name });
            });
            this.businessTypeList = list;
            console.log("total business is ", this.businessTypeList)
          }
        }, error => {
          console.log(error);
        });
  }


  public _getBusinessIdUrl: string = 'ereqdropdown/getbusinesstypebyid';
  public businessTypeForm: any = []
  getBusinessTypeById(modelEvnt) {
    debugger;
    var param = modelEvnt;
    var apiUrl = this._getBusinessIdUrl
    this._dataservice.getbyid(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        console.log("business edit detials is ", this.res)
        if (this.res.resdata) {
          var busness = this.res.resdata.businessType[0];
          this.businessTypeForm = busness;
          console.log("this.businessTypeForm", this.businessTypeForm)
        }
      }, error => {
        console.log(error);
      });
  }






  //DeleteJobPostById(jobId:string)
  //manually delete 
  public _dltUrl: string = 'ereqdropdown/DeleteJobPostById';
  DeleteJobPostById(jobId: string) {
    debugger
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) {
      return; // User canceled, do nothing
    }
    var apiUrl = this._dltUrl;
    var param = { id: jobId }
    this._dataservice.deleteById(apiUrl, jobId)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.success = true) {
            this.toastr.error("Delete Successfully");
            window.location.reload();
          }
          console.log("Delete Item Is", this.res)
        }, error => {
          console.log(error);
        });
  }


  //systeem delete

  public _dltsUrl: string = 'ereqdropdown/DeleteJobPostById';
  delete(modelEvnt) {
    debugger
    var apiUrl = this._dltsUrl;
    var jobId = modelEvnt.model.jobOid
    this._dataservice.deleteById(apiUrl, jobId)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.success = true) {
            this.toastr.error("Delete Successfully");
            window.location.reload();
          }
          console.log("Delete Item Is", this.res)
        }, error => {
          console.log(error);
        });
  }




  public masterListDetails: any;
  public _getjobbyIdUrl: string = 'jobpost/getbyid';
  showJobDetails(modelEvnt) {
    debugger
    if (modelEvnt.business) {
      this.getBusinessTypeById(modelEvnt.business)
    }
    this.masterList = [];
    this.skillList = [];
    this.benifitList = [];
    this.requirementList = [];
    this.experienceList = [];
    this.otherRequirementList = [];
    this.responsibilityList = [];
    this.jobShowDiv = true;
    console.log("modelEvnt", modelEvnt)
    var param = { strId: modelEvnt.jobOid, strId2: modelEvnt.jobOid };
    var apiUrl = this._getjobbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {

        this.res = response;


        this.masterList = JSON.parse(this.res.resdata.jobPostMaster)
        this.masterListDetails = this.masterList[0];
        console.log("this.Total test test -------------------", (this.masterListDetails))
        if (this.res.resdata.jobSkill) {
          this.skillList = JSON.parse(this.res.resdata.jobSkill)
        }
        if (this.res.resdata.jobBenefit) {
          this.benifitList = JSON.parse(this.res.resdata.jobBenefit)
        }
        if (this.res.resdata.jobRequirement) {
          this.requirementList = JSON.parse(this.res.resdata.jobRequirement)
        }
        if (this.res.resdata.jobExperience) {
          this.experienceList = JSON.parse(this.res.resdata.jobExperience)
        }
        if (this.res.resdata.jobOtherRequirement) {
          this.otherRequirementList = JSON.parse(this.res.resdata.jobOtherRequirement)
        }
        if (this.res.resdata.jobResponsibility) {
          this.responsibilityList = JSON.parse(this.res.resdata.jobResponsibility)
        }








        // console.log("this.this.jobPostForm",this.requirementForm)

      }, error => {
        console.log(error);
      });
  }





  BackToJobList() {
    this.jobShowDiv = false;
    this.getListByPage(this.pageSize)

  }













  //TEST START HERE 







}