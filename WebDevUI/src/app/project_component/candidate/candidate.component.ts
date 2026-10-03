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

declare var $: any;

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
  //providers: [PagerService],
  providers: [Conversion]
})

export class candidateComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
  @ViewChild(ReportViewer) _rptViewer: ReportViewer;
  public settings: Settings;
  public options: Options;
  private userID = sessionStorage.getItem("userID");
  public loggedUserId: string = sessionStorage.getItem("userID");
  public RoleUser: string
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
  candidateForm: FormGroup;
  public applicantFormList: any;
  public masterList: any;
  public accQlfList: any;
  public wrkExpList: any;
  public proCirtificateList: any;
  public jobTitle: any;
  public showModal: boolean = false;
  public selectedOid: string = '';
  public inputField: string = '';
  public commentText: string = '';
  public Role: string;
  commentRows = 6;
  commentCols = 50;

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
    @Inject(DOCUMENT) private document: any
  ) {

    //this.options = this._pathValidation.ngSelect2Option();
    this.settings = this.appSettings.settings;
    this._pathValidation.validate(this.document.location);
    this.cmnEntity = this._pathValidation.rowEntities();
    console.log("this.cmnEntity", this.cmnEntity)



  }




  ngOnInit() {
    this.getUserInfoByuserID(this.loggedUserId)
    this.getCompanyList();
    this.getDepartmentList();
    this.getPostList();
    this.createForm();
    this.getJobPostList()
    this.updateTextareaSize();
    window.addEventListener('resize', this.updateTextareaSize.bind(this));
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
             this.getListByPage(this.pageSize)
          this.getCandidateList();


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
              list.push({ id: item.jobID, text: item.jobTitle + "-" + "Closing(" + formattedDate + ")" });
            });
            this.jobPostList = list;
            console.log("total job ttile is ", this.jobPostList)

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



  public _canListUrl: string = 'candidateinfo/getbypages';

  getCandidateList() {
    this.applicantFormList = [];
    debugger
    this.jobTitle = this.candidateForm.get('jobTitle')?.value;
    this.company = this.candidateForm.get('company')?.value;
    this.department = this.candidateForm.get('department')?.value;
    this.post = this.candidateForm.get('post')?.value;
    this.sDate = this.candidateForm.get('startDate')?.value;
    this.eDate = this.candidateForm.get('endDate')?.value;
    console.log("company department post", this.company, this.department, this.post, this.sDate, this.eDate)
    //this.getListByPage(this.pageSize)
    let model = [{
      JobTitle: this.jobTitle || null,
      Company: this.company || null,
      Department: this.department || null,
      Post: this.post || null,
      Role: this.RoleUser,
      UserID: this.loggedUserId
      //StartDate:this.sDate,
      //EndDate:this.eDate
    }];

    console.log("Parameter Is", model)
    var apiUrl = this._canListUrl;
    this._dataservice.getWithMultipleModel(apiUrl, model)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listJobPost.length > 0) {
            const list = JSON.parse(this.res.resdata.listJobPost);
            this.applicantFormList = list

            console.log(" this.departmentList--", this.applicantFormList)
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



  public responseTag: string = 'listProfile';
  public jobProfileLists: any = [];
  public _listByPageUrl: string = 'candidateinfo/getprofilelistbypages';
  getListByPage(pageSize) {
    debugger
    setTimeout(() => {
      this._pg.getListByPage(1, true, pageSize, '');
      setTimeout(() => {
      }, 300);
    }, 0);
  }
  sendToList(ev) {
    this.jobProfileLists = ev;
    console.log("this.jobPostLists==>", this.jobProfileLists)
  }







  reset() {

  }

  docPhotoVPath: any;
  docsignatureVPath: any;
  docNidFntVPath: any;
  docNidBckVPath: any;
  docTinVPath: any;
  docCVVPath: any;

  //GET DATA BY ID FOR REPORT 
  public _getcanDeIdUrl: string = 'reqform/getcandidatedetailsbyid';
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
        if (this.masterList) {
          this.docCVVPath = this.masterList[0].docCvVPath
        }
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
        console.log("Detalis master==> ", this.masterList)
        console.log("Detalis accQlfList", this.accQlfList)
        console.log("Detalis wrkExpList", this.wrkExpList)
        console.log("Detalis proCirtificateList", this.proCirtificateList)

        //this.loadImages( this.masterListDetails.imagePath)
        //this.loadImages( this.masterListDetails.signaturePath)

      }, error => {
        console.log(error);
      });
  }





  public _getReportUrl: string = 'reqform/getregularreport';
  loadReports(model) {
    debugger
    var repFile = 'rptApplicantProfileCV' + '.rdlc';
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











}