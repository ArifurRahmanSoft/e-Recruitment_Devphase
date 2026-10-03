import { Component, OnInit, Inject, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DatePipe, DOCUMENT } from '@angular/common';
//import { Conversion } from '../../../api/api.conversion.service';
//import { DataService } from '../../../api/api.dataservice.service';
//import { pathValidation } from '../../../api/api.pathvlidation.service';
//import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
//import { CommonPager } from '../../../theme/components/commonpager/commonpager';
import { Conversion } from '../../api/api.conversion.service';
import { DataService } from '../../api/api.dataservice.service';
import { pathValidation } from '../../api/api.pathvlidation.service';
import { CommonService } from '../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../theme/components/commonpager/commonpager';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
    selector: 'app-vivadimensionsetup',
    templateUrl: './vivadimensionsetup.component.html',
    styleUrls: ['./vivadimensionsetup.component.scss'],
    providers: [Conversion]
})

export class VivaDimensionSetupComponent implements OnInit {
    //Common    
    @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
    @ViewChild('cmnpager', { static: false }) _pg: CommonPager;
    private userID = sessionStorage.getItem("userID");

    public cmnEntity: any = {};
    public resmessage: string;
    public IsShow: boolean = true;
    public res: any;
    public pageSize: number = 10;
    //public displayStart = 0;
    public isLoaded: Object = true;
    public businessTypeForm: FormGroup;
    public vivaDmnsEntrForm: FormGroup;
    public clientTypeId;

    constructor(
        private _conversion: Conversion,
        private _dataservice: DataService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        private elementRef: ElementRef,
        private datePipe: DatePipe,
        private toastr: ToastrService,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        //this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: true }]);
    }

    ngOnInit(): void {
        this.createForm();
        this.createVivaDimnsnForm();
        this.getCircularList();
        this.getAllLocation();
        this.getAllExamType();
        this.getAllExaminarRole();


        this.getAllDepartment();
        this.getAllPost();
        $('#clientTypeName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.businessTypeForm = this.formBuilder.group({
            businessId: null,
            name: new FormControl(null, Validators.required),
            details: new FormControl(null, Validators.required),

        });
    }


    getNameToNumDate(strDate: string) {
        debugger;
        var nDate = new Date(strDate);
        var Nowdate = nDate.getFullYear() + '-' + ('0' + (nDate.getMonth() + 1)).slice(-2) + '-' + ('0' + nDate.getDate()).slice(-2);
        return Nowdate;

    }

    public approvalNote: string = '';
    public isAprvalReview: string = '';
    createVivaDimnsnForm() {
        this.vivaDmnsEntrForm = new FormGroup({
            dimensionMstrOid: new FormControl(null),
            designationId: new FormControl(null, Validators.required),
            departmentId: new FormControl(null),


            vivaDimensionDetails: this.formBuilder.array([]),
        })
    }





    get vivaDimensionDetails(): FormArray {
        return this.vivaDmnsEntrForm.get('vivaDimensionDetails') as FormArray;
    }

    addDimensionDtl() {
        const dmnsnGroup = this.formBuilder.group({
            dimensionId: null,
            dimensionMstrOid: null,
            dimension: [null, Validators.required],
        });

        this.vivaDimensionDetails.push(dmnsnGroup);
    }

    removeDimensionDtl(index: number) {
        this.vivaDimensionDetails.removeAt(index);
    }


    // for update Skill
    updateVivaDimensionDetails(dms: any[]) {
        this.clearVivaDimensionSetails();
        debugger;
        dms.forEach(dm => {
            var dmnsnGroup = this.formBuilder.group({
                dimensionId: dm.dimensionId,
                dimensionMstrOid: dm.dimensionMstrOid,
                dimension: dm.dimension,
            });
            this.vivaDimensionDetails.push(dmnsnGroup);
        });
    }
    clearVivaDimensionSetails() {
        while (this.vivaDimensionDetails.length !== 0) {
            this.vivaDimensionDetails.removeAt(0);
        }
    }













    showHide() {
        debugger
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listVivaDimension';
    public vivaDimnsnList: any = [];
    public _listByPageUrl: string = 'VivaDimension/getbypages';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize, '');
        }, 0);
    }

    sendToList(ev) {
        this.vivaDimnsnList = ev;
        console.log("this.vivaBoardList", this.vivaDimnsnList)
    }



    //SAVE UPDATE 
    public _saveUrl: string = 'VivaDimension/saveupdate';
    onSubmit(): void {
        debugger
        let formValue = this.vivaDmnsEntrForm.value;
        console.log("Befor ModelsArray=============>", this.vivaDmnsEntrForm.value)

        let formValues = { ...this.vivaDmnsEntrForm.value };
        delete formValues.vivaDimensionDetails;
        const vivaDmnsnForm = formValues;
        const vivaDmnsnDtl = this.vivaDimensionDetails.value;
        const param = { loggedUserId: this.userID };
        const ModelsArray = [param, [vivaDmnsnForm], vivaDmnsnDtl];

        this._dataservice.postMultipleModel(this._saveUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                console.log("ModelsArray=============-------------->", this.res)
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.toastr.success('Save Successfully');
                    window.location.reload();
                    this.reset();
                }
                else {
                    if (this.res.resdata.mstrRes == '-1') {
                        this.toastr.error('Disagnation can not be duplicated');
                    }
                    else {
                        this.toastr.error(this.resmessage);
                    }

                }
            }, error => {
                console.log("wrorr is ", error);
            });
    }



    public _getbyIdUrl: string = 'VivaDimension/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.dimensionMstrOid };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                console.log("business edit detials is ", this.res)

                this.clearVivaDimensionSetails();
                if (this.res.resdata.vivaDimensionDetails) {
                    var details = JSON.parse(this.res.resdata.vivaDimensionDetails);
                    console.log("business edit detials is details details ", details)
                    this.updateVivaDimensionDetails(details);
                }

                if (this.res.resdata) {
                    var vaivaDmnsnMaster = JSON.parse(this.res.resdata.vivaDimensionMaster);
                    var viva = vaivaDmnsnMaster[0];
                    this.vivaDmnsEntrForm.patchValue({
                        dimensionMstrOid: viva.dimensionMstrOid,
                        designationId: viva.designationId,
                        departmentId: viva.departmentId,



                    });
                }
            }, error => {
                console.log(error);
            });
    }








    //Delete
    public _deleteUrl: string = 'ClientType/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.clientTypeId };
            var apiUrl = this._deleteUrl;
            this._dataservice.deleteWithMultipleModel(apiUrl, param)
                .subscribe(response => {
                    this.res = response;
                    this.resmessage = this.res.resdata.message;
                    if (this.res.resdata.resstate) {
                        this.getListByPage(this.pageSize);
                        this._msg.success(this.resmessage);
                    }
                    else {
                        this._msg.warning(this.resmessage);
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

    reset() {
        this.createVivaDimnsnForm()


        // this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#clientTypeName').focus();
    }








    //get Circular title
    public circularList: any;
    public _jobPostUrl: string = 'ereqdropdown/getalljobtitle';
    getCircularList() {
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
                        this.circularList = list;
                        console.log("total job ttile is ---", this.circularList)

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
                    if (this.res.resdata.listLocation.length > 0) {
                        var itemList = this.res.resdata.listLocation;
                        var arItem = JSON.parse(itemList)
                        arItem.forEach(item => {
                            list.push({ id: item.oid, text: item.name })
                        })
                        this.locationList = list;
                    }
                }, error => {
                    console.log(error);
                });
    }


    public examTypeList: any;
    public _examTypeUrl: string = 'ereqdropdown/getallexamtype';
    getAllExamType() {
        var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
        var apiUrl = this._examTypeUrl;
        this._dataservice.getall(apiUrl)
            .subscribe(
                response => {
                    this.res = response;
                    if (this.res.resdata.listExamType.length > 0) {
                        var itemList = this.res.resdata.listExamType;
                        itemList.forEach(item => {
                            list.push({ id: item.oid, text: item.name })
                        })
                        this.examTypeList = list;
                    }
                }, error => {
                    console.log(error);
                });
    }


    public ExaminarRoleList: any;
    public _examinarRoleUrl: string = 'ereqdropdown/getallexaminarrole';
    getAllExaminarRole() {
        var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
        var apiUrl = this._examinarRoleUrl;
        this._dataservice.getall(apiUrl)
            .subscribe(
                response => {
                    this.res = response;
                    if (this.res.resdata.listExaminarRole.length > 0) {
                        var itemList = this.res.resdata.listExaminarRole;
                        itemList.forEach(item => {
                            list.push({ id: item.oid, text: item.name })
                        })
                        this.ExaminarRoleList = list;
                    }
                }, error => {
                    console.log(error);
                });
    }











    //END ALL EMP 


    //start
    public DepartmentList: any;
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

    public designationList: any;
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






}


