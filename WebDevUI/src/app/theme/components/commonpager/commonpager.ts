import { Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
import { PagerService } from '../../../api/api.pager.service';
import { DataService } from '../../../api/api.dataservice.service';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

@Component({
    selector: 'pager-bottom',
    templateUrl: './commonpager.html',
    providers: [PagerService]
})

export class CommonPager implements OnInit {
    public settings:Settings;
    @Input() itemListByPage: any = [];
    //Pager bottom
    public res: any;
    public pageNumber: number = 0;
    public totalRows: number = 0;
    public pageStart: number = 0;
    public pageEnd: number = 0;
    public totalRowsInList: number = 0;
    // pager object
    public pager: any = {};
    // paged items
    //public pagedItems: any = [];
    public pageSizeList: any = [];
    public pagerService: any;
    public _dataservice: any;
    //Pager bottom
    //Pager top
    @Input() pageSize: number = 10;
    public searchVal: string = '';
    @Input() IsSearchOnServer: boolean = true;
    @Input() responseTag: any;
    @Input() apiUrl: string = '';

    @Input() responseTags: any;
    @Input() apiUrls: string = '';
    //Pager top

    //vm cmn parameter
    @Input() id: number=null;
    @Input() strId: string='';
    @Input() strId2: string='';
    @Input() isTrue: boolean = false;
    @Input() sDate: any=null;
    @Input() eDate: any=null;
    @Input() cDate: any=null;
    @Input() tablename: string = '';
    @Input() property: string = '';
    @Input() values: string = '';
    @Input() userId: string = '';
    @Input() loggedUserId: string = '';
    @Input() month: number = null;
    @Input() path: string = '';
    @Input() isEdit: boolean = false;
    @Input() strYear: string = '';
    @Input() strMonth: string = '';
    @Input() strDay: string = '';
    @Input() strTime: string = '';
    @Input() Status: string = '';
    @Input() comments: string = '';
    @Input() name: string = '';
    @Input() userName: string = '';
    @Input() userPass: string = '';
    @Input() macAddress: string = '';
    @Input() clientIp: string = '';
    @Input() company: string = '';
    @Input() department: string = '';
    @Input() post: string = '';
    @Input() Role: string = '';
    @Input() approvalProcess: string = '';
    @Input()JobTitle:string='';
    @Input()fromNumber:any=null;
    @Input()toNumber:any=null;
    //vm cmn parameter

    @Output() setPage: EventEmitter<any> = new EventEmitter();
    @Output() sendList: EventEmitter<any> = new EventEmitter();



    constructor(public appSettings:AppSettings, private _http: HttpClient, @Inject(DOCUMENT) private document: any) {
        this._dataservice = new DataService(_http, document);
        this.pagerService = new PagerService();
        this.pageSizeList = this.pagerService.pageSize();
        this.settings = this.appSettings.settings;
    }

    ngOnInit() { }

    inListPaging(itemList, isPaging, pageIndex, recordsTotal) {
        this.itemListByPage = itemList;
        this.pageNumber = pageIndex;
        this.totalRowsInList = this.itemListByPage.length;
        this.totalRows = recordsTotal;
        if (this.pageNumber == 0 || this.pageNumber == 1) {
            this.pageStart = 1;
            if (this.totalRowsInList < this.pageSize) {
                this.pageEnd = this.totalRowsInList;
            }
              else if(Number.isNaN(this.pageSize)){
             this.pageEnd = recordsTotal;
            }
            else {
                this.pageEnd = this.pageSize;
            }
        } else {
            this.pageStart = (this.pageNumber - 1) * this.pageSize + 1;
            this.pageEnd = (this.pageStart - 1) + this.totalRowsInList;
        }
        //paging info end
        if (isPaging) {
            this.setPagination(pageIndex, false);
        }
        else {
            //this.pagedItems = this.itemListByPage;

            this.sendList.emit(this.itemListByPage);
        }

    }

    setPagination(pageNumber: number, isPaging: boolean) {
        this.pager = this.pagerService.getPager(this.totalRows, pageNumber, this.pageSize);
        if (isPaging) {
            this.getListByPage(pageNumber, false, this.pager.pageSize, this.searchVal);
           
        }
        else {
            //this.pagedItems = this.itemListByPage;
            this.sendList.emit(this.itemListByPage);
        }
    }

    searchInList() {
        debugger;
    }

    searchOnServer() {
        debugger;
        this.setPagination(1, true);
    }

    getListByPage(pageIndex: number, isPaging: boolean, pageSize, searchVal: string) {
       debugger
        this.settings.loadingSpinnerOnAction = true;
        this.pageSize=parseInt(pageSize);
        var param = {
            pageNumber: pageIndex
            , pageSize: this.pageSize
            , isPaging: isPaging
            , searchVal: searchVal
            , id: this.id
            , strId: this.strId
            , strId2: this.strId2
            , isTrue: this.isTrue
            , sDate: this.sDate
            , eDate: this.eDate
            , cDate: this.cDate
            , tablename: this.tablename
            , property: this.property
            , values: this.values
            , userId: this.userId
            , loggedUserId: this.loggedUserId
            , month: this.month
            , path: this.path
            , isEdit: this.isEdit
            , strYear: this.strYear
            , strMonth: this.strMonth
            , strDay: this.strDay
            , strTime: this.strTime
            , Status: this.Status
            , comments: this.comments
            , name: this.name
            , userName: this.userName
            , userPass: this.userPass
            , macAddress: this.macAddress
            , clientIp: this.clientIp
            , company: this.company
            , department: this.department
            , post: this.post
            ,Role:this.Role
            ,JobTitle:this.JobTitle
            ,fromNumber:this.fromNumber
            ,toNumber:this.toNumber
            ,approvalProcess:this.approvalProcess
        };
        console.log("this.param is ",param)
        this._dataservice.getWithMultipleModel_Sync(this.apiUrl, param)
     
            .then(
                response => {
                    this.res = response;
                    console.log("this.res job post is",this.res)
                    this.itemListByPage = [];
                    if (this.res.resdata[this.responseTag] !== '' && this.res.resdata[this.responseTag] !== null) {
                        this.itemListByPage = JSON.parse(this.res.resdata[this.responseTag]);
                    }

                    var totalRecords = this.itemListByPage.length > 0 ? this.itemListByPage[0].recordsTotal : 0;
                    this.inListPaging(this.itemListByPage, isPaging, pageIndex, totalRecords);

                    this.settings.loadingSpinnerOnAction = false;

                }, error => {
                    console.log(error);
                }
            );
    }

















}


@Component({
    selector: 'pager-top',
    template: '<div class="pull-left">' +
        '<label>' +
        'Show <select name="pageSize" [(ngModel)]="pageSize"' +
        '(change)="setPage.emit(pageSize)">' +
        '<option *ngFor="let ps of pageSizeList" value={{ps}}>' +
        '{{ps}}' +
        '</option>' +
        '</select> entries' +
        '</label>' +
        '</div>' +
        '<div class="pull-right mr-2">' +
        '<label class="pull-right" style="width:200%">' +
        '<input type="search" *ngIf="IsSearchOnServer" placeholder="Search" style="width:100%"' +
        '[(ngModel)]="searchVal" (keyup.enter)="searchOnServer();" (blur)="searchOnServer()">' +
        '<input type="search" *ngIf="!IsSearchOnServer" placeholder="Search"' +
        '[(ngModel)]="searchVal" (keyup.enter)="searchInList();" (blur)="searchInList()">' +
        '</label>' +
        '</div>'
})
export class PagerSize extends CommonPager {}