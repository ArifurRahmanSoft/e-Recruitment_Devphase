import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Conversion } from '../../../api/api.conversion.service';
import { DataService } from '../../../api/api.dataservice.service';
import { pathValidation } from '../../../api/api.pathvlidation.service';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { CommonPager } from '../../../theme/components/commonpager/commonpager';
declare var $: any;

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
    providers: [Conversion]
})

export class ClientComponent implements OnInit {
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

    public clientForm: FormGroup;
    public clientTypeList: any = [];


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
        this.getClientType();
        //this.getclientByPage(0, true, this.pageSize);
        $('#clientName').focus();
    }

    cmnbtnAction(evmodel) {
        debugger;
        this[evmodel.func](evmodel);
    }

    createForm() {
        this.clientForm = this.formBuilder.group({
            clientId: null,
            clientCode: null,
            clientName: new FormControl(null, Validators.required),
            clientSName: new FormControl(null, Validators.required),
            clientBName: new FormControl(null),
            clientOwner: new FormControl(null),
            clientDesig: new FormControl(null),
            clientContactPerson: new FormControl(null, Validators.required),
            clientEmail: new FormControl(null, Validators.required),
            clientMobile: new FormControl(null, Validators.required),
            clientFax: new FormControl(null),
            clientAddress: new FormControl(null, Validators.required),
            clientBAddress: new FormControl(null),
            clientAddress2: new FormControl(null, Validators.required),
            clientBAddress2: new FormControl(null),
            clientBIN: new FormControl(null),
            clientTIN: new FormControl(null),
            clientCreditLimit: new FormControl(null),
            clientEnrollDate: new FormControl(null),
            clientType: new FormControl(null, Validators.required),
            isActive: true
        });
    }

    showHide() {
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listClient';
    public clientList: any = [];
    public _listByPageUrl: string = 'client/getbypage';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize, '');
        }, 0);
    }

    public _clientTypeUrl: string = 'dropdown/getallclienttype';
    getClientType() {
        this.clientForm.controls.clientType.setValue(null);
        var list: Array<{ id, text }> = [{ id: 0, text: "Please Select" }];
        var apiUrl = this._clientTypeUrl;
        this._dataservice.getall(apiUrl)
            .subscribe(
                response => {
                    this.res = response;
                    if (this.res.resdata.listClientType.length > 0) {
                        var itemList = this.res.resdata.listClientType;
                        itemList.forEach(item => {
                            list.push({ id: item.oId, text: item.typeName });
                        });
                        this.clientTypeList = list;
                    }
                }, error => {
                    console.log(error);
                });
    }

    public _saveUrl: string = 'client/saveupdate';
    onSubmit() {

        var param = { loggedUserId: this.userID };
        var ModelsArray = [param, this.clientForm.value];
        var apiUrl = this._saveUrl;
        this._dataservice.postMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                this.res = response;
                this.resmessage = this.res.resdata.message;
                if (this.res.resdata.resstate) {
                    this.getListByPage(this.pageSize);
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
    public _getbyIdUrl: string = 'client/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.clientId };
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                if (this.res.resdata.objClient != '') {
                    var client = JSON.parse(this.res.resdata.objClient)[0];

                    this.clientForm.setValue({
                        clientId: client.clientId,
                        clientCode: client.clientCode,
                        clientName: client.clientName,
                        clientSName: client.clientSName,
                        clientBName: client.clientBName,
                        clientOwner: client.clientOwner,
                        clientDesig: client.clientDesig,
                        clientContactPerson: client.clientContactPerson,
                        clientEmail: client.clientEmail,
                        clientMobile: client.clientMobile,
                        clientFax: client.clientFax,
                        clientAddress: client.clientAddress,
                        clientBAddress: client.clientBAddress,
                        clientAddress2: client.clientAddress2,
                        clientBAddress2: client.clientBAddress2,
                        clientBIN: client.clientBIN,
                        clientTIN: client.clientTIN,
                        clientCreditLimit: client.clientCreditLimit,
                        clientEnrollDate: this._conversion.getNameToNumDate(client.clientEnrollDate),
                        clientType: client.clientType,
                        isActive: client.isActive == '1' ? true : false
                    });                    

                }
            }, error => {
                console.log(error);
            });
    }

    //Delete
    public _deleteUrl: string = 'client/delete';
    delete(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        if (modelEvnt.isConfirm) {
            var param = { loggedUserId: this.userID, strId: modelEvnt.model.clientId };
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
        this.clientForm.setValue({
            clientId: null,
            clientCode: null,
            clientName: null,
            clientSName: null,
            clientBName: null,
            clientOwner: null,
            clientDesig: null,
            clientContactPerson: null,
            clientEmail: null,
            clientMobile: null,
            clientFax: null,
            clientAddress: null,
            clientBAddress: null,
            clientAddress2: null,
            clientBAddress2: null,
            clientBIN: null,
            clientTIN: null,
            clientCreditLimit: null,
            clientEnrollDate: null,
            clientType: null,
            isActive: true
        });

        this.resmessage = null;
        //this._el.nativeElement.focus();
        $('#clientName').focus();
    }

}
