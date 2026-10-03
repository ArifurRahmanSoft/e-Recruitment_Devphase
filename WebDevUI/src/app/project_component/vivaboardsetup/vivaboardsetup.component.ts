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
    selector: 'app-vivaboardsetup',
    templateUrl: './vivaboardsetup.component.html',
    styleUrls: ['./vivaboardsetup.component.scss'],
    providers: [Conversion]
})

export class VivaBoardSetupComponent implements OnInit {
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
    public vivaEntryForm: FormGroup;
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

    public today = new Date().toISOString().split('T')[0];
    ngOnInit(): void {
        this.createForm();
        this.createVivaForm();
        this.getCircularList();
        this.getAllLocation();
        this.getAllExamType();
        this.getAllExaminarRole();
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
    createVivaForm() {
        this.vivaEntryForm = new FormGroup({
            vivaBoardOid: new FormControl(null),
            circularOid: new FormControl(null, Validators.required),
            boardName: new FormControl(null, Validators.required),
            location: new FormControl(null, Validators.required),
            vivaDate: new FormControl(this.today, Validators.required),
            vivaMarks: new FormControl(null, Validators.required),

            vivaBoardDetails: this.formBuilder.array([]),
        })
    }




    get vivaBoardDetails(): FormArray {
        return this.vivaEntryForm.get('vivaBoardDetails') as FormArray;
    }

    addVivaBoardMember(index: number) {
        debugger
        this.loadSuppliers(false);
        this.selectedText[index] = '';
        const vivaGroup = this.formBuilder.group({
            vivaDetailsId: [null],
            vivaMasterOid: [null],
            // examType: [null],
            examinarId: [null, Validators.required],
            role: [null, Validators.required],
        });
        this.vivaBoardDetails.push(vivaGroup);

    }


    removeVivaBoardMember(index: number) {
        const isConfirm = confirm("Are you sure you want to remove this item?");
        if (isConfirm) {
            this.vivaBoardDetails.removeAt(index);
        }
        else {
            return
        }

    }

    // for update viva details
    // updateVivaBoard(details: any[]) {
    //     this.clearVivaBoardDetails();
    //     details.forEach(dtl => {
    //         var vivaDtlsGroup = this.formBuilder.group({
    //             vivaDetailsId: dtl.vivaDetailsId,
    //             vivaMasterOid: dtl.vivaMasterOid,
    //             examinarId: dtl.examinarId,
    //             role: dtl.role,
    //         });
    //         this.vivaBoardDetails.push(vivaDtlsGroup);
    //     });
    // }

    updateVivaBoard(details: any[]) {
    this.clearVivaBoardDetails();
    // Clear old selected values
    this.selectedId = [];
    this.selectedText = [];
    details.forEach((dtl, index) => {
        // Set selected examiner for each row
        this.selectedId[index] = dtl.examinarId;
        this.selectedText[index] = dtl.examinarText;

        const vivaDtlsGroup = this.formBuilder.group({
            vivaDetailsId: [dtl.vivaDetailsId],
            vivaMasterOid: [dtl.vivaMasterOid],
            examinarId: [dtl.examinarId, Validators.required],
            role: [dtl.role, Validators.required],
        });

        this.vivaBoardDetails.push(vivaDtlsGroup);
    });
}



    clearVivaBoardDetails() {
        while (this.vivaBoardDetails.length !== 0) {
            this.vivaBoardDetails.removeAt(0);
        }
    }



    showHide() {
        debugger
        this.cmnEntity.isShow ? this.reset() : this.getListByPage(this.pageSize);
    }

    public responseTag: string = 'listVivaBoard';
    public vivaBoardList: any = [];
    public _listByPageUrl: string = 'exam/getbypages';
    getListByPage(pageSize) {
        setTimeout(() => {
            this._pg.getListByPage(1, true, pageSize, '');
        }, 0);
    }

    sendToList(ev) {
        this.vivaBoardList = ev;
        console.log("this.vivaBoardList", this.vivaBoardList)
    }



    //SAVE UPDATE 
    public _saveUrl: string = 'exam/saveupdate';
    onSubmit(): void {
        debugger
        let formValue = this.vivaEntryForm.value;
       

        let formValues = { ...this.vivaEntryForm.value };
        delete formValues.vivaBoardDetails;
        const vivaAprcForm = formValues;
        const examinarList = this.vivaBoardDetails.value;
        const param = { loggedUserId: this.userID };
        const ModelsArray = [param, [vivaAprcForm], examinarList];
 console.log("Befor ModelsArray===== of save ========>", ModelsArray)
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



    public _getbyIdUrl: string = 'exam/getbyid';
    edit(modelEvnt) {
        debugger;
        modelEvnt.event.preventDefault();
        var param = { strId: modelEvnt.model.vivaBoardOid };
        //var param = modelEvnt.model.vivaBoardOid;
        var apiUrl = this._getbyIdUrl
        this._dataservice.getWithMultipleModel(apiUrl, param)
            .subscribe(response => {
                this.res = response;
                console.log("business edit detials is ", this.res)

                this.clearVivaBoardDetails();
                if (this.res.resdata.vivaBoardDetails) {
                    var details = JSON.parse(this.res.resdata.vivaBoardDetails);
                    this.updateVivaBoard(details);
                }

                if (this.res.resdata) {
                    var vaivaMaster = JSON.parse(this.res.resdata.vivaBoardMaster);
                    var viva = vaivaMaster[0];
                    this.vivaEntryForm.patchValue({
                        vivaBoardOid: viva.vivaBoardOid,
                        circularOid: viva.circularOid,
                        boardName: viva.boardName,
                        location: viva.location,
                        vivaDate: viva.vivaDate == null ? null : this.getNameToNumDate(viva.vivaDate),
                        vivaMarks:viva.vivaMarks
                        


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
        this.createVivaForm()


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






    dropdownOpenIndex: number | null = null;
    selectedId: Array<number | string | null> = [];
    selectedText: Array<string | null> = [];
    public _supplyUrl: string = 'reqform/getempbypage';


    empList: Array<{ id: number | string; text: string; }> = [];
    pageNumber: number = 1;
    pageSizes: number = 100;
    searchText: string = '';
    loading: boolean = false;
    finished: boolean = false;

    toggleDropdown(index: number, event?: MouseEvent) {
        if (event) {
            event.stopPropagation();
        }
        if (
            this.dropdownOpenIndex === index
        ) {

            this.dropdownOpenIndex = null;

            return;

        }
        this.dropdownOpenIndex = index;
        this.searchText = '';
        this.pageNumber = 1;
        this.finished = false;
        this.empList = [];
        this.loadSuppliers(true);

    }
    onSearch(text: string) {
        this.searchText = text;
        this.loadSuppliers(true);

    }
    loadSuppliers(reset: boolean = false) {
        if (this.loading) {
            return;
        }

        if (reset) {
            this.pageNumber = 1;
            this.finished = false;
            this.empList = [];
        }
        if (this.finished) {
            return;
        }

        this.loading = true;
        const param = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSizes,
            searchVal: this.searchText,
            LoggedUserId: this.userID
        };


        this._dataservice.getWithMultipleModel_Sync(this._supplyUrl, param)
            .then((response: any) => {
                debugger;
                this.loading = false;
                const data = JSON.parse(response.resdata.listEmp || '[]');
                if (!data || data.length === 0) {
                    this.finished = true;
                    return;
                }
                data.forEach((item: any) => {
                    const exists = this.empList.some(x => x.id === item.oid);
                    if (!exists) {
                        this.empList.push({
                            id: item.oid,
                            text: item.name
                        });
                    }
                });
            })
            .catch((err: any) => {
                console.error(
                    'loadExaminar error',
                    err
                );
                this.loading = false;
            });
    }


    selectOption(item: { id: any; text: string; }, index: number, event?: MouseEvent) {
        if (event) {
            event.stopPropagation();
        }
        this.selectedId[index] = item.id;
        this.selectedText[index] = item.text;
        const row = this.vivaBoardDetails.at(index) as FormGroup;
        row.get('examinarId')?.setValue(item.id); row
            .get('examinarId')
            ?.markAsTouched();
        this.dropdownOpenIndex = null;

    }

    isSelected(item: { id: any; }, index: number): boolean {
        const row = this.vivaBoardDetails.at(index) as FormGroup;
        return (
            row.get('examinarId')?.value ===
            item.id
        );

    }


    onScroll(event: any) {
        const el = event.target as HTMLElement;
        const thresholdPx = 40;
        const position = el.scrollTop + el.clientHeight;
        const height = el.scrollHeight;
        if (position + thresholdPx >= height && !this.loading && !this.finished) {
            this.pageNumber++;
            this.loadSuppliers(false);

        }

    }

    @HostListener(
        'document:click',
        ['$event']
    )
    onClickOutside(event: MouseEvent) {
        if (
            !this.elementRef
                .nativeElement
                .contains(event.target)
        ) {
            this.dropdownOpenIndex = null;
        }

    }




    //END ALL EMP 





}


