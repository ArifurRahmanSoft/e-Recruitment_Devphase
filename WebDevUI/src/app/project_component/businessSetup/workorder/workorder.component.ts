import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Options } from 'select2';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { fontModel } from './fontModel';
import { ReportViewer } from '../../reportviewer/reportviewer';
import { ReportModel } from '../../reportviewer/reportmodel';
//import { DocUpload } from '../../../theme/components/documentupload/documentupload';//uncomment
import { jsPDF } from 'jspdf';
import { Console } from 'console';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/api/user';

declare var $: any;

@Component({
    selector: 'app-workorder',
    templateUrl: './workorder.component.html',
    styleUrls: ['./workorder.component.scss'],
    //providers: [Conversion]
})

export class WorkOrderComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
  @ViewChild(ReportViewer) _rptViewer: ReportViewer;
  public settings: Settings;
  public options: Options;
  public cmnEntity: any = {};
  
  public requirementForm: FormGroup;
  religionList: string[] = ['Islam', 'Hindu', 'Christianity', 'Buddhism', 'Other'];
  bloodGroupList:string[]=['A+','B+','O+',"AB+",'A-','B-','O-',"AB-"];
  genderList:string[]=['Male','Female','Other'];
  maritialStatusList:string[]=['Married','Unmarried'];
  image: FileList | null = null;
  signature: FileList | null = null;
  cv: FileList | null = null;
  selectedFiles:FileList | null = null;
  binaryString:any
  //common
  // addEmployeeRequest = {
  //   academicQulifications: []
  // };
  qualificationType: string[] = ['JSC', 'SSC', 'HSC', 'BSC', 'MSC', 'PhD']; 
  public res: any;

  public userID;
  public userPassword;
  public user = {};
  public localEmail:string;

  public form : FormGroup;
  //public settings: Settings;
  public RegisterForm: FormGroup;
  public resmessage: string;
  public fullName:string;
  public email:string;

  //userModel = new User('', '','','','');

  constructor(public appSettings:AppSettings, 
    private _pathValidation: pathValidation,
    private formBuilder: FormBuilder,
    public fb: FormBuilder, 
    public router:Router, 
    public _apiService : ApiService, 
    private toastr: ToastrService,
    private _dataservice:DataService, 
    


    
    ){
      //this.options = this._pathValidation.ngSelect2Option();
     this.settings = this.appSettings.settings;
 
  }
  

  ngOnInit(){
    this.localEmail = sessionStorage.getItem('userID');
    console.log("this.localEmail",this.localEmail)
    //this.getApplicantInfoById(this.localEmail)
    this.createForm();
    this.addInitialAcademicQualifications();
    
    
  }

  cmnbtnAction(evmodel) {
    debugger
    this[evmodel.func](evmodel);
}

showHide() {
    debugger;
    //this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
}

  public _getbyIdUrl: string = 'reqform/getapplicantbyid';
  getApplicantInfoById(localEmail) {
    //var tstmail="arif@gmail.com"
      var param = { strId:localEmail };
      var apiUrl = this._getbyIdUrl
      this._dataservice.getWithMultipleModel(apiUrl, param)
          .subscribe(response => {
              this.res = response;
              console.log("this.getapplicantbyid",this.res)
              this.reset();
          }, error => {
              console.log(error);
          });
  }


  createForm() {
    this.requirementForm = this.formBuilder.group({
      applicantId: null,
      mobileNumber: new FormControl(null, Validators.required),
      //campaign: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      fatherName: new FormControl(null, Validators.required),
      motherName: new FormControl(null, Validators.required),
      nid: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
      birthPlace: new FormControl(null, Validators.required),
      relegion: new FormControl(null, Validators.required),
      bloodGroup: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      maritialStatus: new FormControl(null, Validators.required),
      spouseName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      appliedPost: new FormControl(null, Validators.required),
      isActive: new FormControl(null, Validators.required),
      preAddDivision: new FormControl(null, Validators.required),
      preAddDistrict: new FormControl(null, Validators.required),
      preAddThana: new FormControl(null, Validators.required),
      preAddPostOffice: new FormControl(null, Validators.required),
      preAddVillage: new FormControl(null, Validators.required),
      parAddDivision: new FormControl(null, Validators.required),
      parAddDistrict: new FormControl(null, Validators.required),
      parAddThana: new FormControl(null, Validators.required),
      parAddPostOffice: new FormControl(null, Validators.required),
      parAddVillage: new FormControl(null, Validators.required),
      expectedSelery: new FormControl(null, Validators.required),
      appliedBy: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      company: new FormControl(null, Validators.required),
      jobTitle: new FormControl(null, Validators.required),
      companyDeptPost: new FormControl(null, Validators.required),
      companyDeptPostOpnDate: new FormControl(null, Validators.required),
      companyDeptPostActvStatus: new FormControl(null, Validators.required),
      imagePath: new FormControl(null, Validators.required),
      signaturePath: new FormControl(null, Validators.required),
      cvPath: new FormControl(null, Validators.required),
      academicQualifications: this.formBuilder.array([]),
      workExperiences: this.formBuilder.array([]), 

      
    });
    
}
 // Getter for easy access to academic qualifications FormArray
 get academicQualifications(): FormArray {
  return this.requirementForm.get('academicQualifications') as FormArray;
}

// Add initial academic qualifications
addInitialAcademicQualifications() {
  for (let i = 0; i < 3; i++) {
    this.addAcademicQualification();
  }
}

// Add a new academic qualification FormGroup to the FormArray
addAcademicQualification() {
  const qualificationGroup = this.formBuilder.group({
    acQlfId: null,
    applicantId: null,
    degree: ['', Validators.required],
    board: ['', Validators.required],
    institution: ['', Validators.required],
    major: ['', Validators.required],
    result: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    passingyear: ['', [Validators.required, Validators.pattern("^[0-9]{4}$")]]
  });

  this.academicQualifications.push(qualificationGroup);
}

// Remove an academic qualification from the FormArray
removeAcademicQualification(index: number) {
  if (this.academicQualifications.length > 3) { // Ensure at least 3 qualifications remain
    this.academicQualifications.removeAt(index);
  }
}


get workExperiences(): FormArray {
  return this.requirementForm.get('workExperiences') as FormArray;
}

// Add new work experience form group
addExperience() {
  const experienceGroup = this.formBuilder.group({
    expId: null,
    applicantId: null,
    post: [null, Validators.required],
    organization: [null, Validators.required],
    jobLocation: [null, Validators.required],
    salary: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
    reportingTo: [null, Validators.required],
    defaultProduct: [null, Validators.required],
  });

  this.workExperiences.push(experienceGroup);
}

// Remove work experience by index
removeExperience(index: number) {
  this.workExperiences.removeAt(index);
}





// onSubmitFileForm(){
//   this.uploadImages();
//   this.uploadSIgnature();
//   this.uploadCV();
//   this.onSubmit();
// }

// onFileChange(event: any): void {
//   this.image = event.target.files;  
// }
// OnSignatureChange(event: any): void {
//   this.signature = event.target.files;  
// }
// OnCvChange(event: any): void {
//   this.cv = event.target.files;  
// }


// uploadImages(): void {
//   this._dataservice.uploadFile(this.image).subscribe(
//     response => {
//       this.requirementForm.controls.imagePath=response.data[0];
//     },
//     error => {
//       console.error(error);
//       alert('Image upload failed. Please try again.');
//     }
//   );
// }

// uploadSIgnature(): void {
//   this._dataservice.uploadFile(this.signature).subscribe(
//     response => {
//       this.requirementForm.controls.signaturePath=response.data[0];
//     },
//     error => {
//       console.error(error);
//       alert('Image upload failed. Please try again.');
//     }
//   );
// }

// uploadCV(): void {
//   this._dataservice.uploadFile(this.cv).subscribe(
//     response => {
//       this.requirementForm.controls.cvPath=response.data[0];
//     },
//     error => {
//       console.error(error);
//       alert('Image upload failed. Please try again.');
//     }
//   );
// }

// public _saveUrl: string = 'reqform/saveupdate';
// onSubmit() {
//   debugger
//   let formValues = { ...this.requirementForm.value }; 
//   delete formValues.academicQualifications;
//   delete formValues.workExperiences;
//   const reqform = formValues;
//   console.log(reqform);
//   var acaQlf = this.academicQualifications.value;
//   var wrkExp = this.workExperiences.value;
//   var param = { loggedUserId: '08427', strId: this.requirementForm.controls.applicantId.value, strId2: this.userID };
//   var ModelsArray = [param, [reqform], acaQlf, wrkExp];
//   console.log("ModelsArray",ModelsArray);
//   var apiUrl = this._saveUrl;
//   this._dataservice.postMultipleModel(apiUrl, ModelsArray)
//       .subscribe(response => {
//           this.res = response;
//           this.resmessage = this.res.resdata.message;
//           if (this.res.resdata.resstate) {
             
             
//               this._msg.success(this.resmessage);
//               this.reset();
//           }
       
//       }, error => {
//           console.log(error);
//       });
// }



async onSubmitFileForm(): Promise<void> {
  try {
    //await this.uploadImages();
    //await this.uploadSignature();
   // await this.uploadCV();
    this.onSubmit();
  } catch (error) {
    console.error("File upload sequence failed.", error);
  }
}

// File change handlers
onFileChange(event: any): void {
  this.image = event.target.files;  
}

OnSignatureChange(event: any): void {
  this.signature = event.target.files;  
}

OnCvChange(event: any): void {
  this.cv = event.target.files;  
}

// Upload image with async/await
// async uploadImages(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     this._dataservice.uploadFile(this.image).subscribe(
//       response => {
//         this.requirementForm.controls.imagePath.setValue(response.data[0]);
//         resolve(); 
//       },
//       error => {
//         console.error(error);
//         alert('Image upload failed. Please try again.');
//         reject(error); 
//       }
//     );
//   });
// }

// Upload signature with async/await
// async uploadSignature(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     this._dataservice.uploadFile(this.signature).subscribe(
//       response => {
//         this.requirementForm.controls.signaturePath.setValue(response.data[0]);
//         resolve(); 
//       },
//       error => {
//         console.error(error);
//         alert('Signature upload failed. Please try again.');
//         reject(error); 
//       }
//     );
//   });
// }

// Upload CV with async/await
// async uploadCV(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     this._dataservice.uploadFile(this.cv).subscribe(
//       response => {
//         this.requirementForm.controls.cvPath.setValue(response.data[0]);
//         resolve(); 
//       },
//       error => {
//         console.error(error);
//         alert('CV upload failed. Please try again.');
//         reject(error); 
//       }
//     );
//   });
// }

// Submit form after all uploads are done
public _saveUrl: string = 'reqform/saveupdate';
onSubmit(): void {
  let formValues = { ...this.requirementForm.value };
  delete formValues.academicQualifications;
  delete formValues.workExperiences;
  
  const reqform = formValues;
  const acaQlf = this.academicQualifications.value;
 
  const wrkExp = this.workExperiences.value;
  console.log("wrkExp",wrkExp)
  const param = { 
    loggedUserId: '08427', 
    strId: this.requirementForm.controls.applicantId.value, 
    strId2: this.userID 
  };
  
  const ModelsArray = [param, [reqform], acaQlf, wrkExp];
  this._dataservice.postMultipleModel(this._saveUrl, ModelsArray)
    .subscribe(response => {
      this.res = response;
      this.resmessage = this.res.resdata.message;
      if (this.res.resdata.resstate) {
        this._msg.success(this.resmessage);
        this.reset();
      }
    }, error => {
      console.log(error);
    });
}




reset() {
  this.RegisterForm.setValue({
    applicantId: null,
    mobileNumber: null,
    campaign: null,
    name: null,
    fatherName: null,
    motherName: null,
    nid: null,
    dateOfBirth: null,
    birthPlace: null,
    relegion: null,
    bloodGroup: null,
    gender: null,
    maritialStatus: null,
    spouseName: null,
    email: null,
    interviewdate: null,
    appliedPost: null,
    isActive: null,
    preAddDivision: null,
    preAddDistrict: null,
    preAddThana: null,
    preAddPostOffice: null,
    preAddVillage: null,
    parAddDivision: null,
    parAddDistrict: null,
    parAddThana: null,
    parAddPostOffice: null,
    parAddVillage: null,
    expectedSelery: null,
    appliedBy: null,
    department: null,
    company: null,
    jobTitle: null,
    companyDeptPost: null,
    companyDeptPostOpnDate: null,
    companyDeptPostActvStatus: null,
    imagePath: null,
    signaturePath: null,
    cvPath: null,
  });


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