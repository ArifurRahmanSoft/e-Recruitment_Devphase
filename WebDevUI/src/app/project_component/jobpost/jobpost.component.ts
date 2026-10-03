import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
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

declare var $: any;

@Component({
  selector: 'app-jobpost',
  templateUrl: './jobpost.component.html',
  styleUrls: ['./jobpost.component.scss'],
  providers: [PagerService]
  //providers: [Conversion]
})

export class JobPostComponent implements OnInit {
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
  public proCirtificateList: any;
  genderList: string[] = ['Male', 'Female', 'Both'];
   recruitTypeList: Array<{ id: string, text: string }> = [{ id: '', text: 'Please Select' }, { id: '1', text: 'New' }, { id: '2', text: 'Replace' }]



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
    this.getAllCompany();
    this.getAllDepartment();
    this.getAllPost();
    this.getAllBusinessType();
    this.getAllLocation();



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





  public responseTag: string = 'listJobPost';
  public jobPostLists: any = [];
  public _listByPageUrl: string = 'jobpost/getbypages/';
  getListByPage(pageSize) {
    debugger
    setTimeout(() => {
      this._pg.getListByPage(1, true, pageSize, '');
      setTimeout(() => {
      }, 300);
    }, 0);
  }
  sendToList(ev) {
    this.jobPostLists = ev;
    console.log("this.jobPostLists", this.jobPostLists)
  }



  public checkedModel: any;
  public responseTags: string = 'listJobRequsition';
  public requsitionList: any = [];
  public requsitionLists: any = [];
  //public _listByPageUrls: string = 'quotations/getbypage';
  public _listByPageUrls: string = 'jobpost/reqgetbypages';
  GetRequsitionList(pageSize) {
    debugger
    //this.isReportDisable = true;
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
    if (this.requsitionList.length > 0) {
      this.requsitionList.forEach((item, index) => {
        item.isChecked = false;
        item.isInProcess = item.isInProcess == '1' ? true : false;
        item.isProcessComplete = item.isProcessComplete == '1' ? true : false;
        item.isLock = item.isLock == '1' ? true : false;
        item.isActive = item.isActive == '1' ? true : false;
      });

      this.requsitionLists = this.requsitionList;
      console.log("   this.quotqtionLists", this.requsitionLists)
    }
  }
  sendToLists(ev) {
    this.requsitionList = ev;
    setTimeout(() => {
      this.setSringToBools();
    }, 300);
  }






  createForm() {

    this.jobPostForm = this.formBuilder.group({
      jbPostId: null,
      requsitonId: null,
      jobTitle: new FormControl(null, Validators.required),
      company: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      post: new FormControl(null, Validators.required),
      //post: null,
      startDate: new FormControl(this.today, Validators.required),
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
      reportingTo: null,
      recruitType:new FormControl(null),
      applicantSkill: this.formBuilder.array([]),
      applicantResponsibility: this.formBuilder.array([]),
      applicantRequirement: this.formBuilder.array([]),
      applicantExperience: this.formBuilder.array([]),
      applicantOtherRequirement: this.formBuilder.array([]),
      applicantBenifit: this.formBuilder.array([]),


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







  public _saveUrl: string = 'jobpost/saveupdate';
  onSubmit(): void {
    console.log("this.this.jobPostForm for update", this.jobPostForm)
    debugger
    let formValues = { ...this.jobPostForm.value };
    delete formValues.applicantSkill;
    delete formValues.applicantResponsibility;
    delete formValues.applicantRequirement;
    delete formValues.applicantExperience;
    delete formValues.applicantOtherRequirement;
    delete formValues.applicantBenifit;

    const jobPostform = formValues;
    const appSkill = this.applicantSkill.value;
    console.log("this.this.jobPostForm for appSkill", appSkill)
    const appResponsibility = this.applicantResponsibility.value;
    const appRequirement = this.applicantRequirement.value;
    const appExperience = this.applicantExperience.value;
    const appOtherRequirement = this.applicantOtherRequirement.value;
    const appBenifit = this.applicantBenifit.value;



    const param = {
      loggedUserId: this.loggedUserId,
      strId: this.jobPostForm.controls.jbPostId.value,
      strId2: this.userID
    };

    const ModelsArray = [param, [jobPostform], appSkill, appResponsibility, appRequirement, appExperience, appOtherRequirement, appBenifit];
    console.log("ModelsArray", ModelsArray)
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



  reset() {
    this.createForm();
    this.setAsnewJob = '';
  }

  resets() {
    // window.location.reload()
    debugger
    this.jobPostForm.setValue({
      jbPostId: null,
      requsitonId: null,
      jobTitle: null,
      company: null,
      department: null,
      post: null,
      startDate: null,
      endDate: null,
      education: null,
      experience: null,
      workPlace: null,
      employeeStatus: null,
      jobLocation: null,
      gender: null,
      address: null,
      business: null,
      salaryRange: null,
      description: null,
      isActive: null,
      recruitType:null,
      //applicantSkill: this.formBuilder.array([]), 
      applicantSkill: this.applicantSkill.clear(),
      applicantResponsibility: this.applicantResponsibility.clear(),
      applicantRequirement: this.applicantRequirement.clear(),
      applicantExperience: this.applicantExperience.clear(),
      applicantOtherRequirement: this.applicantOtherRequirement.clear(),
      applicantBenifit: this.applicantBenifit.clear()


    })
  }


  //get Requsiton
  //EDIT UPDATE DATA
  public _getreqbyIdUrl: string = 'jobpost/reqgetbyid';
  getRequsitionById(modelEvnt) {
    debugger;
    var param = { strId: modelEvnt.oid };
    var apiUrl = this._getreqbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
     
        var requsition = JSON.parse(this.res.resdata.jobRequisition);
        var requsitionDetai = requsition[0];
           console.log("total tesponse of requsition of job jpost",requsitionDetai)
        this.jobPostForm.patchValue({
          company: requsitionDetai.companyOid,
          department: requsitionDetai.department,
          post: requsitionDetai.postName,
          education: requsitionDetai.reqEducation,
          salaryRange: requsitionDetai.salaryFrom + " to " + requsitionDetai.salaryTo,
          recruitType: requsitionDetai.reqType,
          experience: requsitionDetai.totalExperience,
          description: requsitionDetai.jobSpc,
          requsitonId: requsitionDetai.oid,
          reportingTo:requsitionDetai.reportingTo
        });
        const skillData = [{ skillOid: null, jbPostId: null, skill: requsitionDetai.skillDetails }];
        //for update from requsition
        this.applicantSkill.clear();
        this.updateSkill(skillData);

        const experienceData = [{ experienceOid: null, jbPostId: null, experience: requsitionDetai.experienceDetails }];
        //for update from requsition
        this.applicantExperience.clear();
        this.updateExperience(experienceData);
      }, error => {
        console.log(error);
      });
  }



  //EDIT UPDATE DATA
  setAsnewJob: string = '';
  public jobSkill: any;
  public _getbyIdUrl: string = 'jobpost/getbyid';
  edit(modelEvnt) {
    debugger;
    this.setAsnewJob = '';
    this.setAsnewJob = modelEvnt.model.jobOid;
    //modelEvnt.event.preventDefault();
    var param = { strId: modelEvnt.model.jobOid, strId2: modelEvnt.model.categoryId };
    var apiUrl = this._getbyIdUrl
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(response => {
        this.res = response;
        console.log("this.Total data ", this.res)
        this.clearApplicantSkills();
        this.clearApplicantBenefit();
        this.clearApplicantRequirement();
        this.clearApplicantExperience();
        this.clearApplicantOtherRequirement();
        this.clearesponsiboility();
        if (this.res.resdata.jobSkill) {
          var jobSkill = JSON.parse(this.res.resdata.jobSkill);
          this.updateSkill(jobSkill);
        }
        if (this.res.resdata.jobBenefit) {
          var benefit = JSON.parse(this.res.resdata.jobBenefit);
          this.updateBenefit(benefit)
        }
        if (this.res.resdata.jobRequirement) {
          var requirement = JSON.parse(this.res.resdata.jobRequirement);
          this.updateRequirement(requirement)
        }
        if (this.res.resdata.jobExperience) {
          var experience = JSON.parse(this.res.resdata.jobExperience);
          this.updateExperience(experience)
        }
        if (this.res.resdata.jobOtherRequirement) {
          var otherRequirement = JSON.parse(this.res.resdata.jobOtherRequirement);
          this.updateOtherRequirement(otherRequirement)
        }
        if (this.res.resdata.jobResponsibility) {
          var responsibilityList = JSON.parse(this.res.resdata.jobResponsibility);
          this.updateResponsiboility(responsibilityList)
        }


        console.log("this.jobSkill ", jobSkill)
        if (this.res.resdata.jobPostMaster != '') {
          var jobPost = JSON.parse(this.res.resdata.jobPostMaster)[0];

          console.log("this.jobPost", jobPost)
          debugger;
          this.jobPostForm.setValue({
            jbPostId: jobPost.jbPostId,
            requsitonId: jobPost.requsitonId,
            jobTitle: jobPost.jobTitle,
            company: jobPost.company,
            department: jobPost.department,
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
            gender: jobPost.gender,
            address: jobPost.address,
            business: jobPost.business,
            salaryRange: jobPost.salaryRange,
            description: jobPost.description,
            isActive: jobPost.isActive == 0 ? false : true,
            reportingTo:jobPost.reportingTo,
            recruitType:jobPost.recruitType,
            applicantSkill: this.formBuilder.array([]),
            applicantResponsibility: this.formBuilder.array([]),
            applicantRequirement: this.formBuilder.array([]),
            applicantExperience: this.formBuilder.array([]),
            applicantOtherRequirement: this.formBuilder.array([]),
            applicantBenifit: this.formBuilder.array([]),

          });
          console.log("this.this.jobPostForm------->edit", this.jobPostForm)
        }
        this.reset();
      }, error => {
        console.log(error);
      });
  }



  // for update Skill
  updateSkill(jobSkill: any[]) {
    this.clearApplicantSkills();
    debugger;
    jobSkill.forEach(skill => {
      var skillGroup = this.formBuilder.group({
        applicantSkillId: skill.skillOid,
        jobPostId: skill.jbPostId,
        skill: skill.skill,
      });
      this.applicantSkill.push(skillGroup);
    });
  }
  clearApplicantSkills() {
    while (this.applicantSkill.length !== 0) {
      this.applicantSkill.removeAt(0);
    }
  }

  //UPDATE BENEFIT
  updateBenefit(benefit: any[]) {
    this.clearApplicantBenefit();
    debugger;
    benefit.forEach(bnft => {
      var benefitGroup = this.formBuilder.group({
        applicantBenefitsId: bnft.benefitOid,
        jobPostId: bnft.jbPostId,
        benefits: bnft.benefits,
      });
      this.applicantBenifit.push(benefitGroup);
    });
  }
  clearApplicantBenefit() {
    while (this.applicantBenifit.length !== 0) {
      this.applicantBenifit.removeAt(0);
    }
  }

  //UPDATE REQUIREMENT
  updateRequirement(requirement: any[]) {
    this.clearApplicantRequirement();
    debugger;
    requirement.forEach(req => {
      var reqGroup = this.formBuilder.group({
        applicantRequirementId: req.requirementOid,
        jobPostId: req.jbPostId,
        requirement: req.requirement,
      });
      this.applicantRequirement.push(reqGroup);
    });
  }
  clearApplicantRequirement() {
    while (this.applicantRequirement.length !== 0) {
      this.applicantRequirement.removeAt(0);
    }
  }



  //UPDATE EXPERIENCE
  updateExperience(experience: any[]) {
    this.clearApplicantExperience();
    debugger;
    experience.forEach(exp => {
      var expGroup = this.formBuilder.group({
        applicantExperienceId: exp.experienceOid,
        jobPostId: exp.jbPostId,
        experience: exp.experience,
      });
      this.applicantExperience.push(expGroup);
    });
  }
  clearApplicantExperience() {
    while (this.applicantExperience.length !== 0) {
      this.applicantExperience.removeAt(0);
    }
  }

  //UPDATE OTHER REQUIREMENT
  updateOtherRequirement(otherReq: any[]) {
    this.clearApplicantOtherRequirement();

    otherReq.forEach(otherReq => {
      var skillGroup = this.formBuilder.group({
        applicantOtherRequirementId: otherReq.OtherRequirementOid,
        jobPostId: otherReq.jbPostId,
        requirement: otherReq.otherRequirement,
      });
      this.applicantOtherRequirement.push(skillGroup);
    });
  }
  clearApplicantOtherRequirement() {
    while (this.applicantOtherRequirement.length !== 0) {
      this.applicantOtherRequirement.removeAt(0);
    }
  }

  //UPDATE RESPONSIBILITY
  updateResponsiboility(responsibility: any[]) {
    this.clearesponsiboility();
    responsibility.forEach(res => {
      var responsibilityGroup = this.formBuilder.group({
        applicantResponId: res.responsibilityOid,
        jobPostId: res.jbPostId,
        responsibility: res.responsibility,
      });
      this.applicantResponsibility.push(responsibilityGroup);
    });
  }
  clearesponsiboility() {
    while (this.applicantResponsibility.length !== 0) {
      this.applicantResponsibility.removeAt(0);
    }
  }


  //SET AS NEW JOB POST
  isShow: boolean = false;
  SetNewJob(event: any, id: string) {
    debugger;
    const modelevent = { model: { jobOid: id } }
    this.isShow = true
    const isNewJob = event.target.checked;
    if (!isNewJob) {
      this.edit(modelevent);
      return
    }
    else {

      this.jobPostForm.patchValue({
        jbPostId: null
      });

      if (this.applicantSkill && this.applicantSkill.length > 0) {
        this.applicantSkill.controls.forEach((ctrl: any) => {
          ctrl.patchValue({
            applicantSkillId: null,
            jobPostId: null
          });
        });
      }

      if (this.applicantBenifit && this.applicantBenifit.length > 0) {
        this.applicantBenifit.controls.forEach((ctrl: any) => {
          ctrl.patchValue({
            applicantBenefitsId: null,
            jobPostId: null
          });
        });
      }

      if (this.applicantResponsibility && this.applicantResponsibility.length > 0) {
        this.applicantResponsibility.controls.forEach((ctrl: any) => {
          ctrl.patchValue({
            applicantResponId: null,
            jobPostId: null
          });
        });
      }

      if (this.applicantRequirement && this.applicantRequirement.length > 0) {
        this.applicantRequirement.controls.forEach((ctrl: any) => {
          ctrl.patchValue({
            applicantRequirementId: null,
            jobPostId: null
          });
        });
      }

      if (this.applicantExperience && this.applicantExperience.length > 0) {
        this.applicantExperience.controls.forEach((ctrl: any) => {
          ctrl.patchValue({
            applicantExperienceId: null,
            jobPostId: null
          });
        });
      }

      if (this.applicantOtherRequirement && this.applicantOtherRequirement.length > 0) {
        this.applicantOtherRequirement.controls.forEach((ctrl: any) => {
          ctrl.patchValue({
            applicantOtherRequirementId: null,
            jobPostId: null
          });
        });
      }
    }
    console.log("Updated for new entry==============>:", this.jobPostForm.value);
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
            console.log(" this.companyList", this.companyList)

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
  getAllLocation() {
    var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
    //var list: Array< any > = [   "Please Select" ];
    var apiUrl = this._locUrl;
    this._dataservice.getall(apiUrl)
      .subscribe(
        response => {
          this.res = response;
          console.log("get all locaiton is ",this.res);
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









