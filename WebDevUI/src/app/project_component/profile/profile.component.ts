import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { DOCUMENT, formatDate, ViewportScroller } from '@angular/common';
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
import { it } from 'date-fns/locale';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DocUpload } from '../../theme/components/documentupload/documentupload';
//import { map } from 'jquery';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  // providers: [PagerService]
  providers: [Conversion]
})

export class ProfileComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
  @ViewChild(ReportViewer) _rptViewer: ReportViewer;
  public settings: Settings;
  @ViewChild('cmndoc', { static: false }) _doc: DocUpload;//uncomment

  public options: Options;
  private userID = sessionStorage.getItem("userID");
  public userRole = sessionStorage.getItem("rolename");
  public loggedUserId: string = sessionStorage.getItem("userID");
  public cmnEntity: any = {};
  public isToggleMaster: boolean = true;
  public res: any;
  public resmessage: string;
  public requirementForm: FormGroup;
  public pageSize: number = 10;
  public listJobPost: any;
  public itemListByPage: any = [];
  public jobPostList: any = [];
  public JobIdList: any = [];
  public appliedJobIds: string[] = [];
  public documentList: any = [];
  public ReferenceId: string = '';
  public skillList: any;
  public benifitList: any;
  public requirementList: any;
  public otherRequirementList: any;
  public responsibilityList: any;
  public masterList: any;
  public accQlfList: any;
  public wrkExpList: any;
  public proCirtificateList: any;
  public trainingList: any;
  public referenceList: any;
  public masterDiv: boolean = true;
  public detailDiv: boolean = false;
  public applyForm: boolean = false
  public downloadCvPath: any;
  public downloadNidPath: any;
  public downloadNidBackPath: any;
  public downloadTinPath: any;
  public updateOidEdit: any;
  public imageId: any;
  public signatureId: any;
  public cvId: any;
  public tinId: any;
  public NIDId: any;

  public docPhotoVPath: any;
  public docsignatureVPath: any;
  public docNidFntVPath: any;
  public docNidBckVPath: any;
  public docTinVPath: any;
  public docCVVPath: any;
  public jobSkill: any;



  qualificationType: string[] = ['SSC/Equivalent', 'HSC/Deploma', 'BSC', 'MSC', 'Other'];
  WorkOrderStatus: Array<{ value: string, label: string }> = [
    { value: '1', label: 'Work Order InComing' },
    { value: '0', label: 'Work Order  OutGoing' },
  ];
  genderList1: string[] = ['Male', 'Female', 'Other'];

  maritialStatusList1: string[] = ['Married', 'Unmarried', 'Widow', 'Widower'];
  religionList1: string[] = ['Islam', 'Hindu', 'Christianity', 'Buddhism', 'Other'];
  degreeList1: string[] = ['JSC', 'SSC', 'HSC', 'Diploma', 'Bachelor', 'Masters', 'Other'];
  bloodGroupList1: string[] = ['A+', 'B+', 'O+', "AB+", 'A-', 'B-', 'O-', "AB-"];


  relationList: string[] = ['Professional', 'Relative', 'Family', 'Relative', 'Other']
  sourceList: string[] = ['BD Jobs', 'LinkedIn', 'Facebook', 'City Group Website', 'Other']
  bloodGroupList: Array<{ id: string, text: string }> = [
    { id: '', text: 'Select Blood Group' }, { id: '1', text: 'A+' }, { id: '5', text: 'B+' }, { id: '7', text: 'O+' }, { id: '3', text: 'AB+' },
    { id: '2', text: 'A-' }, { id: '6', text: 'B-' }, { id: '8', text: 'O-' }, { id: '4', text: 'AB-' }
  ];
  genderList: Array<{ id: string, text: string }> = [{ id: 'M', text: 'Male' }, { id: 'F', text: 'Female' }, { id: 'O', text: 'Other' }];
  maritialStatusList: Array<{ id: string, text: string }> = [{ id: '2', text: 'Single' }, { id: '3', text: 'Married' }, { id: '4', text: 'Divorced' }, { id: '5', text: 'Widow' }];
  religionList: Array<{ id: string, text: string }> = [{ id: '1', text: 'Islam' }, { id: '2', text: 'Shonaton' }, { id: '3', text: 'Buddhist' }, { id: '4', text: 'Christian' }, { id: '5', text: 'Others' }];
  public degreeList: any = [];

  commonList: Array<{ id: string, text: string }> = [{ id: '1', text: 'Yes' }, { id: '2', text: 'No' }];




  image: FileList | null = null;
  signature: FileList | null = null;
  cv: FileList | null = null;
  nid: FileList | null = null;
  nidBack: FileList | null = null;
  tin: FileList | null = null;
  selectedFiles: FileList | null = null;
  binaryString: any
  public preDivList: any = [];
  public parDivList: any = [];
  public preDisList: any = [];
  public parDisList: any = [];
  public preThnList: any = [];
  public parThnList: any = [];
  public jobpostId: string;
  imageUrls: SafeUrl[] = [];
  signatureUrls: SafeUrl[] = [];
  public isEdit: boolean = false;
  public isShowmstr: any;
  public alApply: boolean = false;

  public fileList: any[] = [];
  public docId: any;
  public photoId: any;
  public sigId: any;
  public nidFnId: any;
  public nidBckId: any;
  public TinId: any;
  public CVId: any;




  constructor(public appSettings: AppSettings,
    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    private viewportScroller: ViewportScroller,
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private _conversion: Conversion,
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




  }


  getNameToNumDate(strDate: string) {
    debugger;
    var nDate = new Date(strDate);
    var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
    return Nowdate;

  }
  ngOnInit() {

    this.getUserDetailsById()
    this.getAppplicantProfileById();
    this.getList();
    this.createForm();
    this.addInitialAcademicQualifications();
    this.getAllDivision();
    this.getParAllDivision();
    //this.getListByPage(this.pageSize);
    this.GetJobIdList(this.loggedUserId)
    this.getParofileInfoByuserID(this.loggedUserId)
    this.getAllAcademicQlf();
    this.getAllTaxZone();
    this.getAllTaxCircle();
    this.getAllDistrict();
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

  public _acqlfUrl: string = 'ereqdropdown/getallaccqlf';
  getAllAcademicQlf() {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._acqlfUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          console.log("degree list is ===============", this.res)
          if (this.res.resdata.listAccQlf.length > 0) {
            var itemList = this.res.resdata.listAccQlf;
            itemList.forEach(item => {
              list.push({ id: item.oid, text: item.degree });
            });
            this.degreeList = list;
            console.log("degree list is ===============", this.degreeList)
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
            console.log("taxCicleList  list is ", this.taxCicleList)
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


  //GET DIVISION NAME
  public _divUrl: string = 'jobdropdown/getalldivision';
  getAllDivision() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._divUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllDiv.length > 0) {
            var itemList = this.res.resdata.listAllDiv;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.divName });
            });
            this.preDivList = list;
            console.log(" this.divisonList", this.preDivList)
          }
        }, error => {
          console.log(error);
        });
  }

  public _parDivUrl: string = 'jobdropdown/getalldivision';
  getParAllDivision() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._parDivUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          if (this.res.resdata.listAllDiv.length > 0) {
            var itemList = this.res.resdata.listAllDiv;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.divName });
            });
            this.parDivList = list;

          }
        }, error => {
          console.log(error);
        });
  }





  public _parDstrictUrl: string = 'jobdropdown/getalldistrictById';
  getDistrictById(divId: string) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._parDstrictUrl;
    if (divId) {
      var param = divId.replace(/^\D+/g, '');
      this._dataservice.getbyid(apiUrl, param)
        .subscribe(
          response => {
            this.res = response;
            if (this.res.resdata.listAllDis.length > 0) {
              var itemList = this.res.resdata.listAllDis;
              itemList.forEach(item => {
                list.push({ id: item.oId, text: item.disName });
              });
              this.preDisList = list;
              console.log("present district is------------- ", this.preDisList)
            }
          }, error => {
            console.log(error);
          });
    }
  }


  getParDistrictById(divId: string) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._parDstrictUrl;
    //var param = { id: divId };
    if (divId) {
      var param = divId.replace(/^\D+/g, '');
      this._dataservice.getbyid(apiUrl, param)
        .subscribe(
          response => {
            this.res = response;

            if (this.res.resdata.listAllDis.length > 0) {
              var itemList = this.res.resdata.listAllDis;
              itemList.forEach(item => {
                list.push({ id: item.oId, text: item.disName });
              });
              this.parDisList = list;
              //this.requirementForm.controls.parAddDistrict.setValue('DISTx16');

              console.log("district list is------------ ", this.parDisList)
            }
          }, error => {
            console.log(error);
          });
    }
  }





  public _getbyThnIdUrl: string = 'jobdropdown/getallthanaById';
  getThanaById(disId: string) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getbyThnIdUrl;
    var param = disId;
    this._dataservice.getbyid(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          console.log("Tahana is...........", this.res)
          if (this.res.resdata.listAllThna.length > 0) {
            var itemList = this.res.resdata.listAllThna;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.thanaName });
            });
            this.preThnList = list;
          }
        }, error => {
          console.log(error);
        });
  }







  getParThanaById(disId: string) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getbyThnIdUrl;
    //var param = { id: divId };
    var param = disId;
    this._dataservice.getbyid(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          console.log("Tahana is...........", this.res)
          if (this.res.resdata.listAllThna.length > 0) {
            var itemList = this.res.resdata.listAllThna;
            itemList.forEach(item => {
              list.push({ id: item.oId, text: item.thanaName });
            });
            this.parThnList = list;
          }
        }, error => {
          console.log(error);
        });
  }


  //SAME AS PRESENT ADDRESS
  sameAsPresentAdd(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    debugger
    if (isChecked) {
      this.requirementForm.controls.parAddDivision.setValue(this.requirementForm.controls.preAddDivision.value);
      this.getParDistrictById(this.requirementForm.controls.parAddDivision.value);
      setTimeout(() => {
        this.requirementForm.controls.parAddDistrict.setValue(this.requirementForm.controls.preAddDistrict.value);
      }, 100);

      this.getParThanaById(this.requirementForm.controls.preAddDistrict.value);
      setTimeout(() => {
        this.requirementForm.controls.parAddThana.setValue(this.requirementForm.controls.preAddThana.value);
      }, 200);


      this.requirementForm.controls.parAddVillage.setValue(this.requirementForm.controls.preAddVillage.value);
      this.requirementForm.controls.parAddPostOffice.setValue(this.requirementForm.controls.preAddPostOffice.value);
      this.requirementForm.controls.parAddDetai.setValue(this.requirementForm.controls.preAddDetai.value);
    }
    else {
      this.requirementForm.controls.parAddDivision.setValue(null);
      this.requirementForm.controls.parAddDistrict.setValue(null);
      this.requirementForm.controls.parAddThana.setValue(null);
      this.requirementForm.controls.parAddVillage.setValue(null);
      this.requirementForm.controls.parAddPostOffice.setValue(null);
      this.requirementForm.controls.parAddDetai.setValue(null);
    }
  }

  reset() {

  }

  createForm() {

    this.requirementForm = this.formBuilder.group({
      applicantId: null,
      jobPostId: null,
      jobTitle: new FormControl(null),
      company: new FormControl(null),
      department: new FormControl(null),
      appliedPost: new FormControl(null),
      mobileNumber: new FormControl(null),
      //campaign: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      fatherName: new FormControl(null, Validators.required),
      motherName: new FormControl(null, Validators.required),
      nidN: new FormControl(null, Validators.required),
      tin: new FormControl(null),
      dateOfBirth: new FormControl(null, Validators.required),
      birthPlace: new FormControl(null, Validators.required),
      relegion: new FormControl(null),
      bloodGroup: new FormControl(null),
      gender: new FormControl(null, Validators.required),
      maritialStatus: new FormControl(null, Validators.required),
      spouseName: null,
      email: new FormControl(null),

      isActive: null,
      preAddDivision: new FormControl(null, Validators.required),
      preAddDistrict: new FormControl(null, Validators.required),
      preAddThana: new FormControl(null, Validators.required),
      preAddPostOffice: new FormControl(null),
      preAddVillage: new FormControl(null),
      preAddDetai: new FormControl(null, Validators.required),

      parAddDivision: new FormControl(null, Validators.required),
      parAddDistrict: new FormControl(null, Validators.required),
      parAddThana: new FormControl(null, Validators.required),
      parAddPostOffice: new FormControl(null),
      parAddVillage: new FormControl(null),
      parAddDetai: new FormControl(null, Validators.required),

      expectedSelery: new FormControl(null),
      sourceFrom: new FormControl(null),




      //companyDeptPost: new FormControl(null),
      //companyDeptPostOpnDate: new FormControl(null),
      //companyDeptPostActvStatus: new FormControl(null),
      imagePath: null,
      signaturePath: null,
      cvPath: null,
      nidPath: null,
      tinPath: null,
      nidBackPath: null,
      BnName: new FormControl(null, Validators.required),//l
      BnFatherName: new FormControl(null, Validators.required),//l
      BnMotherName: new FormControl(null, Validators.required),//l
      BnSpouseName: null,//l


      taxDistrict: new FormControl(null),
      taxZone: new FormControl(null),
      taxCircule: new FormControl(null),

      academicQualifications: this.formBuilder.array([]),
      workExperiences: this.formBuilder.array([]),
      professionalCirtificate: this.formBuilder.array([]),
      training: this.formBuilder.array([]),
      reference: this.formBuilder.array([]),
      grandTotalDays: 0,
      anyRelative: new FormControl(null, Validators.required),
      describeRelative: null

    });

  }


  //for validation

  get nidN() {
    return this.requirementForm.get('nidN');
  }
  get birthPlace() {
    return this.requirementForm.get('birthPlace');
  }
  get dateOfBirth() {
    return this.requirementForm.get('dateOfBirth');
  }
  get name() {
    return this.requirementForm.get('name');
  }
  get BnName() {
    return this.requirementForm.get('BnName');
  }
  get fatherName() {
    return this.requirementForm.get('fatherName');
  }

  get BnFatherName() {
    return this.requirementForm.get('BnFatherName');
  }

  get motherName() {
    return this.requirementForm.get('motherName');
  }
  get BnMotherName() {
    return this.requirementForm.get('BnMotherName');
  }
  get maritialStatus() {
    return this.requirementForm.get('maritialStatus');
  }
  get gender() {
    return this.requirementForm.get('gender');
  }
  get preAddDivision() {
    return this.requirementForm.get('preAddDivision');
  }

  get preAddDistrict() {
    return this.requirementForm.get('preAddDistrict');
  }
  get preAddThana() {
    return this.requirementForm.get('preAddThana');
  }
  get preAddDetai() {
    return this.requirementForm.get('preAddDetai');
  }
  get parAddDivision() {
    return this.requirementForm.get('parAddDivision');
  }
  get parAddDistrict() {
    return this.requirementForm.get('parAddDistrict');
  }
  get parAddThana() {
    return this.requirementForm.get('parAddThana');
  }
  get parAddDetai() {
    return this.requirementForm.get('parAddDetai');

  }
  get anyRelative() {
    return this.requirementForm.get('anyRelative') as FormControl;
  }


  public showRelativeDes: string = '';
  getAnyRelative(event: any) {
    debugger
    this.showRelativeDes = event;

  }


  onFileChange(event: any): void {
    debugger
    this.image = event.target.files[0] || null;
    this.updateFileList();
  }

  OnSignatureChange(event: any): void {
    debugger
    this.signature = event.target.files[0] || null;
    this.updateFileList();
  }

  onTINChange(event: any): void {
    debugger
    this.tin = event.target.files[0] || null;
    this.updateFileList();
  }

  onNIDChange(event: any): void {
    debugger
    this.nid = event.target.files[0] || null;
    this.updateFileList();
  }

  onNIDBackChange(event: any): void {
    debugger
    this.nidBack = event.target.files[0] || null;
    this.updateFileList();
  }

  OnCvChange(event: any): void {
    debugger
    this.cv = event.target.files[0] || null;
    this.updateFileList();
  }


  updateFileList(): void {
    debugger
    this.fileList = [];
    if (this.image) this.fileList.push({ docId: this.photoId, fileType: 'photo', attachedfile: this.image });
    if (this.signature) this.fileList.push({ docId: this.sigId, fileType: 'signature', attachedfile: this.signature });
    if (this.nid) this.fileList.push({ docId: this.nidFnId, fileType: 'nidFnt', attachedfile: this.nid });
    if (this.nidBack) this.fileList.push({ docId: this.nidBckId, fileType: 'nidBck', attachedfile: this.nidBack });
    if (this.tin) this.fileList.push({ docId: this.TinId, fileType: 'tin', attachedfile: this.tin });
    if (this.cv) this.fileList.push({ docId: this.CVId, fileType: 'cv', attachedfile: this.cv });

    console.log("Final file list:", this.fileList);
  }



  public fileUrl: string = 'reqform/dbsinleuploadfiles';
  async uploadfileList(ReferenceId: string, fileList: any, type: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataservice.uploadAllFilez(fileList, this.fileUrl, ReferenceId, type).subscribe(
        response => {
          console.log("Upload response:", response);
          if (response.data && response.data.length > 0) {
            this.fileList = [];
            this.photoId = null, this.sigId = null, this.nidFnId = null, this.nidBckId = null, this.TinId = null, this.CVId = null
            //window.location.reload();
          }
          resolve();
        },
        error => {
          console.error(error);
          alert('Image upload failed. Please try again.');
          reject(error);
        }
      );
    });
  }


  //DELETE DOCOMENT WHEN REMOVE A ROW
  public _dltDocUrl: string = 'reqform/removedocument';
  removedocument(docOid, docSName) {
    var param = { strId: docOid, strId2: docSName };
    var apiUrl = this._dltDocUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
      }, error => {
        console.log(error);
      });
  }








  //Save form
  public ReferenceIds: any;
  public _saveUrl: string = 'reqform/saveupdate';
  // onSubmitFileForm(): void {
  //   debugger
  //   let formValues = { ...this.requirementForm.value };
  //   delete formValues.academicQualifications;
  //   delete formValues.workExperiences;
  //   delete formValues.professionalCirtificate;
  //   console.log("formValues", formValues)
  //   const reqform = formValues;
  //   const applicaOId = reqform.applicantId
  //   console.log("formValues reqform for update value", applicaOId)
  //   const acaQlf = this.academicQualifications.value;
  //   const wrkExp = this.workExperiences.value;
  //   const profCirtificate = this.professionalCirtificate.value;

  //   const param = {
  //     loggedUserId: this.userID,
  //     strId: this.requirementForm.controls.applicantId.value,
  //     strId2: this.userID,
  //     JobOid: ''
  //   };

  //   if ((!this.image || !this.signature || !this.nid || !this.nidBack) && !applicaOId) {
  //     this.toastr.error("Please Upload All Document")
  //     return;
  //   }
  //   const ModelsArray = [param, [reqform], acaQlf, wrkExp, profCirtificate];
  //   if (this.requirementForm.invalid) {
  //     this._msg.error("form is invalid");
  //     this.requirementForm.markAllAsTouched();
  //     this.academicQualifications.controls.forEach(control => control.markAllAsTouched());
  //     this.workExperiences.controls.forEach(control => control.markAllAsTouched());
  //     this.professionalCirtificate.controls.forEach(control => control.markAllAsTouched());
  //     return;
  //   } else {
  //     this._dataservice.postMultipleModel(this._saveUrl, ModelsArray)
  //       .subscribe(response => {
  //         this.res = response;
  //         console.log("this file return aftr save file", this.res)
  //         this.resmessage = this.res.resdata.message;
  //         if (this.res.resdata.resstate) {
  //           this.ReferenceIds = this.res.resdata.mstrId

  //           this.uploadfileList(this.ReferenceIds, this.fileList)
  //           this._msg.success(this.resmessage);
  //           window.location.reload()
  //         }
  //       }
  //         , error => {
  //           console.log(error);
  //         }
  //       );
  //   }
  // }

  async onSubmitFileForm(): Promise<void> {
    debugger;
    let formValues = { ...this.requirementForm.value };
    delete formValues.academicQualifications;
    delete formValues.workExperiences;
    delete formValues.professionalCirtificate;
    delete formValues.training;
    delete formValues.reference;

    const reqform = formValues;
    const applicaOId = reqform.applicantId;

    const acaQlf = this.academicQualifications.value;
    const wrkExp = this.workExperiences.value;
    const profCirtificate = this.professionalCirtificate.value;
    const training = this.training.value;
    const reference = this.reference.value;

    const param = {
      loggedUserId: this.userID,
      strId: this.requirementForm.controls.applicantId.value,
      strId2: this.userID,
      JobOid: ''
    };

    if ((!this.image || !this.signature || !this.nid || !this.nidBack) && !applicaOId) {
      this.toastr.error("Please Upload All Document");
      return;
    }
    const ModelsArray = [param, [reqform], acaQlf, wrkExp, profCirtificate, training, reference];
    if (this.requirementForm.invalid) {
      this._msg.error("form is invalid");
      this.requirementForm.markAllAsTouched();
      this.academicQualifications.controls.forEach(control => control.markAllAsTouched());
      this.workExperiences.controls.forEach(control => control.markAllAsTouched());
      this.professionalCirtificate.controls.forEach(control => control.markAllAsTouched());
      this.training.controls.forEach(control => control.markAllAsTouched());
      this.reference.controls.forEach(control => control.markAllAsTouched());
      return;
    }

    try {
      const response: any = await this._dataservice.postMultipleModel(this._saveUrl, ModelsArray).toPromise();
      this.res = response;
      this.resmessage = this.res.resdata.message;
      if (this.res.resdata.resstate) {
        this.ReferenceIds = this.res.resdata.mstrId;
        this._msg.success(this.resmessage);
        if (this.fileList.length > 0) {
          await this.uploadfileList(this.ReferenceIds, this.fileList, 'master');
        }
        if (this.accList.length > 0) {
          await this.uploadfileList(this.ReferenceIds, this.accList, 'academic');
        }
        if (this.experiencesList.length > 0) {
          await this.uploadfileList(this.ReferenceIds, this.experiencesList, 'experience');
        }
        if (this.profCirtificateList.length > 0) {
          await this.uploadfileList(this.ReferenceIds, this.profCirtificateList, 'certificate');
        }
        if (this.trangsList.length > 0) {
          await this.uploadfileList(this.ReferenceIds, this.trangsList, 'training');
        }


        window.location.reload();
      }
    } catch (error) {
      console.error("Submit error:", error);
      this._msg.error("Something went wrong, please try again.");
    }
  }



  //ACCADEMIC QULIFICATON PART START FROM HERE 

  get academicQualifications(): FormArray {
    return this.requirementForm.get('academicQualifications') as FormArray;
  }

  // Add initial academic qualifications
  addInitialAcademicQualifications() {
    for (let i = 0; i < 1; i++) {
      this.addAcademicQualification();
    }
  }

  // Add a new academic qualification FormGroup to the FormArray
  addAcademicQualification() {
    const accName = `acd_${this.academicQualifications.length + 1}`;
    const qualificationGroup = this.formBuilder.group({
      acQlfId: null,
      applicantId: null,
      degree: ['', Validators.required],
      //degreeType: ['', Validators.required],
      board: ['', Validators.required],
      institution: ['', Validators.required],
      major: ['', Validators.required],
      result: ['', Validators.required],
      passingyear: ['', [Validators.required, Validators.pattern("^[0-9]{4}$")]],
      acdqName: [accName],
      docOid: null,
      docVPath: null,
      isLastDegree: ['', Validators.required],
    });

    this.academicQualifications.push(qualificationGroup);
  }

  // Remove an academic qualification from the FormArray AND ALSO DELETE DOCUMENT
  removeAcademicQualification(index: number) {
    debugger
    if (this.academicQualifications.length > 1) {
      const confirmDelete = confirm("Are you sure you want to remove this item");
      if (!confirmDelete) {
        return;
      }
      var acqName = this.academicQualifications.at(index).value;
      this.removedocument(acqName.docOid, acqName.acdqName)
      this.academicQualifications.removeAt(index);
      console.log("acqName is the mail", acqName)
      this.removeAccFile(acqName)

    }
  }


  onLastDegreeChange(index: number) {
    this.academicQualifications.controls.forEach((ctrl, i) => {
      ctrl.get('isLastDegree')?.setValue(i === index ? '1' : '0');
    });
  }

  //REMOVE FILE SNAME FORM ROW
  removeAccFile(acqName: any) {
    this.accList = this.accList.filter(item => item.fileType !== acqName)
    console.log("this.fileList=>", this.accList);
  }

  //ADD ACADEMIC QULIFICAITON FILE
  public accList: any[] = [];
  onAccQlfDoc(event: any, index: number): void {
    debugger
    const file = event.target.files[0] || null;
    const currentRow = this.academicQualifications.at(index).value;
    if (file) {
      this.accList.push({ docId: currentRow.docOid, fileType: currentRow.acdqName, attachedfile: file })
      this.academicQualifications.at(index).get('document')?.setValue(file);
    } else {
      this.accList[index] = null;
      this.academicQualifications.at(index).get('document')?.setValue(null);
    }
  }
  //ACCADEMIC QULIFICATON PART END HERE 




  //TRAINING START FROM HERE 

  get training(): FormArray {
    return this.requirementForm.get('training') as FormArray;
  }


  // Add a new academic qualification FormGroup to the FormArray
  addTraining() {
    const accName = `trn_${this.training.length + 1}`;
    const TrainingGroup = this.formBuilder.group({
      trainingId: null,
      applicantId: null,
      courseName: [null, Validators.required],
      instution: [null, Validators.required],
      startDate: [null, Validators.required],
      achievementDate: [null, Validators.required],
      acdqName: [accName],
      docOid: null,
      docVPath: null
    });

    this.training.push(TrainingGroup);
  }

  // Remove an academic qualification from the FormArray AND ALSO DELETE DOCUMENT
  removeTraining(index: number) {
    debugger
    if (this.training) {
      const confirmDelete = confirm("Are you sure you want to remove this item");
      if (!confirmDelete) {
        return;
      }
      var acqName = this.training.at(index).value;
      this.removedocument(acqName.docOid, acqName.acdqName)
      this.training.removeAt(index);
      console.log("acqName is the mail", acqName)
      this.removetrainingFile(acqName)

    }
  }




  //REMOVE FILE SNAME FORM ROW
  removetrainingFile(acqName: any) {
    this.trangsList = this.trangsList.filter(item => item.fileType !== acqName)
    console.log("this.fileList=>", this.trainingList);
  }

  //ADD ACADEMIC QULIFICAITON FILE
  public trangsList: any[] = [];
  onTrainingDoc(event: any, index: number): void {
    debugger
    const file = event.target.files[0] || null;
    const currentRow = this.training.at(index).value;
    if (file) {
      this.trangsList.push({ docId: currentRow.docOid, fileType: currentRow.acdqName, attachedfile: file })
      this.training.at(index).get('document')?.setValue(file);
    } else {
      this.trangsList[index] = null;
      this.training.at(index).get('document')?.setValue(null);
    }
  }
  //TRAINING PART END HERE 






  get workExperiences(): FormArray {
    return this.requirementForm.get('workExperiences') as FormArray;
  }

  // Add new work experience form group
  addExperience() {
    debugger
    const accName = `exp_${this.workExperiences.length + 1}`;
    const experienceGroup = this.formBuilder.group({
      expId: null,
      applicantId: null,
      companyName: [null, Validators.required],
      companyType: [null, Validators.required],
      salary: [null, Validators.required],
      priodFromDate: [null, Validators.required],
      priodToDate: null,
      jobDescription: [null, Validators.required],
      department: [null, Validators.required],
      designation: [null, Validators.required],
      jobLocation: [null],
      isRunning: [null],
      acdqName: [accName],
      docOid: null,
      docVPath: null,
      totalDays: null,
      isLastExperience: ['', Validators.required],
    });

    this.workExperiences.push(experienceGroup);
  }

  // Remove work experience by index

  removeExperience(index: number) {
    debugger
    if (this.workExperiences) {
      const confirmDelete = confirm("Are you sure you want to remove this item");
      if (!confirmDelete) {
        return;
      }
      var acqName = this.workExperiences.at(index).value;
      this.removedocument(acqName.docOid, acqName.acdqName)
      this.workExperiences.removeAt(index);
      this.updateGrandTotalDays();
      console.log("acqName is the mail", acqName)
      this.removeExperienceFile(acqName)

    }
  }

  //REMOVE FILE SNAME FORM ROW
  removeExperienceFile(acqName: any) {
    this.experiencesList = this.experiencesList.filter(item => item.fileType !== acqName)
    console.log("this.fileList=>", this.experiencesList);
  }

  //ADD ACADEMIC QULIFICAITON FILE
  public experiencesList: any[] = [];
  onExperienceDoc(event: any, index: number): void {
    debugger
    const file = event.target.files[0] || null;
    const currentRow = this.workExperiences.at(index).value;
    if (file) {
      this.experiencesList.push({ docId: currentRow.docOid, fileType: currentRow.acdqName, attachedfile: file })
      this.workExperiences.at(index).get('document')?.setValue(file);
    } else {
      this.experiencesList[index] = null;
      this.workExperiences.at(index).get('document')?.setValue(null);
    }
  }




  onLastExperience(index: number) {
    this.workExperiences.controls.forEach((ctrl, i) => {
      ctrl.get('isLastExperience')?.setValue(i === index ? '1' : '0');
    });

  }






  // Add Proffesional Cirtificate
  get professionalCirtificate(): FormArray {
    return this.requirementForm.get('professionalCirtificate') as FormArray;
  }
  addProfCirtificate() {
    const accName = `pcr_${this.professionalCirtificate.length + 1}`;
    const profCirtificateGroup = this.formBuilder.group({
      pCirtificateId: null,
      applicantId: null,
      courseName: [null, Validators.required],
      instution: [null, Validators.required],
      startDate: [null, Validators.required],
      achievementDate: [null, Validators.required],//extra bottom 
      acdqName: [accName],
      docOid: null,
      docVPath: null
    });
    this.professionalCirtificate.push(profCirtificateGroup);
  }

  // Remove work experience by index
  removeProfCirtificate(index: number) {
    debugger
    if (this.professionalCirtificate) {
      const confirmDelete = confirm("Are you sure you want to remove this item");
      if (!confirmDelete) {
        return;
      }
      var acqName = this.professionalCirtificate.at(index).value;
      this.removedocument(acqName.docOid, acqName.acdqName)
      this.professionalCirtificate.removeAt(index);
      console.log("acqName is the mail", acqName)
      this.removeProfCirtificateFile(acqName)

    }
  }


  //REMOVE FILE SNAME FORM ROW
  removeProfCirtificateFile(acqName: any) {
    this.profCirtificateList = this.profCirtificateList.filter(item => item.fileType !== acqName)
    console.log("this.fileList=>", this.profCirtificateList);
  }

  //ADD ACADEMIC QULIFICAITON FILE
  public profCirtificateList: any[] = [];
  onProfCirDoc(event: any, index: number): void {
    debugger
    const file = event.target.files[0] || null;
    const currentRow = this.professionalCirtificate.at(index).value;
    if (file) {
      this.profCirtificateList.push({ docId: currentRow.docOid, fileType: currentRow.acdqName, attachedfile: file })
      this.professionalCirtificate.at(index).get('document')?.setValue(file);
    } else {
      this.profCirtificateList[index] = null;
      this.professionalCirtificate.at(index).get('document')?.setValue(null);
    }
  }



  get reference(): FormArray {
    return this.requirementForm.get('reference') as FormArray;
  }
  addReference() {
    const referenceGroup = this.formBuilder.group({
      referenceId: null,
      applicantId: null,
      Name: [null, Validators.required],
      Organization: [null, Validators.required],
      designation: [null, Validators.required],
      email: [null, Validators.required],
      mobile: [null, Validators.required],
      relation: null,
      fatherName: null,
      address: null

    });

    this.reference.push(referenceGroup);
  }

  // Remove work experience by index
  removeReference(index: number) {
    this.reference.removeAt(index);
  }




  getFromDate(event: any, index: number) {
    const experience = this.workExperiences.at(index);
    experience.get('priodFromDate')?.setValue(event.target.value);

    this.calculateTotalDays(index);
  }

  getToDate(event: any, index: number) {
    const experience = this.workExperiences.at(index);
    experience.get('priodToDate')?.setValue(event.target.value);

    this.calculateTotalDays(index);
  }

  // 🔹 Calculate total days
  calculateTotalDays(index: number) {
    const experience = this.workExperiences.at(index);
    const fromDateStr = experience.get('priodFromDate')?.value;
    let toDateStr = experience.get('priodToDate')?.value;
    if (!fromDateStr) {
      experience.get('totalDays')?.setValue(0);
      this.updateGrandTotalDays();
      return;
    }
    const fromDate = new Date(fromDateStr);
    if (experience.get('isRunning')?.value === 'Continuing') {
      toDateStr = new Date().toISOString().split('T')[0];
    }
    if (toDateStr) {
      const toDate = new Date(toDateStr);
      const diffInMs = toDate.getTime() - fromDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      experience.get('totalDays')?.setValue(diffInDays >= 0 ? diffInDays + 1 : 0);
    }
    this.updateGrandTotalDays();
  }

  updateGrandTotalDays() {
    let total = 0;
    this.workExperiences.controls.forEach(exp => {
      total += exp.get('totalDays')?.value || 0;
    });
    console.log("grand total days is ", total)
    this.requirementForm.get('grandTotalDays')?.setValue(total);
  }









  public _getbyListIdUrl: string = 'jobpost/getbylist';
  getList() {
    var param = { strid: this.userID };
    var apiUrl = this._getbyListIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        this.jobPostList = JSON.parse(this.res.resdata.listJobPost);
        console.log("this.Total data LLLLLLLLLLLLLLLLLLLLLLLLLLL ", this.jobPostList)

      }, error => {
        console.log(error);
      });
  }

  //CHECK USERID AND JOBPOST ID 

  public masterListDet: any;
  public _getJobIdList: string = 'reqform/getJobIdByMail';
  GetJobIdList(id) {
    debugger;
    var param = { strId: id };
    var apiUrl = this._getJobIdList
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        if (this.res.resdata.jobIDList) {
          this.JobIdList = JSON.parse(this.res.resdata.jobIDList)
          this.appliedJobIds = this.JobIdList.map(item => item.jObId);

        }

      }, error => {
        console.log(error);
      });
  }


  backToFirst() {
    this.masterDiv = true;
    this.applyForm = false;
  }



  public masterListDetails: any;
  public _getbyIdUrl: string = 'jobpost/getbyid';
  showDetails(modelEvnt, isShow) {
    this.isShowmstr = isShow;
    debugger;
    console.log("modelEvnt", modelEvnt)
    var param = { strId: modelEvnt.jobOid, strId2: modelEvnt.jobOid };
    var apiUrl = this._getbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.masterDiv = false;
        this.res = response;
        this.detailDiv = true;
        this.masterList = JSON.parse(this.res.resdata.jobPostMaster)
        this.masterListDetails = this.masterList[0];
        console.log("this.Total test test -------------------", (this.masterListDetails))
        this.skillList = JSON.parse(this.res.resdata.jobSkill)
        this.benifitList = JSON.parse(this.res.resdata.jobBenefit)
        this.requirementList = JSON.parse(this.res.resdata.jobRequirement)
        this.otherRequirementList = JSON.parse(this.res.resdata.jobOtherRequirement)
        this.responsibilityList = JSON.parse(this.res.resdata.jobResponsibility)
        console.log("this.Total data -------------------", (this.masterList))
        console.log("this.Total skillList ", (this.skillList))
        console.log("this.Total benifitList ", (this.benifitList))
        console.log("this.Total requirementList ", (this.requirementList))
        console.log("this.Total otherRequirementList ", (this.otherRequirementList))
        console.log("this.Total responsibilityList ", (this.responsibilityList))




        console.log("this.this.jobPostForm", this.requirementForm)

      }, error => {
        console.log(error);
      });
  }




  showHtml() {

  }


  ApplyForm(jobPostDetails: any) {
    debugger
    this.getUserDetailsById()
    this.masterDiv = false;
    this.detailDiv = false;
    this.applyForm = true;

    this.requirementForm.controls.jobTitle.setValue(jobPostDetails.jobTitle)
    this.requirementForm.controls.company.setValue(jobPostDetails.company)
    this.requirementForm.controls.department.setValue(jobPostDetails.department)
    this.requirementForm.controls.appliedPost.setValue(jobPostDetails.post)
    this.requirementForm.controls.jobPostId.setValue(jobPostDetails.jbPostId)

  }




  public _getbyUserDetailsUrl: string = 'reqform/getuserdetialsbyid';
  getUserDetailsById() {
    debugger
    var param = { strId: this.loggedUserId };
    var apiUrl = this._getbyUserDetailsUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = JSON.parse(response.resdata.userDetails);
        console.log(" this.res    this.resc  this.res ", this.res)
        this.requirementForm.controls.email.setValue(this.res[0].email)
        this.requirementForm.controls.name.setValue(this.res[0].fullName)
        this.requirementForm.controls.mobileNumber.setValue(this.res[0].mobileNumber)
      }, error => {
        console.log(error);
      });
  }

  //GET APPLICANT BY EMAIL
  public applicantdetail: string
  public _getbyApplicantUrl: string = 'reqform/getapplicantprofileid';
  getAppplicantProfileById() {
    debugger
    var param = { strId: this.loggedUserId };
    var apiUrl = this._getbyApplicantUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        if (response?.resdata?.userDetails) {
          this.res = JSON.parse(response.resdata.userDetails);
          this.applicantdetail = this.res;
        }
        console.log(" this.applicantdetail", this.applicantdetail)
      }, error => {
        console.log(error);
      });
  }




  public responseTag: string = 'listApplication';
  public applicationLists: any = [];
  public _listByPageUrl: string = 'reqform/getbypagesbyid/';
  getListByPage(pageSize) {

    debugger
    setTimeout(() => {
      this._pg.getListByPage(1, true, pageSize, '');
      setTimeout(() => {
      }, 300);
    }, 0);
  }
  sendToList(ev) {
    this.applicationLists = ev;
    console.log(" this.applicationLists", this.applicationLists)
  }




  public d: any;
  public _getcanDeIdUrl: string = 'reqform/getcandidatedetailsbyid';
  getcandidateDetail(modelEvnt) {
    debugger;
    console.log("modelEvnt", modelEvnt)
    var param = { strId: modelEvnt };
    var apiUrl = this._getcanDeIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;

        console.log("details data is ", this.res)
        this.masterList = JSON.parse(this.res.resdata.regApplicantDetails)
        this.masterListDetails = this.masterList[0];
        if (this.res.resdata.accQlfDetail) {
          this.accQlfList = JSON.parse(this.res.resdata.accQlfDetail)
        }
        if (this.res.resdata.wrkExperience) {
          this.wrkExpList = JSON.parse(this.res.resdata.wrkExperience)
        }
        if (this.res.resdata.profCertificate) {
          this.proCirtificateList = JSON.parse(this.res.resdata.profCertificate)
        }
        console.log("Detalis master ", this.masterList)
        console.log("Detalis accQlfList", this.accQlfList)
        console.log("Detalis wrkExpList", this.wrkExpList)
        console.log("Detalis proCirtificateList", this.proCirtificateList)

        this.loadImages(this.masterListDetails.imageNo)
        this.loadImages(this.masterListDetails.CvNo)

      }, error => {
        console.log(error);
      });
  }

  public _imgUrl: string = 'reqform/getImage';

  loadImages(imgPath: string) {
    debugger
    this.imageUrls = [];
    this._dataservice.getImage(imgPath, this._imgUrl).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        console.error('Failed to load url url:', url);
        this.imageUrls.push(this.sanitizer.bypassSecurityTrustUrl(url));
      },
      (error) => {
        console.error('Failed to load image:', error);
      }
    );
  }

  loadSignature(imgPath: string) {
    debugger
    this.signatureUrls = [];
    this._dataservice.getImage(imgPath, this._imgUrl).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        this.signatureUrls.push(this.sanitizer.bypassSecurityTrustUrl(url));
      },
      (error) => {
        console.error('Failed to load image:', error);
      }
    );
  }


  //download file
  //DOWNLOAD FILE FROM PATH

  //DOWNLOAD NID

  //DOWNLOAD FILE FROM PATH





  public _getUserInUrl: string = 'ereqdropdown/getProfileInfoById';
  getParofileInfoByuserID(id: string) {
    debugger
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    var apiUrl = this._getUserInUrl;
    var param = id;
    this._dataservice.getbyid(apiUrl, param)
      .subscribe(
        response => {
          this.res = response;
          if (this.res) {
            console.log("this.res is detils ny id  ssssss before profile oid", this.res)
            var oid = this.res.resdata.listuserInfo[0].oid
            this.edit({ model: { oid: oid } });

          }
          console.log("this.res is detils ny id  ssssss", this.res)

        }, error => {
          console.log(error);
        });
  }





  //EDIT UPDATE DATA

  public _geteditUrl: string = 'reqform/getcandidatedetailsbyid';
  edit(modelEvnt) {
    debugger
    this.isEdit = true;
    this.alApply = true
    var param = { strId: modelEvnt.model.oid };
    var apiUrl = this._geteditUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        if (this.res.resdata.regApplicantMaster) {
          var mstrData = JSON.parse(this.res.resdata.regApplicantMaster)
          var msrFrm = mstrData[0];
          this.docPhotoVPath = msrFrm.docPhotoVPath;
          this.docsignatureVPath = msrFrm.docSignatureVPath;
          this.docNidFntVPath = msrFrm.docNidFntVPath;
          this.docNidBckVPath = msrFrm.docNidBckVPath;
          this.docTinVPath = msrFrm.docTinVPath;
          this.docCVVPath = msrFrm.docCvVPath;

          this.photoId = msrFrm.docPhotoID
          this.sigId = msrFrm.docSignatureID
          this.nidFnId = msrFrm.docNidFntID
          this.nidBckId = msrFrm.docNidBckID
          this.TinId = msrFrm.docTinID
          this.CVId = msrFrm.docCvID;
          this.updateOidEdit = msrFrm.candidateOid

          this.downloadCvPath = msrFrm.CvNo;
          this.downloadNidPath = msrFrm.NidNo
          this.downloadNidBackPath = msrFrm.NidBackNo
          this.downloadTinPath = msrFrm.tinNo
        }
        if (this.res.resdata.accQlfDetail) {
          this.accQlfList = JSON.parse(this.res.resdata.accQlfDetail)
          this.updateacademicQualifications(this.accQlfList)
        }
        if (this.res.resdata.wrkExperience) {
          this.wrkExpList = JSON.parse(this.res.resdata.wrkExperience)
          this.updateWorkExperiece(this.wrkExpList)
        }
        if (this.res.resdata.profCertificate) {
          this.proCirtificateList = JSON.parse(this.res.resdata.profCertificate)
          this.updateProfCirtificate(this.proCirtificateList)
        }
        if (this.res.resdata.training) {
          this.trainingList = JSON.parse(this.res.resdata.training)
          this.updateTraining(this.trainingList)
        }
        if (this.res.resdata.reference) {
          this.referenceList = JSON.parse(this.res.resdata.reference)
          this.updateReference(this.referenceList)
        }

        this.getDistrictById(msrFrm.pre_add_division)
        this.getParDistrictById(msrFrm.par_add_division)

        console.log("master result is-000-------------------------- ", msrFrm)
        // setTimeout(() => {  
        this.requirementForm.setValue({
          applicantId: msrFrm.candidateOid,
          jobPostId: msrFrm.jobid,
          jobTitle: msrFrm.job_title,
          company: msrFrm.company_name,
          department: msrFrm.department,
          appliedPost: msrFrm.post,
          mobileNumber: msrFrm.mobile_number,
          name: msrFrm.name,
          fatherName: msrFrm.father_name,
          motherName: msrFrm.mother_name,
          nidN: msrFrm.nid,
          tin: msrFrm.tin,
          dateOfBirth: this.getNameToNumDate(msrFrm.date_of_birth),
          birthPlace: msrFrm.birth_place,
          relegion: msrFrm.religion,
          bloodGroup: msrFrm.blood_group,
          gender: msrFrm.gender,
          maritialStatus: msrFrm.marital_status,
          spouseName: msrFrm.spouse_name,
          email: msrFrm.email,

          isActive: null,
          preAddDivision: msrFrm.pre_add_division,
          preAddDistrict: msrFrm.per_add_district,
          preAddThana: msrFrm.pre_add_thana,
          preAddPostOffice: msrFrm.pre_add_post_office,
          preAddVillage: msrFrm.pre_add_village,
          preAddDetai: msrFrm.pre_add_detail,

          parAddDivision: msrFrm.par_add_division,
          parAddDistrict: msrFrm.par_add_district,
          parAddThana: msrFrm.par_add_thana,
          parAddPostOffice: msrFrm.par_add_post_office,
          parAddVillage: msrFrm.par_add_village,
          parAddDetai: msrFrm.par_add_detail,

          expectedSelery: msrFrm.expected_selery,
          sourceFrom: msrFrm.sourceFrom,

          imagePath: msrFrm.imageNo,
          signaturePath: msrFrm.signatureNo,
          cvPath: msrFrm.CvNo,
          nidPath: msrFrm.NidNo,
          tinPath: msrFrm.tinNo,
          nidBackPath: msrFrm.NidBackNo,

          BnName: msrFrm.BnName,
          BnFatherName: msrFrm.BnFatherName,
          BnMotherName: msrFrm.BnMotherName,
          BnSpouseName: msrFrm.BnSpouseName,
          grandTotalDays: msrFrm.grandTotalDays,
          anyRelative: msrFrm.anyRelative,
          describeRelative: msrFrm.describeRelative,

          taxDistrict: msrFrm.taxDistrict,
          taxZone: msrFrm.taxZone,
          taxCircule: msrFrm.taxCircule,


          academicQualifications: this.formBuilder.array([]),
          workExperiences: this.formBuilder.array([]),
          professionalCirtificate: this.formBuilder.array([]),
          training: this.formBuilder.array([]),
          reference: this.formBuilder.array([]),
        })
        // }, 8000);

      }, error => {
        console.log(error);
      });
  }



  updateacademicQualifications(acQllf: any[]) {
    this.clearacademicQualifications();
    debugger;
    acQllf.forEach(qlf => {
      var academicQlfGroup = this.formBuilder.group({
        acQlfId: qlf.accQlfOid,
        // degree: qlf.degree,
        degree: [qlf.degree, Validators.required],
        //degreeType:[qlf.degreeType,Validators.required],
        board: [qlf.board, Validators.required],
        institution: [qlf.institution, Validators.required],
        major: [qlf.major, Validators.required],
        result: [qlf.result, Validators.required],
        passingyear: [qlf.passingyear, Validators.required],
        applicantId: [qlf.applicant_oid, Validators.required],
        acdqName: [qlf.accQlfDocName],
        docOid: [qlf.docOid],
        docVPath: [qlf.docVPath],
        isLastDegree: [qlf.isLastDegree],
      });
      this.academicQualifications.push(academicQlfGroup);
      console.log("this.academicQualifications For Update", this.academicQualifications)
    });
  }
  clearacademicQualifications() {
    while (this.academicQualifications.length !== 0) {
      this.academicQualifications.removeAt(0);
    }
  }


  updateWorkExperiece(wrkExp: any[]) {
    this.clearWrkExp();
    debugger;
    wrkExp.forEach(exp => {
      var wrkExpGroup = this.formBuilder.group({
        expId: exp.experienceOid,
        applicantId: exp.applicant_oid,
        companyName: [exp.company_name, Validators.required],
        companyType: [exp.company_type, Validators.required],
        salary: [exp.salary, Validators.required],
        priodFromDate: [this.convertOracleDateToInput(exp.priod_from_date)],// exp.priod_from_date,
        priodToDate: [this.convertOracleDateToInput(exp.priod_to_date)],// exp.priod_to_date,
        jobDescription: [exp.job_description, Validators.required],
        department: [exp.department, Validators.required],
        designation: [exp.designation, Validators.required],
        jobLocation: exp.location,
        isRunning: [exp.isRunning === 'Continuing' ? 'Continuing' : null],//add extra heere 
        acdqName: [exp.accQlfDocName],
        docOid: [exp.docOid],
        docVPath: [exp.docVPath],
        totalDays: [exp.totalDays],
        isLastExperience: [exp.isLastExperience]
      });
      this.workExperiences.push(wrkExpGroup);
    });
  }
  clearWrkExp() {
    while (this.workExperiences.length !== 0) {
      this.workExperiences.removeAt(0);
    }
  }

  updateProfCirtificate(prfCirtificate: any[]) {
    this.clearPrfCrtificate();
    debugger;
    prfCirtificate.forEach(cirtificate => {
      var cirtificateGroup = this.formBuilder.group({
        pCirtificateId: cirtificate.ProfCirtificateOid,
        applicantId: cirtificate.applicant_oid,
        courseName: [cirtificate.course_name, Validators.required],
        instution: [cirtificate.institution, Validators.required],
        //duration:'',// [cirtificate.duration,Validators.required],
        startDate: [this.convertOracleDateToInput(cirtificate.start_date)],// [cirtificate.start_date,Validators.required],
        achievementDate: [cirtificate.achievment_date, Validators.required],
        acdqName: [cirtificate.accQlfDocName],
        docOid: [cirtificate.docOid],
        docVPath: [cirtificate.docVPath]
      });
      this.professionalCirtificate.push(cirtificateGroup);
    });
  }
  clearPrfCrtificate() {
    while (this.professionalCirtificate.length !== 0) {
      this.professionalCirtificate.removeAt(0);
    }
  }


  updateTraining(train: any[]) {
    this.clearTraning();
    debugger;
    train.forEach(trn => {
      var trainingGroup = this.formBuilder.group({
        trainingId: trn.trainingOid,
        applicantId: trn.applicant_oid,
        courseName: [trn.training_name, Validators.required],
        instution: [trn.institution, Validators.required],
        startDate: [trn.start_date, Validators.required],
        achievementDate: [trn.achievment_date, Validators.required],
        acdqName: [trn.accQlfDocName],
        docOid: [trn.docOid],
        docVPath: [trn.docVPath]
      });
      this.training.push(trainingGroup);
      console.log("this.training For Update", this.training)
    });
  }
  clearTraning() {
    while (this.training.length !== 0) {
      this.training.removeAt(0);
    }
  }


  updateReference(refrnc: any[]) {
    this.clearReference();
    debugger;
    refrnc.forEach(ref => {
      var referenceGroup = this.formBuilder.group({
        referenceId: ref.referenceOid,
        applicantId: ref.applicant_oid,
        Name: [ref.reference_name, Validators.required],
        Organization: [ref.orgazination, Validators.required],
        designation: [ref.designation, Validators.required],
        email: [ref.email, Validators.required],
        mobile: [ref.mobile, Validators.required],
        relation: ref.relation,
        fatherName: ref.fatherNAme,
        address: ref.address
      });
      this.reference.push(referenceGroup);
    });
  }
  clearReference() {
    while (this.reference.length !== 0) {
      this.reference.removeAt(0);
    }
  }







  isJobRunning(event: Event, index: number) {
    debugger
    const isChecked = (event.target as HTMLInputElement).checked;
    const experience = this.workExperiences.at(index);


    if (isChecked) {
      experience.get('isRunning')?.setValue('Continuing');
      experience.get('priodToDate')?.setValue(null);
      experience.get('priodToDate')?.disable();
    } else {
      experience.get('isRunning')?.setValue(null);
      experience.get('priodToDate')?.enable();
    }

    this.calculateTotalDays(index);

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









}