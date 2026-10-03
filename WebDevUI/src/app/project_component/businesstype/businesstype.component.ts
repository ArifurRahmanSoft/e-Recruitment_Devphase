import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
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
declare var $: any;

@Component({
    selector: 'app-businesstype',
    templateUrl: './businesstype.component.html',
    styleUrls: ['./businesstype.component.scss'],
    providers: [Conversion]
})

export class BusinessTypeComponent implements OnInit {
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
    public clientTypeId;

    constructor(
        private _conversion: Conversion,
        private _dataservice: DataService,
        private _pathValidation: pathValidation,
        private formBuilder: FormBuilder,
        @Inject(DOCUMENT) private document: any) {
        this._pathValidation.validate(this.document.location);
        this.cmnEntity = this._pathValidation.rowEntities();
        //this._pathValidation.alterCmnBtn([{ id: 6, col: "isShowBtn", val: true }]);
    }

    ngOnInit(): void {
        this.createForm();
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

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listBusinessType';
    public businessTypeList: any = [];
    public _listByPageUrl: string = 'jobPost/businessgetbypages';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize, '');
        }, 0);
    }

    sendToList(ev) {
        this.businessTypeList = ev;
        console.log("this.businessTypeList", this.businessTypeList)
    }


    public _saveUrl: string = 'jobPost/businesstypesaveupdate';
    onSubmit() {

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.businessTypeForm.value];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    //this.getListByPage(this.pageSize);
                    this._msg.success(this.resmessage);
                    this.reset();
                } else {
                    this._msg.warning(this.resmessage);
                }
            }, error => {
                console.log(error);
            });
    }

    //Get by ID
    // public _getbyIdUrl: string = 'jobPost/businessgetbyid';
    // edit(modelEvnt) {
    //     debugger;
    //     modelEvnt.event.preventDefault();
    //     var param = { strId: modelEvnt.model.businessOid };
    //     var apiUrl = this._getbyIdUrl
    //     this._dataservice.getWithMultipleModel(apiUrl, param)
    //         .subscribe(response => {
    //             this.res = response;
    //              console.log("business edit detials is ",this.res)
    //             if (this.res.resdata) {
    //                 var busness = JSON.parse(this.res.resdata.businessMaster)[0];


    //                 this.businessTypeForm.setValue({
    //                     businessId: busness.businessOid,
    //                     name: busness.name,
    //                     details: busness.details,
    //                     //isActive: busness.isActive == '1' ? true : false
    //                 });                    

    //             }
    //         }, error => {
    //             console.log(error);
    //         });
    // }

    public _getbyIdUrl: string = 'ereqdropdown/getbusinesstypebyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        //var param = { strId: modelEvnt.model.businessOid };
          var param =  modelEvnt.model.businessOid;
        var apiUrl = this._getbyIdUrl
        this._dataservice.getbyid(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                console.log("business edit detials is ", this.res)
                if (this.res.resdata) {
                    var busness = this.res.resdata.businessType[0];


                    this.businessTypeForm.setValue({
                        businessId: busness.businessOid,
                        name: busness.name,
                        details: busness.details,
                        //isActive: busness.isActive == '1' ? true : false
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
        this.businessTypeForm.setValue({
            businessId: null,
            name: null,
            details: null,

        });

        this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#clientTypeName').focus();
    }










}
