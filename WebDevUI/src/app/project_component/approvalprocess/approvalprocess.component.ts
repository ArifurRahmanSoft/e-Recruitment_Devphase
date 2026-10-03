import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { DatePipe, DOCUMENT, formatDate } from '@angular/common';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Options } from 'select2';
import { fontModel } from './fontModel';
import { jsPDF } from 'jspdf';
import { Console } from 'console';
import { Router } from '@angular/router';
//import { ApiService } from 'src/app/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/api/user';
import { CommonService } from 'src/app/theme/components/commonservice/commonservice.component';
//import { CommonPager } from 'src/app/theme/components/commonpager/commonpager';
import { ReportViewer } from '../reportviewer/reportviewer';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { pathValidation } from 'src/app/api/api.pathvlidation.service';
//import { DataService } from 'src/app/api/api.dataservice.service';
//import { PagerService } from 'src/app/api/api.pager.service';
import { Conversion } from 'src/app/api/api.conversion.service';
import { de } from 'date-fns/locale';
import { CommonPager } from '../../theme/components/commonpager/commonpager';
import { PagerService } from '../../api/api.pager.service';
import { DataService } from '../../api/api.dataservice.service';
import { ApiService } from '../../api/api.service';
import { ReportModel } from '../reportviewer/reportmodel';
import { toDate } from 'date-fns';
import { forkJoin } from 'rxjs';



declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-approvalprocess',
  templateUrl: './approvalprocess.component.html',
  styleUrls: ['./approvalprocess.component.scss'],
  //providers: [PagerService],
  providers: [Conversion]
})

export class ApprovalprocessComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
  @ViewChild(ReportViewer) _rptViewer: ReportViewer;
  public settings: Settings;
  public options: Options;
  private userID = sessionStorage.getItem("userID");
  public loggedUserId: string = sessionStorage.getItem("userID");
  public RoleUser: string
  public Role: string;
  public cmnEntity: any = {};
  public isToggleMaster: boolean = true;
  public res: any;
  public resmessage: string;
  public jobPostForm: FormGroup;
  public pageSize: number = 10;
  public company: string;
   public approvalProcess: string='1';
  public department: string;
  public post: string;
  page: number = 1;
  public optionMulti: Options;

  // public startDate:Date;
  public eDate: Date;
  public sDate: Date;
  public fromDate: any;
  public toDate: any;
  candidateForm: FormGroup;
  mailForm: FormGroup;
  recruitmentApprovalForm: FormGroup;
  public applicantFormList: any;
  public loading: boolean = false
  public masterList: any;
  public accQlfList: any;
  public wrkExpList: any;
  public proCirtificateList: any;
  public jobTitle: any;
  public showModal: boolean = false;
  public selectedOid: string = '';
  public inputField: string = '';
  public commentText: string = '';
  public JobTitle!: string;
  public Salary!: any;
  public joiningDate!: any;
  public mailType!: string;
  isVerify: boolean = true;
  selectedVerifyOption: string = 'isVerify';
  isVerifyDecline: boolean = false;
  verifyNote: string = '';


  isApprove: boolean = true;
  selectedApproveOption: string = 'isApprove';
  isApproveDecline: boolean = false;
  approveNote: string = '';

  commentRows = 6;
  commentCols = 50;
  public loadings: boolean = false;
  emailTypeList: string[] = ['Written', 'Viva', 'Written & Viva', 'Offer Latter'];
  applicantStatusType: Array<{ value: string, label: string }> = [
    { value: '1', label: 'Written' },
    { value: '2', label: 'Viva' },
    { value: '3', label: 'Written & Viva' },
    { value: '4', label: 'Offer Latter' },
    { value: '5', label: 'Joining' },
  ]

  testData: any;


  bloodGroupList: Array<{ id: string, text: string }> = [
    { id: '', text: 'Select Blood Group' }, { id: '1', text: 'A+' }, { id: '5', text: 'B+' }, { id: '7', text: 'O+' }, { id: '3', text: 'AB+' },
    { id: '2', text: 'A-' }, { id: '6', text: 'B-' }, { id: '8', text: 'O-' }, { id: '4', text: 'AB-' }
  ];

  examTypeList: Array<{ id: string, text: string }> = [
    { id: '', text: 'Select Exam Type' }, { id: '1', text: 'Written Test' }, { id: '2', text: 'Preliminary Interview' }, { id: '3', text: 'Final Interview' }, { id: '4', text: 'CM/ Board Interview' }];
  dropDownType: Array<{ id: string, text: string }> = [{ id: '', text: 'Please Select' }, { id: '1', text: 'Yes' }, { id: '2', text: 'No' }]
  festivalBonusList: Array<{ id: string, text: string }> = [{ id: '', text: 'Please Select' }, { id: '1', text: 'Full' }, { id: '2', text: 'Part' }]
  jobTypeList: Array<{ id: string, text: string }> = [{ id: '', text: 'Please Select' }, { id: '1', text: 'Permanent' }, { id: '2', text: 'Contractual' }]
  // select2Options = {
  //   multiple: true,   // ✅ VERY IMPORTANT
  //   width: '100%',
  //   closeOnSelect: false
  // };

  constructor(public appSettings: AppSettings,
    private datePipe: DatePipe,

    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    public fb: FormBuilder,
    private _conversion: Conversion,
    //private _conversion: Conversion,
    public dialog: MatDialog,
    public router: Router,
    public _apiService: ApiService,
    private toastr: ToastrService,
    private _dataservice: DataService,

    @Inject(DOCUMENT) private document: any
  ) {

    //this.options = this._pathValidation.ngSelect2Option();
    this.settings = this.appSettings.settings;
    this._pathValidation.validate(this.document.location);
    this.cmnEntity = this._pathValidation.rowEntities();
    console.log("this.cmnEntity", this.cmnEntity)

    this.optionMulti = {
      multiple: true
      , allowClear: true
      , tags: true
      , closeOnSelect: false
      , templateSelection: (object: any) => {
        return object && object.text;
      }
      , templateResult: (object: any) => {
        return object && object.text;
      }
    };

  }




  ngOnInit() {
    this.getUserInfoByuserID(this.loggedUserId)
    this.getApprovalUserInfoByuserID(this.loggedUserId);//get approbvlar
    this.getPostList();
    this.createForm();
    this.createRecruitmentForm()
    this.createMailForm()
    this.getJobPostList()
    this.updateTextareaSize();
    window.addEventListener('resize', this.updateTextareaSize.bind(this));
    this.getallExaminar();
    this.getallEmployee();
    this.getAllDesignation();
    this.getAllLocation();
    // this.getCandidateList();
       this.getCompanyJob();
    this.getDepartmentJob();
    this.getDesignationJob();

  }


 



  public BGtxt: any;
  getBloodGroupText(id: string) {
    const bg = this.bloodGroupList.find(item => item.id === id);
    this.BGtxt = bg?.text;
  }


  updateTextareaSize() {
    if (window.innerWidth <= 767) {
      this.commentRows = 6;
      this.commentCols = 40;
    } else {
      this.commentRows = 6;
      this.commentCols = 50;
    }
  }


  getExamTypeName(id: any): string {
  const found = this.examTypeList.find(x => x.id == id);
  return found ? found.text : '';
}
  createForm() {
    this.candidateForm = new FormGroup({
      jobTitle: new FormControl(null),
      company: new FormControl(null),
      department: new FormControl(null),
      post: new FormControl(null),
      startDate: new FormControl(null), // Form control for startDate
      endDate: new FormControl(null),
      mailType: new FormControl(null),
      mailDate: new FormControl(null),
      examTime: new FormControl(null),
      fromExperience: new FormControl(null),
      toExperience: new FormControl(null)
    });
  }

  createMailForm() {
    this.mailForm = new FormGroup({
      toEmail: new FormControl(null),
      subject: new FormControl(null),
      body: new FormControl(null),


    });
  }




  createRecruitmentForm() {
    this.recruitmentApprovalForm = new FormGroup({
      aprvRecruitmentOid: new FormControl(null),
      profileOid: new FormControl(null),
      applicantOid: new FormControl(null),
      jobOid: new FormControl(null),
      requsitionOid: new FormControl(null),
      lineManager: new FormControl(null),
      salary: new FormControl(null),
      designation: new FormControl(null),
      joiningDate: new FormControl(this._conversion.Today()),  //new FormControl(null),
      salaryGrade: new FormControl(null),
      salaryReviewer: new FormControl(null),
      festivalBonusType: new FormControl(null),
      isPF: new FormControl(null),
      isIncrement: new FormControl(null),
      isSim: new FormControl(null),
      isDormitory: new FormControl(null),
      isTransport: new FormControl(null),
      isMedical: new FormControl(null),
      isInsurance: new FormControl(null),
      jobType: new FormControl(null),
      jobRole: new FormControl(null),
      preparedBy: new FormControl(null),
      hrBP: new FormControl(null),
      headOfUnit: new FormControl(null),
      headOfBusiness: new FormControl(null),
      finalAprvHR: new FormControl(null),
      preparedNote:new FormControl(null),


      recExam: this.formBuilder.array([]),
    })
  }


  //REFERENCE START FROM HERE 
  get recExam(): FormArray {
    return this.recruitmentApprovalForm.get('recExam') as FormArray;
  }

  addRecExam() {
    const xmGroup = this.formBuilder.group({
      recExamId: null,
      recruitmentOid: null,
      examType: [null, Validators.required],
      isAttend: [null, Validators.required],
      locationId: [null, Validators.required],
      examinarIdLst: [[], Validators.required],
      //examinarIdLst: [ Validators.required],
      examDate: [this._conversion.Today()],
      examMarks: null,
      isSelected: null,

    });

    this.recExam.push(xmGroup);
  }


  // Remove work experience by index
  removRecExam(index: number) {
    const isConfirm = confirm("Are you sure you want to remove this item?");
    if (isConfirm) {
      this.recExam.removeAt(index);
    }
    else{
      return
    }


  }




  updateRecXm(rexXm: any[]) {
    debugger
    this.clearRecExam();
    rexXm.forEach(xm => {
      var xmGroup = this.formBuilder.group({
        recExamId: xm.recExamId,
        recruitmentOid: xm.recruitmentOid,
        examType: xm.examType,
        isAttend: xm.isAttend,
        locationId: xm.locationId,
        examinarIdLst: [null, Validators.required],
        examDate: xm.examDate == null ? null : this.getNameToNumDate(xm.examDate),
        examMarks: xm.examMarks,
        isSelected: xm.isSelected,
      });

      this.recExam.push(xmGroup);
      setTimeout(() => {
        xmGroup.get('examinarIdLst')?.setValue(xm.examinarIdLstArr);
      }, 0);
    });
  }

  clearRecExam() {
    while (this.recExam.length !== 0) {
      this.recExam.removeAt(0);
    }
  }

  //Modal Entry
  @ViewChild('modalEntry') modalEntry: TemplateRef<any>;
  private _dialogRef: MatDialogRef<TemplateRef<any>>;
  public modalType: string = '';
  public modalControlName: string = '';
  public modalLabelName: string = '';
  openModalEntryDialog(modaltype,list): void {
   
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
        this.modalForm  = new FormGroup({
          bassetTypeId: new FormControl(null),
          bassetTypeCode: new FormControl(null),
          bassetTypeName: new FormControl(null, Validators.required),
          bassetTypeSName: new FormControl(null),
           approvalNote: new FormControl(null),
          selectedApprovalOption: new FormControl(null, Validators.required),
          //categoryId: new FormControl(this.jobPostForm.controls.post.value, Validators.required),
          isActive: new FormControl(true)
        });


        break;


    }
  }

  resetModal() {
    this.modalForm = new FormGroup({});
  }



  cmnbtnAction(evmodel) {
    debugger
    this[evmodel.func](evmodel);
  }

  showHide() {
    debugger;
    this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    console.log("this.cmnEntity Show Hide ", this.cmnEntity)
  }

  setToggling(divName) {
    debugger;
    if (divName == 'Master') {
      this.isToggleMaster = this.isToggleMaster ? false : true;
    }


  }



  public _getApprovalUserInUrl: string = 'jobuserRole/getapprovalbyuserid';
  public roleName: string = '';
  getApprovalUserInfoByuserID(id: string) {
    var userid = id
    var param = { LoggedUserId: userid };
    var apiUrl = this._getApprovalUserInUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        this.roleName = this.res.resdata.roleName;
      }, error => {
        console.log(error);
      });
  }


  //GET ALL DESIGNATION LIST
  public designationList: any;
  public _desUrl: string = 'jobdropdown/getalldesignation';
  getAllDesignation() {
    var list: Array<{ id, text }> = [{ id: '', text: "Please Select" }];
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
  public locationList: any;
  public _locUrl: string = 'jobPost/getlocationlist';
  getAllLocation() {
    debugger
    var list: Array<{ id: any, text: string }> = [];
    var apiUrl = this._locUrl;
    var param = this.loggedUserId
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listLocation.length > 0) {
            var itemList = this.res.resdata.listLocation;
            var listItem = JSON.parse(itemList)
            listItem.forEach(item => {
              list.push({ id: item.locationOid, text: item.locName });
            });
            this.locationList = list;
          }
        }, error => {
          console.log(error);
        });
  }

  //GET user role,des 
  public _getUserInUrl: string = 'ereqdropdown/getaUserInfoById';
  getUserInfoByuserID(id: string) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getUserInUrl;
    var param = id;
    this._dataservice.getbyid(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          this.RoleUser = this.res.resdata.listuserInfo[0].userRole
          this.Role = this.res.resdata.listuserInfo[0].userRole
          console.log(" this.RoleUser one", this.RoleUser)
          this.getApplicationList();
          this.getListByPage(this.pageSize)
        }, error => {
          console.log(error);
        });
  }

  //when role is id then use it
  public _getUserInUrls: string = 'ereqdropdown/getaUserInfoByRoleId';
  getUserInfoByuserIDs(id: string) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getUserInUrls;
    var param = id;
    this._dataservice.getbyid(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          this.RoleUser = this.res.resdata.listuserInfo[0].userRole
          console.log(" this.RoleUser final nmame is ", this.RoleUser)
          this.getApplicationList();

        }, error => {
          console.log(error);
        });
  }







  //get job title
  public jobPostList: any;
  public _jobPostUrl: string = 'ereqdropdown/getalljobtitle';
  getJobPostList() {
    var list: Array<any> = ["Please Select"];
    var apiUrl = this._jobPostUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          console.log("total job ttile is ", this.res)
          if (this.res.resdata.listJob.length > 0) {
            var itemList = this.res.resdata.listJob;
            itemList.forEach(item => {
              const formattedDate = this.datePipe.transform(item.jobEndDate, 'dd-MM-yyyy') ?? '';
              list.push({ id: item.jobID, text: item.jobTitle + "-" + "Closing Date(" + formattedDate + ")" });
            });
            this.jobPostList = list;
            console.log("total job ttile is ---", this.jobPostList)

          }
        }, error => {
          console.log(error);
        });
  }


  public AppliedpostList: any;
  public _postUrl: string = 'ereqdropdown/getallpostcandidate';
  getPostList() {
    var list: Array<any> = ["Please Select"];
    var apiUrl = this._postUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listPost.length > 0) {
            var itemList = this.res.resdata.listPost;
            itemList.forEach(item => {
              list.push(item.postName);
            });
            this.AppliedpostList = list;

          }
        }, error => {
          console.log(error);
        });
  }

  getPost(event: any) {
    debugger
    this.post = event.target.value;
    console.log(" this.post", this.post)
  }




  public _applicationListUrl: string = 'candidateinfo/getallapplication';
  getApplicationList() {
    this.applicantFormList = [];
    debugger
    this.jobTitle = this.jobId;
    //this.jobTitle=this.candidateForm.get('jobTitle')?.value;
    this.company = this.candidateForm.get('company')?.value;
    this.department = this.candidateForm.get('department')?.value;
    this.post = this.candidateForm.get('post')?.value;
    this.sDate = this.candidateForm.get('startDate')?.value;
    this.eDate = this.candidateForm.get('endDate')?.value;

    //this.getListByPage(this.pageSize)
    let model = [{
      JobTitle: this.jobTitle || null,
      Company: this.company || null,
      Department: this.department || null,
      Post: this.post || null,
      Role: this.RoleUser,
      UserID: this.loggedUserId

    }];

    console.log("Parameter Is", model)
    var apiUrl = this._applicationListUrl;
    this._dataservice.getWithMultipleModel(apiUrl, model)
      .subscribe(
        response => {
          this.res = response;

          if (this.res.resdata.listApplicant.length > 0) {
            const list = JSON.parse(this.res.resdata.listApplicant);
            this.applicantFormList = list
            console.log(" this.departmapplicantFormListentList", this.applicantFormList)


          }
        }, error => {
          console.log(error);
        });


  }




  public jobId: string = '';


  getApplicantListByExperience() {
    this.fromDate = this.candidateForm.get('fromExperience')?.value;
    this.toDate = this.candidateForm.get('toExperience')?.value;
    this.JobTitle = this.candidateForm.get('jobTitle')?.value == 'Please Select' ? '' : this.candidateForm.get('jobTitle')?.value;
    debugger
    this.getListByPage(this.pageSize)
  }



  public responseTag: string = 'listJobPost';
  public joApplicationLists: any = [];
  public _listByPageUrl: string = 'candidateinfo/getapplicationlstbypages';
  getListByPage(pageSize) {
    debugger
    setTimeout(() => {
      this._pg.getListByPage(1, true, pageSize, '');
      setTimeout(() => {
      }, 300);
    }, 0);
  }
  sendToList(ev) {
    this.joApplicationLists = ev;
    console.log("this.jobPostLists==>", this.joApplicationLists)
  }


  Status: string;
  getApplicantType(event: any) {
    debugger
    this.Status = event;
    console.log("mailType  selected:", this.mailType);

  }







  reset() {

  }



  //GET DATA BY ID FOR REPORT 
  // public _getcanDeIdUrl: string = 'reqform/getapplicationdetailbyid';
  // getcandidateDetail(modelEvnt: any) {
  //   debugger;
  //   console.log("modelEvnt", modelEvnt)
  //   var param = { strId: modelEvnt };
  //   var apiUrl = this._getcanDeIdUrl
  //   this._dataservice.getWithMultipleModel(apiUrl, param)
  //     .subscribe(response => {
  //       this.res = response;
  //       console.log("Detalis master ", this.res)
  //       this.masterList = JSON.parse(this.res.resdata.regApplicantMaster)
  //       this.downloadFile(this.masterList[0].CvNo, this.masterList[0].name, this.masterList[0].job_title)
  //       if (this.res.resdata.accQlfDetail) {
  //         this.accQlfList = JSON.parse(this.res.resdata.accQlfDetail)
  //       }
  //       if (this.res.resdata.wrkExperience) {
  //         this.wrkExpList = JSON.parse(this.res.resdata.wrkExperience)
  //       }
  //       if (this.res.resdata.profCertificate) {
  //         this.proCirtificateList = JSON.parse(this.res.resdata.profCertificate)
  //       }
  //       console.log("Detalis master ", this.masterList)
  //       console.log("Detalis accQlfList", this.accQlfList)
  //       console.log("Detalis wrkExpList", this.wrkExpList)
  //       console.log("Detalis proCirtificateList", this.proCirtificateList)

  //     }, error => {
  //       console.log(error);
  //     });
  // }





  public _getReportUrl: string = 'reqform/getapplicatntreport';
  loadReports(model) {
    debugger
    var repFile = 'rptApplicantCV' + '.rdlc';
    var rmodel = { reportPath: '/reportfile/business/applicant/' + repFile, reportName: 'CV' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 580);
    var param = { strId: model };
    var repParam = [{ PrintDate: this._conversion.Today() }];
    var ModelsArray = [repParam, param];
    this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray);
  }


  loadRacReports(model) {
    debugger
    var repFile = 'rptRAC' + '.rdlc';
    var rmodel = { reportPath: '/reportfile/business/applicant/' + repFile, reportName: 'RAC' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 580);
    var param = { strId: model };
    var repParam = [{ PrintDate: this._conversion.Today() }];
    var ModelsArray = [repParam, param];
    this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray);
  }


  loadCandidateParticulars(model) {
    debugger
    var repFile = 'rptInterviewCandidatesParticulars' + '.rdlc';
    var rmodel = { reportPath: '/reportfile/business/applicant/' + repFile, reportName: 'CV' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 580);
    var param = { strId: model };
    var repParam = [{ PrintDate: this._conversion.Today() }];
    var ModelsArray = [repParam, param];
    this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray);
  }

  loadCandidatePersonalInfo(model) {
    debugger
    var repFile = 'rptPersonalInfo' + '.rdlc';
    var rmodel = { reportPath: '/reportfile/business/applicant/' + repFile, reportName: 'CV' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 580);
    var param = { strId: model };
    var repParam = [{ PrintDate: this._conversion.Today() }];
    var ModelsArray = [repParam, param];
    this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray);
  }

  loadIdentityCardInfo(model) {
    debugger
    var repFile = 'rptIdentyCard' + '.rdlc';
    var rmodel = { reportPath: '/reportfile/business/applicant/' + repFile, reportName: 'CV' };
    this._rptViewer.rptModel = new ReportModel(rmodel.reportPath, rmodel.reportName, 580);
    var param = { strId: model };
    var repParam = [{ PrintDate: this._conversion.Today() }];
    var ModelsArray = [repParam, param];
    this._rptViewer.reportOutPage(this._getReportUrl, ModelsArray);
  }


  //DOWNLOAD FILE FROM PATH
  public _fileUrl: string = 'reqform/getImage'
  public cvDetails: any;
  downloadFile(imgPath: string, name: string, jobTitle: string) {
    this.cvDetails = imgPath;
    debugger
    if (!imgPath) {
      this.toastr.error("No file Found")
      console.error('No file content received.');
      return;
    }
    this._dataservice.downloadFile(this._fileUrl, imgPath).subscribe(response => {
      const blob = response.body;
      if (!blob) {
        this.toastr.error("No file Found")
        console.error('No file content received.');
        return;
      }


      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = name + "-" + jobTitle + ".pdf";

      if (contentDisposition) {
        const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
        if (matches?.[1]) {
          fileName = matches[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download failed:', error);
    });
  }



  edit(id: string) {
    this._dataservice.setOid(id, false, true);
    this.router.navigate(['/apply']);
  }


  convertOracleDateToInput(dateString: string): string {
    if (!dateString) return '';

    const parts = dateString.split('-'); // ["08", "MAY", "25"]
    const day = +parts[0];
    const month = parts[1].toUpperCase();
    const shortYear = +parts[2];

    const monthMap: any = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };

    const fullYear = shortYear < 50 ? 2000 + shortYear : 1900 + shortYear;
    const jsDate = new Date(fullYear, monthMap[month], day);

    return formatDate(jsDate, 'yyyy-MM-dd', 'en-US');
  }


  OpenModal(oid: string): void {
    this.Salary = '';
    this.joiningDate = '';
    debugger
    this.selectedOid = oid;
    this.showModal = true; // Show modal
  }

  closeModal(): void {
    this.showModal = false;
    this.inputField = '';
    this.commentText = '';
  }
  public _setUpMsgUrl: string = 'reqform/SaveUpdateJoiningInfo';
  submitModal(): void {
    debugger
    const param = {
      loggedUserId: this.userID
    };
    const joiniDetails = {
      oid: this.selectedOid,
      salary: this.Salary,
      joiningDate: this.joiningDate
    };
    const ModelsArray = [param, joiniDetails];
    this._dataservice.postMultipleModel(this._setUpMsgUrl, ModelsArray)
      .subscribe(
        response => {
          this.res = response;
          console.log("this.response message ", this.res)
          this.resmessage = this.res.resdata.resstate;
          if (this.resmessage) {
            this.toastr.success('Save Successfully');
            this.closeModal(); // Close modal
            window.location.reload(); // Reload page if needed 
          }
          else {
            this.toastr.error('Sata Not save');
            this.closeModal(); // Close modal
            window.location.reload(); // Reload page if needed 
          }
        },
        error => {
          console.error(error);
        }
      );
  }


  public showVerifyModal: any
  OpenVerifyModal(oid: string): void {
    debugger
    this.selectedOid = oid;
    this.showVerifyModal = true; // Show modal
  }
  closeVerifyModal(): void {
    this.showVerifyModal = false;
    this.inputField = '';
    this.commentText = '';
  }

  public _setverifyUrl: string = 'reqform/SaveUpdateVerifyInfo';
  submitVerifyModal() {
    debugger
    if (this.selectedVerifyOption === 'isVerify') {
      this.isVerify = true;
      this.isVerifyDecline = false;
    } else if (this.selectedVerifyOption === 'isVerifyDecline') {
      this.isVerify = false;
      this.isVerifyDecline = true;
    }
    const param = { loggedUserId: this.userID };
    const verifyDetails = {
      oid: this.selectedOid,
      isVerify: this.isVerify,
      isVerifyDecline: this.isVerifyDecline,
      note: this.verifyNote
    };
    const ModelsArray = [param, verifyDetails];
    this._dataservice.postMultipleModel(this._setverifyUrl, ModelsArray)
      .subscribe(
        response => {
          this.res = response;
          console.log("this.response message ", this.res)
          this.resmessage = this.res.resdata.resstate;
          if (this.resmessage) {
            this.toastr.success('Save Successfully');
            this.closeVerifyModal(); // Close modal
            window.location.reload(); // Reload page if needed 
          }
          else {
            this.toastr.error('Sata Not save');
            this.closeVerifyModal(); // Close modal
            window.location.reload(); // Reload page if needed 
          }
        },
        error => {
          console.error(error);
        }
      );
  }



  public showApproveModal: any
  public showVerifyNote: string = '';
  OpenApproveModal(list: any): void {
    debugger
    this.showVerifyNote = '';
    this.selectedOid = list.applicantOid;
    this.showVerifyNote = list.verifyDecNote
    this.showApproveModal = true; // Show modal
  }
  closeApproveModal(): void {
    this.showApproveModal = false;
    this.inputField = '';
    this.commentText = '';
  }


  public _setApproveUrl: string = 'reqform/SaveUpdateApproveInfo';
  submitApproveModal() {
    debugger
    if (this.selectedApproveOption === 'isApprove') {
      this.isApprove = true;
      this.isApproveDecline = false;
    } else if (this.selectedApproveOption === 'isApproveDecline') {
      this.isApprove = false;
      this.isApproveDecline = true;
    }
    const param = { loggedUserId: this.userID };
    const verifyDetails = {
      oid: this.selectedOid,
      isApprove: this.isApprove,
      isApproveDecline: this.isApproveDecline,
      note: this.approveNote
    };
    const ModelsArray = [param, verifyDetails];
    this._dataservice.postMultipleModel(this._setApproveUrl, ModelsArray)
      .subscribe(
        response => {
          this.res = response;
          console.log("this.response message ", this.res)
          this.resmessage = this.res.resdata.resstate;
          if (this.resmessage) {
            this.toastr.success('Save Successfully');
            this.closeApproveModal(); // Close modal
            window.location.reload(); // Reload page if needed 
          }
          else {
            this.toastr.error('Sata Not save');
            this.closeApproveModal(); // Close modal
            window.location.reload(); // Reload page if needed 
          }
        },
        error => {
          console.error(error);
        }
      );
  }




  public _getApplicanUdUrl: string = 'reqform/getapplicationdetailbyid';
  public candidateInfo: any;
  updateModal(oid: string) {
    this.Salary = '';
    this.joiningDate = '';
    debugger
    this.selectedOid = oid;
    this.showModal = true;
    debugger;
    console.log("modelEvnt", oid)
    var param = { strId: oid };
    var apiUrl = this._getApplicanUdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;

        var masterList = JSON.parse(this.res.resdata.regApplicantMaster)
        this.candidateInfo = masterList[0];
        this.Salary = this.candidateInfo.joiningSalary;
        this.joiningDate = this.datePipe.transform(this.candidateInfo.joiningDate, 'yyyy-MM-dd') ?? '';
        //this.joiningDate=this.candidateInfo.joiningDate
      }, error => {
        console.log(error);
      });
  }



  //html view
  public candidateMaster: any;
  public masterListDetails: any;
  public hTrainingList: any;
  hReferenceList: any;
  public htmlView: boolean = false;
  public _getcanDeIdUrl: string = 'reqform/getcandidatedetailsbyid';
  getcandidateDetail(modelEvnt) {
    debugger;
    this.htmlView = true;

    console.log("modelEvnt", modelEvnt)
    var param = { strId: modelEvnt };
    var apiUrl = this._getcanDeIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;

        console.log("details data is ", this.res)
        this.masterList = JSON.parse(this.res.resdata.regApplicantMaster)
        this.masterListDetails = this.masterList[0];
        this.candidateMaster = this.masterListDetails
        if (this.candidateMaster.blood_group) { this.getBloodGroupText(this.candidateMaster.blood_group) }
        if (this.res.resdata.accQlfDetail) {
          this.accQlfList = JSON.parse(this.res.resdata.accQlfDetail)
        }
        if (this.res.resdata.wrkExperience) {
          this.wrkExpList = JSON.parse(this.res.resdata.wrkExperience)
        }
        if (this.res.resdata.profCertificate) {
          this.proCirtificateList = JSON.parse(this.res.resdata.profCertificate)
        }
        if (this.res.resdata.training) {
          this.hTrainingList = JSON.parse(this.res.resdata.training)

        }
        if (this.res.resdata.reference) {
          this.hReferenceList = JSON.parse(this.res.resdata.reference)
        }
        console.log("Detalis master------------- ", this.candidateMaster)
        console.log("Detalis accQlfList", this.accQlfList)
        console.log("Detalis wrkExpList", this.wrkExpList)
        console.log("Detalis proCirtificateList", this.proCirtificateList)
        console.log("Detalis trainingList", this.hTrainingList)
        console.log("Detalis referenceList", this.hReferenceList)


      }, error => {
        console.log(error);
      });
  }

  backToListShow() {
    this.htmlView = false;
  }



  public examinarLst: any;
  public _postxmUrl: string = 'candidateinfo/geteallexaminardrpdwn';
  getallExaminar() {
    var list: Array<{ id: string, text: string }> = [{ id: '', text: "Please Select" }];
    var apiUrl = this._postxmUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllExaminar) {
            var itemList = JSON.parse(this.res.resdata.listAllExaminar);
            itemList.forEach(item => {
              list.push({ id: item.emp_ID, text: item.nameDesignation });
            });
            this.examinarLst = list;
          }
        }, error => {
          console.log(error);
        });
  }



  //   public examinarIdLst:any
  // onExaminarChange(event: any, index: number) {
  //   debugger
  //   const selectedIds = event; 
  //   const commaIds = selectedIds.join(',');
  //   console.log('Array:', selectedIds);
  //   console.log('Comma:', commaIds);
  //   this.recExam.at(index).patchValue({
  //     examinarIdLst: selectedIds 
  //   });
  // console.log('this.recExam.value:', this.recExam.value);
  // }




  //GET ALL EMPLOYEE IN CITY GROUP
  public employeeLst: any;
  public _postempUrl: string = 'candidateinfo/geteallemployeedrpdwn';
  getallEmployee() {
    debugger
    var list: Array<{ id: string, text: string }> = [{ id: '', text: "Please Select" }];
    var apiUrl = this._postempUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllEmployee) {
            var itemList = JSON.parse(this.res.resdata.listAllEmployee);
            itemList.forEach(item => {
              list.push({ id: item.oid, text: item.name });
            });
            this.employeeLst = list;

          }
        }, error => {
          console.log(error);
        });
  }



  public showRecruitmentApproval: boolean = false;
  ShowRecruuitmentApproval(flags: any, list: any) {
    this.isUpdate = false
    debugger
    if (flags == 0) {
      this.createRecruitmentForm();
      this.showRecruitmentApproval = flags;
    }
    else {
      this.createRecruitmentForm();
      this.showRecruitmentApproval = flags;
      this.recruitmentApprovalForm.patchValue({
        profileOid: list.profileId,
        applicantOid: list.applicantOid,
        jobOid: list.jobId,
        requsitionOid: list.requsitionOid,
      })
    }



  }

  finalApproval:boolean=false;
  showApproval(list:any,flag:any){
    this.showRecruitmentApproval=flag
    this.finalApproval=flag

  }


  setCheckboxValue(event: any, controlName: string) {
    const isChecked = event.target.checked;
    this.recruitmentApprovalForm.patchValue({
      [controlName]: isChecked
    });

  }






  public _saveUrl: string = 'reqform/saveupdaterecapproval';
  onSubmit(): void {
    debugger
    let formValue = this.recruitmentApprovalForm.value;
    formValue.recExam.forEach(item => {
      if (item.examinarIdLst && item.examinarIdLst.length > 0) {
        item.examinarIdLst = item.examinarIdLst.join(',');
      }
    });
    let formValues = { ...this.recruitmentApprovalForm.value };
    delete formValues.recExam;
    const recApprvForm = formValues;
    const recApprvExam = this.recExam.value;
    const param = { loggedUserId: this.loggedUserId };
    const ModelsArray = [param, [recApprvForm], recApprvExam];

    this._dataservice.postMultipleModel(this._saveUrl, ModelsArray)
      .subscribe(response => {
        this.res = response;
        this.resmessage = this.res.resdata.message;
        if (this.res.resdata.resstate) {
          this.toastr.success('Save Successfully');
          window.location.reload();
          this.reset();

        }
      }, error => {
        console.log(error);
      });
  }



  public isUpdate: boolean = false;
showRequsition(flags: any, list: any){
  debugger
    this.isUpdate = true;
    this.showRecruitmentApproval = flags;

    this.getRequsitionById(list)


}


revisedHeadOfBsnsNote:string='';
revisedHRLeadNote:string='';
public applicationMstr:any;
public recruitmentApproval:any;
public approvalXmlist:any
public _getreqbyIdUrl: string = 'reqform/getapplicationdetailbyid';
  public applicantOid:string='';
  getRequsitionById( list: any) {
    debugger;
   this.applicantOid=list.applicantOid
   this.revisedHeadOfBsnsNote='';
    this.revisedHRLeadNote='';
    var param = { strId: list.applicantOid };
    var apiUrl = this._getreqbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        var applicationMstr=JSON.parse(this.res.resdata.regApplicantMaster)
        this.applicationMstr=applicationMstr[0];

        if(this.res.resdata.aprovalCheckLstMaster){
          var aprovalCheckLstMaster=JSON.parse(this.res.resdata.aprovalCheckLstMaster)
        this.recruitmentApproval=aprovalCheckLstMaster[0];
        this.revisedHeadOfBsnsNote=this.recruitmentApproval.RevisedheadOfBUnitdNote
        this.revisedHRLeadNote=this.recruitmentApproval.RevisedHRLeadNote
        console.log("this.recruitmentApproval details is ",this.recruitmentApproval)
        }

        
        var approvalXmlist = JSON.parse(this.res.resdata.approvalXmlist); 
        this.clearRecExam();
        if (this.res.resdata.approvalXmlist) {
          var approvalXmlist = JSON.parse(this.res.resdata.approvalXmlist);
          this.approvalXmlist=approvalXmlist;
          this.updateRecXm(approvalXmlist)
        }
         var recApproval = JSON.parse(this.res.resdata.aprovalCheckLstMaster);
        var recApprovalMstr = recApproval[0];

        this.recruitmentApprovalForm.patchValue({
          aprvRecruitmentOid: recApprovalMstr.aprvRecruitmentOid,
          profileOid: recApprovalMstr.profileOid,
          applicantOid: recApprovalMstr.applicantOid,
          jobOid: recApprovalMstr.jobOid,
          requsitionOid: recApprovalMstr.requsitionOid,
          lineManager: recApprovalMstr.lineManager,
          salary: recApprovalMstr.salary,
          designation: recApprovalMstr.designation,
          joiningDate: recApprovalMstr.joiningDate == null ? null : this.getNameToNumDate(recApprovalMstr.joiningDate),
          salaryGrade: recApprovalMstr.salaryGrade,
          salaryReviewer: recApprovalMstr.salaryReviewer,
          festivalBonusType: recApprovalMstr.festivalBonusType,
          isPF: recApprovalMstr.isPF == 0 ? false : true,
          isIncrement: recApprovalMstr.isIncrement == 0 ? false : true,
          isSim: recApprovalMstr.isSim == 0 ? false : true,
          isDormitory: recApprovalMstr.isDormitory == 0 ? false : true,
          isTransport: recApprovalMstr.isTransport == 0 ? false : true,
          isMedical: recApprovalMstr.isMedical == 0 ? false : true,
          isInsurance: recApprovalMstr.isInsurance == 0 ? false : true,
          jobType: recApprovalMstr.jobType,
          jobRole: recApprovalMstr.jobRole,
          preparedBy: recApprovalMstr.preparedBy,
          hrBP: recApprovalMstr.hrBP,
          headOfUnit: recApprovalMstr.headOfUnit,
          headOfBusiness: recApprovalMstr.headOfBusiness,
          finalAprvHR: recApprovalMstr.finalAprvHR,
          preparedNote:recApprovalMstr.preparedNote
        });

      }, error => {
        console.log(error);
      });
      this.getWrittenExamByID(list.writtenExmOid);
      this.getVivaMarksByApplicantID(list.applicantOid)
  }


  getNameToNumDate(strDate: string) {
    debugger;
    var nDate = new Date(strDate);
    var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
    return Nowdate;

  }


  public approvalNote:string='';
  public selectedApprovalOption:string='';
  public _setApprvUrl: string = 'reqform/SaveUpdateApproveInfo';
  submitApproval() {
    debugger
    const param = { loggedUserId: this.userID };
    const approveDetails = {
      oid: this.applicantOid,
      isApprove: this.modalForm.value.selectedApprovalOption,
      note:  this.modalForm.value.approvalNote
    };

    const ModelsArray = [param, approveDetails];
    this._dataservice.postMultipleModel(this._setApprvUrl, ModelsArray)
      .subscribe(
        response => {
          this.res = response;
          this.resmessage = this.res.resdata.resstate;
          if (this.resmessage) {
            this.toastr.success('Save Successfully');
            window.location.reload(); // Reload page if needed 
          }
          else {
            this.toastr.error('Sata Not save');
            window.location.reload(); // Reload page if needed 
          }
        },
        error => {
          console.error(error);
        }
      );
  }






onRadioChange(value: string) {
    console.log('Radio changed to:', value);
    this.selectedApprovalOption = value;
    console.log('selectedApprovalOption is now:', this.selectedApprovalOption);
}






//GET ALL COMPANY DEPARTMENT AND DESIGANTION FROM JOB POST AND ALL ARE UNIQUE
public _getjobCompany: string = 'jobPost/getallcompantfromjob';
  public jobCompanyList: any;
  getCompanyJob() {
    var list: Array<{ id: string, text: string }> = [
      { id: '0', text: "Please Select" }
    ];
    var apiUrl = this._getjobCompany;
    var param = this.loggedUserId;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          let jsonString = this.res.resdata.listCompany;
          let data = JSON.parse(jsonString);
          data.forEach(item => {
            if (item.oid && item.name) {
              list.push({
                id: item.oid,
                text: item.name
              });
            }
          });
          this.jobCompanyList = list;
        },
        error => {
          console.log(error);
        });
  }


  public _getjobdepartment: string = 'jobPost/getallDepartmentFromJob';
  public jobdepartmentList: any;
  getDepartmentJob() {
    debugger
    var list: Array<{ id: string, text: string }> = [
      { id: '0', text: "Please Select" }
    ];
    var apiUrl = this._getjobdepartment;
    var param = this.loggedUserId;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          let jsonString = this.res.resdata.listDepartment;
          let data = JSON.parse(jsonString);
          data.forEach(item => {
            if (item.oid && item.name) {
              list.push({
                id: item.oid,
                text: item.name
              });
            }
          });
          this.jobdepartmentList = list;        
        },
        error => {
          console.log(error);
        });
  }


    public _getjobDesignation: string = 'jobPost/getallDesignationFromJob';
  public jobdesignationsList: any;
  getDesignationJob() {
    var list: Array<{ id: string, text: string }> = [
      { id: '0', text: "Please Select" }
    ];
    var apiUrl = this._getjobDesignation;
    var param = this.loggedUserId;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          let jsonString = this.res.resdata.listDesignation;
          let data = JSON.parse(jsonString);
          console.log("Parsed Data:", data);
          data.forEach(item => {
            if (item.oid && item.name) {
              list.push({
                id: item.oid,
                text: item.name
              });
            }
          });
          this.jobdesignationsList = list; 

        },
        error => {
          console.log(error);
        });
  }








public writtenXmDtl: any;
  public _getWetnXmUrl: string = 'exam/getwrittenxmbyid';
  getWrittenExamByID(id: string) {
    debugger
    this.writtenXmDtl = '';
    debugger
    var list: Array<{ id: any, text: any }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getWetnXmUrl;
    var param = { strId: id };
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          console.log("total written exam marks details",this.res)
          var writtenXm = JSON.parse(this.res.resdata.writtenExam)
          
          if (writtenXm) {
            this.writtenXmDtl = writtenXm[0];
          }
        }, error => {
          console.log(error);
        });
  }


   public vivaExmXmDtl: any;
   public outofMarks:any;
    public vivaExmXmMstr: any;
  public _getVivaXmUrl: string = 'exam/getvivamarksbycandidate';
  getVivaMarksByApplicantID(id: string) {
    this.writtenXmDtl = '';
    debugger
    var list: Array<{ id: any, text: any }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getVivaXmUrl;
    var param = { strId: id };
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
         
          var vivaXmMarks = JSON.parse(this.res.resdata.vivaMarksDetails)
          this.vivaExmXmMstr=vivaXmMarks;
           console.log("this viva marks detials about",vivaXmMarks)
          if (vivaXmMarks) {
            this.vivaExmXmDtl = vivaXmMarks.interviewerDetails;
            this.outofMarks=vivaXmMarks.interviewerDetails[0].outofmarking;
            console.log("this viva marks detials about", this.vivaExmXmDtl)
          }
        }, error => {
          console.log(error);
        });
  }


















  

  

}



