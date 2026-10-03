import { Component, OnInit, Output, EventEmitter, Inject, ViewChild, ElementRef, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Conversion } from '../../../api/api.conversion.service';

@Component({
    selector: 'doc-upload',
    templateUrl: './documentupload.html',
    providers: [Conversion]
})

export class CmnDocModal implements OnInit {
    @ViewChild('fileInput') _fileInput: ElementRef;

    public referenceId: any;
    public docEntity: any;
    public docList: any = [];
    public docHoldList: any = [];
    public remarks: string = '';
    public fileName: string = '';
    public docPath: string = '';
    public docVPath: string = '';
    public docType: string = '';
    public docExt: string = '';
    public docSize: any;
    public attachedFile: any = null;
    public IsDocAddDisabled: boolean = true;
    fileTypeList: Array<{ value: string, label: string }> = [
  { value: '1', label: 'Photo' },
  { value: '2', label: 'Signature' },
  { value: '3', label: 'NID (Front)' },
  { value: '4', label: 'NID (Back)' },
  { value: '5', label: 'Tin' },
  { value: '6', label: 'CV' },
];

  public fileType:any;


    docSubmit: EventEmitter<any> = new EventEmitter();

    constructor(
        private _conversion: Conversion,
        public dialogRef: MatDialogRef<CmnDocModal>, @Inject(MAT_DIALOG_DATA) public data: any,
        private toastr: ToastrService) {
        this.docList = data.docList;
        this.docEntity = data.docEntity;
        this.referenceId = data.referenceId;
    }

    ngOnInit() { }

     setfileType(value: string): void {
        debugger
          this.fileType=value;
        console.log("file type is ",this.fileType)
 
    }

    public fileTypes: any = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "txt", "csv", "xls", "xlsx", "ppt", "pptx"];

    onFileChange() {
        debugger;
       
        this.IsDocAddDisabled = true;
        this.docHoldList = [];
        //var fileInfo=this._fileInput;
        //let reader = new FileReader();
        if (this._fileInput.nativeElement.files.length > 0) {
            for (var i = 0; i < this._fileInput.nativeElement.files.length; i++) {

                let file = this._fileInput.nativeElement.files[i];

                var arryext = file.name.split(".");
                var ext = arryext[arryext.length - 1];
                var extlwr = ext.toLowerCase();
                var fileIndex = this.fileTypes.indexOf(extlwr);
                var fileSize = file.size / 1024 / 1024; // in MB
               
                //var fileType = file.type;
                if (fileSize > 5) {
                    this.toastr.error('File size exceeds 5 MB', 'File Upload Error!');
                } else if (fileIndex === -1) {
                    this.toastr.error('File type not supported. Valid file types are ' + this.fileTypes, 'File Type Error!');
                } 
              
                else {

                    this.docHoldList.push({
                        documentId: 0,
                        referenceId: this.referenceId,
                        originalDocName: file.name,
                        documentName: file.name,
                        documentType: extlwr,
                        documentSize: fileSize,
                        attachedfile: file,
                        documentPath: this.docEntity.menuPath,
                        basePath: '',
                        documentFullPath: '',
                        virtualPath: '',
                        isActive: true,
                        isDelete: false,
                        createBy: this.docEntity.userId,
                        fileType:this.fileType
                    });

                    //this.IsDocAddDisabled = false;
                }
            };
            console.log(" this.docHoldList", this.docHoldList)

            this.IsDocAddDisabled = this.docHoldList.length > 0 ? false : true;
        }

    }

    addDocumnet() {
          const fileTypeExists = this.docList.some(doc => doc.fileType == this.fileType);
               if (fileTypeExists) {
                alert('This file type already exists.');
                return
                }
        debugger
        this.docHoldList.forEach(item => {
            this.docList.push({
                documentId: item.documentId,
                referenceId: item.referenceId,
                originalDocName: item.originalDocName,
                documentName: item.documentName,
                documentType: item.documentType,
                documentSize: item.documentSize,
                attachedfile: item.attachedfile,
                documentPath: item.documentPath,
                basePath: item.basePath,
                documentFullPath: item.documentFullPath,
                virtualPath: item.virtualPath,
                isActive: item.isActive,
                isDelete: item.isDelete,
                createBy: item.createBy,
                fileType:item.fileType
            });
        });

        this.docHoldList = [];
        this._fileInput.nativeElement.value = "";
        this.IsDocAddDisabled = true;
    }

    delectDocument(index, item) {
        if (item.documentId == 0) {
            this.docList.splice(index, 1);
        }
        else {
            item.isDelete = item.isDelete == false ? true : false;
        }
    }

    closeDocumnet() {
        this.dialogRef.close({ docList: this.docList });
    }

    viewDocument(item) {
        this._conversion.viewDocument(item.virtualPath);
    }
}

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataService } from '../../../api/api.dataservice.service';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Options } from 'ngx-bootstrap/positioning/models';
@Component({
    selector: 'doc-up',
    template: '<button mat-button style="color:#4a4a4a; font-weight:bold; width:55%" color="primary" class="mat-focus-indicator mat-stroked-button mat-button-base mat-primary" (click)="openDocModalialog()"><mat-icon class="menu-icon">attach_file</mat-icon><span class="menu-title">Attachment</span><span *ngIf="documentList.length>0"> ({{documentList.length}})</span></button>'
})

export class DocUpload {
    @Input() cmnEntity: any;
    @Input() referenceId: any;
    public res: any;
    public resState: boolean = false;
    @Input() documentList: any;
   
      public options: Options;
 

    private _dataservice: any;
    private _dialogRefDoc: MatDialogRef<any>;
    constructor(private _http: HttpClient, @Inject(DOCUMENT) private document: any, public dialog: MatDialog) {
        this._dataservice = new DataService(_http, document);
    }

    openDocModalialog() {
        debugger
        const _config = new MatDialogConfig();
        _config.restoreFocus = false;
        _config.autoFocus = false;
        _config.role = 'dialog';
        _config.width = '40%';
        _config.data = { docList: this.documentList, docEntity: this.cmnEntity, referenceId: this.referenceId };

        this._dialogRefDoc = this.dialog.open(CmnDocModal, _config);

        this._dialogRefDoc.afterClosed().subscribe(result => {
            debugger;
            if (result != '' && result != undefined) {
                var rs = result;
                this.documentList = rs.docList;
            }
        });
    }


    public _saveFormUrl: string = 'documentUpload/saveupdateform--';
    onSubmitDoc() {
        var formData = new FormData();
        this.documentList.forEach(item => {
            item.referenceId = this.referenceId;
        });

        var ModelsArray = [this.documentList];
        this.documentList.forEach(item => {
            formData.append('docFile', item.attachedfile);
        });

        var apiUrl = this._saveFormUrl;
        this._dataservice.postMultipleModelForm_Sync(apiUrl, ModelsArray, formData)
            .then(response => {
                this.res = response;
                if (this.res.resdata.resstate) {
                    this.documentList = [];
                }
            }, error => {
                console.log(error);
            });
    }
}