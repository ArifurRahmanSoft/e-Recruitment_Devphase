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
  selector: 'app-appoinment',
  templateUrl: './appoinment.component.html',
  styleUrls: ['./appoinment.component.scss'],
  //providers: [PagerService],
  providers: [Conversion]
})

export class AppoinmentComponent implements OnInit {
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
  public department: string;
  public post: string;
  page: number = 1
  // public startDate:Date;
  public eDate: Date;
  public sDate: Date;
  public fromNumber: any;
  public toNumber: any;
  candidateForm: FormGroup;
  mailForm: FormGroup;
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
  public JobTitle: string;
  commentRows = 6;
  commentCols = 50;
  public loadings: boolean = false;
  emailTypeList: string[] = ['Written', 'Viva', 'Written & Viva', 'Offer Latter'];
  emailTypeLists: Array<{ value: string, label: string }> = [
    // { value: '1', label: 'Written' },
    // { value: '2', label: 'Viva' },
    // { value: '3', label: 'Written & Viva' },
    { value: '4', label: 'Offer Latter' },
  ]
  QuotationStatus: Array<{ value: string, label: string }> = [
    { value: '1', label: 'Estimate InComing' },
    { value: '0', label: 'Estimate OutGoing' },
  ];
  
  public fromDate:any;
  public toDate:any;
  public Status:any;

  constructor(public appSettings: AppSettings,
    private datePipe: DatePipe,

    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    public fb: FormBuilder,
    private _conversion: Conversion,
    //private _conversion: Conversion,
    public router: Router,
    public _apiService: ApiService,
    private toastr: ToastrService,
    private _dataservice: DataService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private document: any
  ) {

    //this.options = this._pathValidation.ngSelect2Option();
    this.settings = this.appSettings.settings;
    this._pathValidation.validate(this.document.location);
    this.cmnEntity = this._pathValidation.rowEntities();
    console.log("this.cmnEntity", this.cmnEntity)



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
    if (modaltype == 'Written') {
      _config.width = '60%';

    }
    if (modaltype != 'Written') {
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
     const today = new Date().toISOString().split('T')[0];
    this.modalForm = new FormGroup({});
    switch (modalName) {
      case 'Written':
        this.modalLabelName = 'Written';
        // this.bassetTypeForm = new FormGroup({
        //   bassetTypeId: new FormControl(null),
        //   bassetTypeCode: new FormControl(null),
        //   bassetTypeName: new FormControl(null, Validators.required),
        //   bassetTypeSName: new FormControl(null),
        //   isActive: new FormControl(true)
        // });
   
        this.modalForm = new FormGroup({
          oid: new FormControl(null),
          applicantOid: new FormControl(null),
          circularOid: new FormControl(null),
          writtenMarks: new FormControl(null, Validators.required),
          outOfMarks: new FormControl(null, Validators.required),
          writtenDate: new FormControl(today, Validators.required),
        });
        break;
    }
  }

  resetModal() {
     const today = new Date().toISOString().split('T')[0];
    this.modalForm = new FormGroup({
      oid: new FormControl(null),
      applicantOid: new FormControl(null),
      circularOid: new FormControl(null),
      writtenMarks: new FormControl(null),
      outOfMarks: new FormControl(null),
      writtenDate: new FormControl(today),
    });
  }







  ngOnInit() {
    this.getUserInfoByuserID(this.loggedUserId)
    //this.getUserInfoByuserIDs(this.loggedUserId)
    this.getCompanyList();
    this.getDepartmentList();
    this.getPostList();
    this.createForm();
    this.createMailForm()
    this.getJobPostList()
    this.updateTextareaSize();
    window.addEventListener('resize', this.updateTextareaSize.bind(this));
    this.getCompanyJob();
    this.getDepartmentJob();
    this.getDesignationJob();
    //this.createModalForm('Written');


    // this.getCandidateList();






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



     getNameToNumDate(strDate: string) {
        debugger;
        var nDate = new Date(strDate);
        var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
        return Nowdate;

    }



  //GET user role,des 
  public _getUserInUrl: string = 'ereqdropdown/getaUserInfoById';
  getUserInfoByuserID(id: string) {
    debugger
    var list: Array<{ id: any, text: any }> = [{ id: 0, text: "Please Select" }];
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




  public companyList: any;
  public _comUrl: string = 'ereqdropdown/getallcompanycandidate';
  getCompanyList() {
    var list: Array<any> = ["Please Select"];
    var apiUrl = this._comUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listCompany.length > 0) {
            var itemList = this.res.resdata.listCompany;
            itemList.forEach(item => {
              list.push(item.companyName);
            });
            this.companyList = list;
            console.log("all company are added here", this.companyList)
          }
        }, error => {
          console.log(error);
        });
  }

  getCompany(event: any) {
    debugger
    this.company = event.target.value;
    console.log(" this.company", this.company)
  }

  public departmentList: any;
  public _depUrl: string = 'ereqdropdown/getalldepartmentcandidate';
  getDepartmentList() {
    var list: Array<any> = ["Please Select"];
    var apiUrl = this._depUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          console.log(" this.departmentList", this.res)
          if (this.res.resdata.listDepartment.length > 0) {
            var itemList = this.res.resdata.listDepartment;
            itemList.forEach(item => {
              list.push(item.department);
            });
            this.departmentList = list;


          }
        }, error => {
          console.log(error);
        });
  }

  getDepartment(event: any) {
    debugger
    this.department = event.target.value;
    console.log("this.department", this.department)
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





  // public _listByPageUrl: string = 'PaymentAdvice/GetArchiveApprove/';
  // getListByPage(pageSize) {
  //   setTimeout(() => {
  //     this._pg.getListByPage(1, true, pageSize, '');
  //       setTimeout(() => {
  //       }, 300);
  //   }, 0);
  // }
  // sendToList(ev) {
  //   this.archiveList = ev;
  //   console.log("this.archiveList",this.archiveList)
  // }


  public jobId: string = '';
  // onJobTitleChanged(event: any) {
  //   debugger
  //   if (event == 'Please Select') {
  //     this.jobId = '';
  //     this.JobTitle = ''
  //   }
  //   else {
  //     this.jobId = event;
  //     this.JobTitle = event;
  //   }
  //   this.getListByPage(this.pageSize)
  // }

  getApplicantListByExperience() {
    this.fromNumber = this.candidateForm.get('fromExperience')?.value;
    this.toNumber = this.candidateForm.get('toExperience')?.value;
    this.JobTitle = this.candidateForm.get('jobTitle')?.value == 'Please Select' ? '' : this.candidateForm.get('jobTitle')?.value;
    debugger
    this.getListByPage(this.pageSize)
  }


public approvalProcess: string='1';
  public responseTag: string = 'listJobPost';
  public joApplicationLists: any = [];
  public _listByPageUrl: string = 'candidateinfo/getappoinmentbypages';
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







  reset() {

  }



  //GET DATA BY ID FOR REPORT 
  public _getcanDeIdUrl: string = 'reqform/getapplicationdetailbyid';
  getcandidateDetail(modelEvnt) {
    debugger;
    console.log("modelEvnt", modelEvnt)
    var param = { strId: modelEvnt };
    var apiUrl = this._getcanDeIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        console.log("Detalis master ", this.res)
        this.masterList = JSON.parse(this.res.resdata.regApplicantMaster)
        this.downloadFile(this.masterList[0].CvNo, this.masterList[0].name, this.masterList[0].job_title)
        if (this.res.resdata.accQlfDetail) {
          this.accQlfList = JSON.parse(this.res.resdata.accQlfDetail)
        }
        if (this.res.resdata.wrkExperience) {
          this.wrkExpList = JSON.parse(this.res.resdata.wrkExperience)
        }
        if (this.res.resdata.profCertificate) {
          this.proCirtificateList = JSON.parse(this.res.resdata.profCertificate)
        }
        console.log("Detalis master change ", this.masterList)
        console.log("Detalis accQlfList", this.accQlfList)
        console.log("Detalis wrkExpList", this.wrkExpList)
        console.log("Detalis proCirtificateList", this.proCirtificateList)

        //this.loadImages( this.masterListDetails.imagePath)
        //this.loadImages( this.masterListDetails.signaturePath)

      }, error => {
        console.log(error);
      });
  }





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




  public _setUpMsgUrl: string = 'reqform/SaveUpdateMessage';

  selectionProcess(oid: string): void {
    this.selectedOid = oid;
    this.showModal = true; // Show modal
  }

  closeModal(): void {
    this.showModal = false;
    this.inputField = '';
    this.commentText = '';
  }

  submitModal(): void {
    const param = {
      loggedUserId: this.userID
    };
    const msgDetails = {
      oid: this.selectedOid,
      inputField: this.inputField,
      message: this.commentText
    };

    const ModelsArray = [param, msgDetails];
    debugger

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



  public OfficialMsg: string;
  updateModal(oid) {
    this.selectedOid = oid;
    this.showModal = true;
    debugger;
    console.log("modelEvnt", oid)
    var param = { strId: oid };
    var apiUrl = this._getcanDeIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;

        var masterList = JSON.parse(this.res.resdata.regApplicantMaster)
        this.OfficialMsg = masterList[0].offcMessage;
        this.commentText = this.OfficialMsg;
        console.log("Detalis master data for modal ", this.commentText)
      }, error => {
        console.log(error);
      });
  }





  public emailModal: any;
  public modalTypes: string;
  public applicantOid: string = "";
  public subject: any;
  openMailModal(details: any, type: string) {
    this.subject = '';
    debugger
    this.modalTypes = type;

    const company = details.company;
    this.applicantOid = details.applicantOid;
    const toEmail = details.email;
    const position = details.appliedPost;
    const name = details.name;
    if (this.modalTypes == 'written') {
      this.subject = `written Exam`;
    }
    if (this.modalTypes == 'viva') {
      this.subject = `Viva Exam`;
    }
    if (this.modalTypes == 'OfferLater') {
      this.subject = `Offer Letter`;
    }


    const body = `
Dear ${name},

Greetings from ${company}!!

Congratulations on being selected as ${position} of ${company}.
Your target date of joining is on July 24, 2025 and your job location will be UK-Bangla Cement Ltd., Hosendi Economic Zone, Gazaria, Munshiganj.
Wishing you a great career ahead with ${company}.
Your target date of joining is on July 24, 2025 and your job location will be UK-Bangla Cement Ltd., Hosendi Economic Zone, Gazaria, Munshiganj. 

In order to complete your joining formalities, you need to report to Group HR and Admin Department (𝐌𝐫. 𝐊𝐚𝐦𝐫𝐮𝐳𝐳𝐚𝐦𝐚𝐧, 𝐀𝐬𝐬𝐢𝐬𝐭𝐚𝐧𝐭 𝐌𝐚𝐧𝐚𝐠𝐞𝐫), 𝐌𝐨𝐛𝐢𝐥𝐞: 01799994411 (at 10:00 am, House:9B, Road:51, Gulshan-2) on your day of joining.

You will get your Appointment letter on your date of joining with full details of your Remuneration as per our discussion. 

Please bring the following documents to ensure smooth onboarding:

•	Candidate NID card (2 photocopy and main copy) 
•	Bank Nominee NID card (2 photocopy)
•	E- TIN Certificate
•	Candidate Passport Size Photo (4 copies-Lab print)
•	Bank Nominee Passport Size photo (2 copies-Lab print)
•	Salary Certificate
•	Resignation Acceptance letter/Release letter (Current organization) (if applicable)
•	Experience letter (Previous organization) (if applicable)
•	Academic certificates (Original + Photocopy)
•	Utility Bill
•	Union Parishod/ Pouroshova Certificate

All original documents are only required for verification purpose on your date of joining.

Wishing you a great career ahead with City Group. 

For any queries, please contact us. 

Please reply to the mail if you accept our offer.


Please reply to the mail if you accept our offer.
`;

    this.mailForm.patchValue({
      toEmail,
      subject: this.subject,
      body
    });

    const modalElement = document.getElementById('emailModal');
    this.emailModal = new bootstrap.Modal(modalElement, {
      backdrop: false,
      keyboard: true
    });
    this.emailModal.show();
  }

  closeMailModal() {
    if (this.emailModal) {
      this.emailModal.hide();
    }
  }


  public sendmail: string = 'otp/sendmail';
  sendOfferEmail() {
    const details = this.mailForm.value;
    var body = details.body;
    var subject = details.subject;
    var toEmail = details.toEmail
    var mailType = 'offerLatter'
    var applicationOID = this.applicantOid
    var values = { body: body, subject: subject, toEmail: toEmail, mailType: mailType, applicationOID: applicationOID };
    console.log("details of the here ", values, details)
    var apiUrl = this.sendmail;
    if (this.mailForm.valid) {
      this.loading = true;
      this._dataservice.postMultipleModel(apiUrl, values)
        .subscribe({
          next: (response) => {
            this.res = response;
            var resMessage = this.res.message;
            if (this.res.data) {
              this.toastr.success(resMessage, 'success')
              this.closeMailModal();
            }
            else {
              this.toastr.error(resMessage, 'OPPS!');
            }
          },
          error: (error) => {
            this.toastr.error("Something went wrong!", "Error");
          },
          complete: () => {
            this.loading = false; // Stop spinner
          }
        })

    }
  }


  sendWrittenExamEmail() {
    const details = this.mailForm.value;
    var body = details.body;
    var subject = details.subject;
    var toEmail = details.toEmail
    var mailType = 'isWritten'
    var applicationOID = this.applicantOid
    var values = { body: body, subject: subject, toEmail: toEmail, mailType: mailType, applicationOID: applicationOID };
    console.log("details of the here ", values, details)
    var apiUrl = this.sendmail;
    if (this.mailForm.valid) {
      this.loading = true;
      this._dataservice.postMultipleModel(apiUrl, values)
        .subscribe({
          next: (response) => {
            this.res = response;
            var resMessage = this.res.message;
            if (this.res.data) {
              this.toastr.success(resMessage, 'success')
              this.closeMailModal();
            }
            else {
              this.toastr.error(resMessage, 'OPPS!');
            }
          },
          error: (error) => {
            this.toastr.error("Something went wrong!", "Error");
          },
          complete: () => {
            this.loading = false; // Stop spinner
          }
        })

    }
  }


  sendVivaExamEmail() {
    const details = this.mailForm.value;
    var body = details.body;
    var subject = details.subject;
    var toEmail = details.toEmail
    var mailType = 'isViva'
    var applicationOID = this.applicantOid
    var values = { body: body, subject: subject, toEmail: toEmail, mailType: mailType, applicationOID: applicationOID };
    console.log("details of the here ", values, details)
    var apiUrl = this.sendmail;
    if (this.mailForm.valid) {
      this.loading = true;
      this._dataservice.postMultipleModel(apiUrl, values)
        .subscribe({
          next: (response) => {
            this.res = response;
            var resMessage = this.res.message;
            if (this.res.data) {
              this.toastr.success(resMessage, 'success')
              this.closeMailModal();
            }
            else {
              this.toastr.error(resMessage, 'OPPS!');
            }
          },
          error: (error) => {
            this.toastr.error("Something went wrong!", "Error");
          },
          complete: () => {
            this.loading = false; // Stop spinner
          }
        })

    }
  }




  public mailDate: Date;
  getMAilDate(event: any) {
    debugger
    this.mailDate = event.target.value;
  }

  public examTime: string;
  public meridiem: string
  public examHour: string;
  getMAilTime(event: any) {
    const time = event.target.value;
    const [hour, minute] = time.split(':').map(Number);
    if (hour > 12) {
      var tempTime = hour - 12;
      this.examTime = tempTime.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0');
    }
    else {
      this.examTime = hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0')
    }
    this.meridiem = hour >= 12 ? 'PM' : 'AM';
    this.examHour = this.examTime + "-" + this.meridiem
    console.log("exam time  selected:", this.examHour);
  }

  mailType: string;
  mailTypeList: string;
  getMailType(event: any) {
    debugger
    this.mailType = event;
    console.log("mailType  selected:", this.mailType);

  }
  public checkApplicationList: any = [];
  setDateByRow(event: any, index: number, list: any) {
    debugger
    if (event.target.checked && this.mailDate) {
      this.joApplicationLists[index].checked = true;
      if (this.mailType == '1') {
        this.mailTypeList = 'written'
        this.joApplicationLists[index].writtenDate = this.mailDate;
        this.checkApplicationList.push(this.joApplicationLists[index])
      }
      if (this.mailType == '2') {
        this.mailTypeList = 'viva'
        this.joApplicationLists[index].vivaDate = this.mailDate;
        this.checkApplicationList.push(this.joApplicationLists[index])
      }
      if (this.mailType == '3') {
        this.mailTypeList = 'writtenViva'
        this.joApplicationLists[index].writtenDate = this.mailDate;
        this.joApplicationLists[index].vivaDate = this.mailDate;
        this.checkApplicationList.push(this.joApplicationLists[index])
      }
      if (this.mailType == '4') {
        this.mailTypeList = 'OfferLater'
        this.joApplicationLists[index].selectedDate = this.mailDate;
        this.checkApplicationList.push(this.joApplicationLists[index])
      }

    } else {
      this.joApplicationLists[index].checked = false;
      if (this.mailType == '1') {
        //this.mailTypeList=''
        this.joApplicationLists[index].writtenDate = null;
        this.checkApplicationList = this.checkApplicationList.filter(item => item.applicantOid !== this.joApplicationLists[index].applicantOid)
      }
      if (this.mailType == '2') {
        //this.mailTypeList=''
        this.joApplicationLists[index].vivaDate = null;
        this.checkApplicationList = this.checkApplicationList.filter(item => item.applicantOid !== this.joApplicationLists[index].applicantOid)
      }
      if (this.mailType == '3') {
        //this.mailTypeList=''
        this.joApplicationLists[index].writtenDate = null;
        this.joApplicationLists[index].vivaDate = null;
        this.checkApplicationList = this.checkApplicationList.filter(item => item.applicantOid !== this.joApplicationLists[index].applicantOid)
      }
      if (this.mailType == '4') {
        //this.mailTypeList=''
        this.joApplicationLists[index].selectedDate = null;
        this.checkApplicationList = this.checkApplicationList.filter(item => item.applicantOid !== this.joApplicationLists[index].applicantOid)
      }
    }
    this.isAllChecked = this.joApplicationLists.every(item => item.checked);
    console.log("push all data is  this.checkApplicationList", this.isAllChecked)
  }


  isAllChecked: boolean = false;
  setDateAllRow(event: any) {
    debugger
    this.isAllChecked = event.target.checked;

    if (this.isAllChecked && this.mailDate) {
      if (this.mailType == '1') {
        this.mailTypeList = 'written'
        this.joApplicationLists.forEach(item => {
          item.checked = true;
          item.writtenDate = this.mailDate;
        });
        this.checkApplicationList = [...this.joApplicationLists];
      }
      if (this.mailType == '2') {
        this.mailTypeList = 'viva'
        this.joApplicationLists.forEach(item => {
          item.checked = true;
          item.vivaDate = this.mailDate;
        });
        this.checkApplicationList = [...this.joApplicationLists];
      }
      if (this.mailType == '3') {
        this.mailTypeList = 'writtenViva'
        this.joApplicationLists.forEach(item => {
          item.checked = true;
          item.writtenDate = this.mailDate;
          item.vivaDate = this.mailDate;
        });
        this.checkApplicationList = [...this.joApplicationLists];
      }
      if (this.mailType == '4') {
        this.mailTypeList = 'OfferLater'
        this.joApplicationLists.forEach(item => {
          item.checked = true;
          item.selectedDate = this.mailDate;
        });
        this.checkApplicationList = [...this.joApplicationLists];

      }


    } else {
      if (this.mailType == '1') {
        this.mailTypeList = ''
        this.joApplicationLists.forEach(item => {
          item.checked = false;
          item.writtenDate = null;
        });
        this.checkApplicationList = [];
      }
      if (this.mailType == '2') {
        this.mailTypeList = ''
        this.joApplicationLists.forEach(item => {
          item.checked = false;
          item.vivaDate = null;
        });
        this.checkApplicationList = [];
      }
      if (this.mailType == '3') {
        this.mailTypeList = ''
        this.joApplicationLists.forEach(item => {
          item.checked = false;
          item.writtenDate = null;
          item.vivaDate = null;
        });
        this.checkApplicationList = [];
      }
      if (this.mailType == '4') {
        this.mailTypeList = ''
        this.joApplicationLists.forEach(item => {
          item.checked = false;
          item.selectedDate = null;
        });
        this.checkApplicationList = [];
      }
    }
    console.log(" this.checkApplicationList All Select", this.checkApplicationList)

  }

  SendAllMailx() {
    debugger
    if (!this.mailTypeList || !this.mailDate) {
      this.toastr.error("Mail Date & Mail Type are Required")
      return
    }
    if (this.mailTypeList == 'written' || this.mailTypeList == 'viva' || this.mailTypeList == 'writtenViva') {
      if (!this.examHour) {
        this.toastr.error("Exam hour is  Required");
        return;
      }
    }
    if (this.checkApplicationList.length < 1) {
      this.toastr.error("You Don't Select Any Data")
      return
    }
    const DataList = this.checkApplicationList
    console.log("mail send list is ", DataList)
    for (let i = 0; i < DataList.length; i++) {
      this.sendMail(DataList[i], this.mailTypeList, 0)
    }
  }



  // async SendAllMail(): Promise<void> {
  //   if (!this.mailTypeList || !this.mailDate) {
  //     this.toastr.error("Mail Date & Mail Type are required");
  //     return;
  //   }
  //   if (!this.checkApplicationList?.length) {
  //     this.toastr.error("You haven't selected any data");
  //     return;
  //   }
  //   await Promise.all(
  //     this.checkApplicationList.map(item => this.sendMail(item, this.mailTypeList, 0))
  //   );
  //   this.toastr.success("All mails sent successfully!");
  // }



  public _mailUrl: string = 'candidateinfo/SendServiceRequestMail';
  sendMail(details: any, type: string, index: number): void {
    debugger;
    if (type == 'written' || type == 'viva' || type == 'writtenViva') {
      if (!this.examHour) {
        this.toastr.error("Exam hour is  Required");
        return;
      }
    }
    const mailData: { [key: string]: keyof typeof details } = {
      written: 'writtenDate',
      viva: 'vivaDate',
      writtenViva: 'writtenDate',
      OfferLater: 'selectedDate'
    };

    const mailDate = details[mailData[type]];
    if (!mailDate || !this.mailType) {
      this.toastr.error("date and mail type required");
      return;
    }

    const param = {
      loggedUserId: this.userID,
      profileId: details.profileId,
      applicantId: details.applicantOid,
      jobId: details.jobId,
      name: details.name,
      toEmail: details.email,
      jobTitle: details.jobTitle,
      mailType: type,
      examDate: mailDate,
      examHour: this.examHour,
      CompanyName: details.companyName,
      department: details.departmentName,
      post: details.appliedPostName
    };

    const ModelsArray = [param];
    this.loading = true;
    this._dataservice.postMultipleModel(this._mailUrl, [ModelsArray])
      .subscribe({
        next: (response) => {
          this.res = response;
          console.log("this mail res is ", this.res)
          this.resmessage = this.res.message;
          if (this.res.resstate) {
            this.toastr.success(this.resmessage);
            window.location.reload();
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Failed to send mail");
        },
        complete: () => {
          this.loading = false;
        }
      });
  }




  SendAllMail() {
    debugger
    if (!this.mailTypeList || !this.mailDate) {
      this.toastr.error("Mail Date & Mail Type are Required")
      return
    }
    if (this.mailTypeList == 'written' || this.mailTypeList == 'viva' || this.mailTypeList == 'writtenViva') {
      if (!this.examHour) {
        this.toastr.error("Exam hour is  Required");
        return;
      }
    }
    if (this.checkApplicationList.length < 1) {
      this.toastr.error("You Don't Select Any Data")
      return
    }
    const ModelsArray: any[] = [];
    const DataList = this.checkApplicationList
    console.log("mail send list is ", DataList)
    DataList.forEach(item => {
      const param = {
        loggedUserId: this.userID,
        profileId: item.profileId,
        applicantId: item.applicantOid,
        jobId: item.jobId,
        name: item.name,
        toEmail: item.email,
        jobTitle: item.jobTitle,
        mailType: this.mailTypeList,
        examDate: this.mailDate,
        examHour: this.examHour,
        CompanyName: item.companyName,
        department: item.departmentName,
        post: item.appliedPostName
      };
      ModelsArray.push(param);
    });
    this.loading = true;
    this._dataservice.postMultipleModel(this._mailUrl, [ModelsArray])
      .subscribe({
        next: (response) => {
          this.res = response;
          console.log("this mail res is ", this.res)
          this.resmessage = this.res.message;
          if (this.res.resstate) {
            this.toastr.success(this.resmessage);
            window.location.reload();
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Failed to send mail");
        },
        complete: () => {
          this.loading = false;
        }
      });
  }




   public _msgUrl: string = 'candidateinfo/SendServiceRequestMessage';
  sendSingleMsg(details: any, type: string, index: number): void {
    debugger;
    if (type == 'written' || type == 'viva' || type == 'writtenViva') {
      if (!this.examHour) {
        this.toastr.error("Exam hour is  Required");
        return;
      }
    }
    const mailData: { [key: string]: keyof typeof details } = {
      written: 'writtenDate',
      viva: 'vivaDate',
      writtenViva: 'writtenDate',
      OfferLater: 'selectedDate'
    };

    const mailDate = details[mailData[type]];
    if (!mailDate || !this.mailType) {
      this.toastr.error("date and mail type required");
      return;
    }

    const param = {
      loggedUserId: this.userID,
      profileId: details.profileId,
      applicantId: details.applicantOid,
      jobId: details.jobId,
      name: details.name,
      toEmail: details.email,
      jobTitle: details.jobTitle,
      mailType: type,
      examDate: mailDate,
      examHour: this.examHour,
      CompanyName: details.companyName,
      department: details.departmentName,
      post: details.appliedPostName
    };

    const ModelsArray = [param];
    this.loading = true;
    this._dataservice.postMultipleModel(this._msgUrl, [ModelsArray])
      .subscribe({
        next: (response) => {
          this.res = response;
          console.log("this mail res is ", this.res)
          this.resmessage = this.res.message;
          if (this.res.resstate) {
            this.toastr.success(this.resmessage);
            window.location.reload();
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Failed to send mail");
        },
        complete: () => {
          this.loading = false;
        }
      });
  }




  sendAllMessage() {
    debugger
    if (!this.mailTypeList || !this.mailDate) {
      this.toastr.error("Mail Date & Mail Type are Required")
      return
    }
    if (this.mailTypeList == 'written' || this.mailTypeList == 'viva' || this.mailTypeList == 'writtenViva') {
      if (!this.examHour) {
        this.toastr.error("Exam hour is  Required");
        return;
      }
    }
    if (this.checkApplicationList.length < 1) {
      this.toastr.error("You Don't Select Any Data")
      return
    }
    const ModelsArray: any[] = [];
    const DataList = this.checkApplicationList
    console.log("mail send list is ", DataList)
    DataList.forEach(item => {
      const param = {
        loggedUserId: this.userID,
        profileId: item.profileId,
        applicantId: item.applicantOid,
        jobId: item.jobId,
        name: item.name,
        toEmail: item.email,
        jobTitle: item.jobTitle,
        mailType: this.mailTypeList,
        examDate: this.mailDate,
        examHour: this.examHour,
        CompanyName: item.companyName,
        department: item.departmentName,
        post: item.appliedPostName
      };
      ModelsArray.push(param);
    });
    this.loading = true;
    this._dataservice.postMultipleModel(this._msgUrl, [ModelsArray])
      .subscribe({
        next: (response) => {
          this.res = response;
          console.log("this mail res is ", this.res)
          this.resmessage = this.res.message;
          if (this.res.resstate) {
            this.toastr.success(this.resmessage);
            window.location.reload();
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error("Failed to send mail");
        },
        complete: () => {
          this.loading = false;
        }
      });
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





  getApplicantDetails(detl: any) {
    debugger
    this.openModalEntryDialog('Written');
    this.modalForm.patchValue({
      applicantOid: detl.applicantOid,
      circularOid: detl.jobId
    })


  }


  public _saveUrl: string = 'exam/saveupdatewrittenxm';
  modalSubmit(modalForm: any): void {
    let formValues = this.modalForm.value;
    console.log("form value", formValues)
    const param = {
      loggedUserId: this.loggedUserId,
      strId2: this.userID
    };

    const ModelsArray = [param, [formValues]];
    this._dataservice.postMultipleModel(this._saveUrl, ModelsArray)
      .subscribe(response => {
        this.res = response;
        console.log("message fo save", this.res)
        this.resmessage = this.res.resdata.message;
        if (this.res.resdata.resstate) {
          this.toastr.success('Save Successfully');
          //this._msg.success(this.resmessage);
          this.resetModal();
          this.getListByPage(this.pageSize)
          this._dialogRef.close(true);
          //close modal

        }
      }, error => {
        console.log(error);
      });
  }


  public wriitenXmOid:string;
  public _getWetnXmUrl: string = 'exam/getwrittenxmbyid';
  getWrittenExamByID(id: string) {
    debugger
    var list: Array<{ id: any, text: any }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getWetnXmUrl;
    var param = { strId: id };
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;

          var writtenXm = JSON.parse(this.res.resdata.writtenExam)
          var writtenXmDtl=writtenXm[0];
          this.wriitenXmOid=writtenXmDtl.oid
          console.log("wriiten exam result is ",writtenXmDtl)
          this.openModalEntryDialog('Written');
          this.modalForm.setValue({
            oid: writtenXmDtl.oid,
            applicantOid:null,
            circularOid:null,
            writtenMarks: writtenXmDtl.writtenMarks,
            outOfMarks: writtenXmDtl.outOfMarks,
            writtenDate: writtenXmDtl.writtenDate == null ? null : this.getNameToNumDate(writtenXmDtl.writtenDate)
             
          })
          console.log("this.modelForm",this.modalForm)



          // this.getApplicationList();
          // this.getListByPage(this.pageSize)

        }, error => {
          console.log(error);
        });
  }

















}



