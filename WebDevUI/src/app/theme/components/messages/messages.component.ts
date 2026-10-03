import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessagesService } from './messages.service';
import { DataService } from '../../../api/api.dataservice.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None//,
  //providers: [MessagesService]
})
export class MessagesComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public selectedTab: number = 1;
  public messages: Array<Object>;
  public files: Array<Object>;
  public meetings: Array<Object>;
  private LoggedUserId = sessionStorage.getItem("userID");
  constructor(private _dataservice: DataService, 
    public dialog: MatDialog//,
    //private messagesService: MessagesService
    ) {
    //this.messages = messagesService.getMessages();
    //this.files = messagesService.getFiles();
    //this.meetings = messagesService.getMeetings();
  }

  ngOnInit() {
    this.getNotification();
  }

  openMessagesMenu() {
    this.trigger.openMenu();
    this.selectedTab = 0;
  }

  onMouseLeave() {
    this.trigger.closeMenu();
  }

  stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public notiCount:number=0;
  public aprvMessages: any = [];
  public dclnMessages: any = [];
  // public notificationUrl: string = 'ProcessFlow/getapprovalcommentsbyloggeduser';
  // getNotification() {
  //   var param = { LoggedUserId: this.LoggedUserId };
  //   var apiUrl = this.notificationUrl;
  //   this._dataservice.getWithMultipleModel(apiUrl, param)
  //     .subscribe(
  //       response => {
  //         var res = response;
  //         debugger;
  //         if (res.resdata.commentsList.length > 0) {
  //           var messageList = JSON.parse(res.resdata.commentsList);
  //           messageList.forEach(element => {
  //             element.isApproved=element.isApproved=='1'?true:false;
  //             element.isDeclined=element.isDeclined=='1'?true:false;
  //             element.name=element.fromUser;
  //             element.text=element.comment;
  //             element.time='1 min ago';
  //           })
  //           ;
  //           this.notiCount=messageList.length;
  //           this.aprvMessages = messageList.filter(x => x.isApproved == true);
  //           this.dclnMessages = messageList.filter(x => x.isDeclined == true);
  //         }
  //       }, error => {
  //         console.log(error);
  //       });
  // }

    public notificationUrl: string = 'candidateinfo/getnotificationbyid';
  getNotification() {
    var param = { LoggedUserId: this.LoggedUserId };
    var apiUrl = this.notificationUrl;
    this._dataservice.getWithMultipleModel(apiUrl, param)
      .subscribe(
        response => {
          var res = response;
          console.log("notificaton list is ",res)
          debugger;
          if (res.resdata.notificationList.length > 0) {
            var messageList = JSON.parse(res.resdata.notificationList);
            messageList.forEach(element => {
              element.officialMessage=element.officialMessage
              element.isWritten=element.isWritten=='1'?true:false;
              element.isViva=element.isViva=='1'?true:false;
              element.isSelected=element.isSelected=='1'?true:false;
              element.name=element.email;
              element.text=element.officialMessage;
              element.time='1 min ago';
            })
            ;
            this.notiCount=messageList.length;
            // this.aprvMessages = messageList.filter(x => x.isApproved == true);
            // this.dclnMessages = messageList.filter(x => x.isDeclined == true);
          }
        }, error => {
          console.log(error);
        });
  }

  public appModel: any;
    public urlComment: string = 'ProcessFlow/getapprovalcomments';
    getCommentList(ev, model) {
        debugger;
        ev.preventDefault();
        var param = { loggedUserId: this.LoggedUserId, strId: model.quotationId, strId2: model.categoryId };
        var ModelsArray = [param];
        var apiUrl = this.urlComment;
        this._dataservice.getWithMultipleModel(apiUrl, ModelsArray)
            .subscribe(response => {
                var res = response;
                debugger;
                //this.resmessage = this.res.resdata.message;
                if (res.resdata.tranMstr != null) {
                    this.appModel = res.resdata.tranMstr;
                    this.appModel.commentList = JSON.parse(res.resdata.tranDtl);
                    //this.trigger.closeMenu();
                    this.openAppModaDialog();
                } //else {
                //this._msg.warning(this.resmessage);
                //}
            }, error => {
                console.log(error);
            });
    }

  //Aproval Process
  @ViewChild('modalApprovalProcessed') modalApprovalProcess: TemplateRef<any>;
  private _appDialogRef: MatDialogRef<TemplateRef<any>>;
  openAppModaDialog(): void {
      const _config = new MatDialogConfig();
      _config.restoreFocus = false;
      _config.autoFocus = false;
      _config.role = 'dialog';
      _config.width = '40%';
      _config.panelClass = 'modalTopPosition';

      //modaltype != '' ? this.createModalForm(modaltype) : null;

      this._appDialogRef = this.dialog.open(this.modalApprovalProcess, _config);

      this._appDialogRef.afterClosed().subscribe(result => {
          //this.resetModal();
          this.appModel = undefined;
          this.getNotification();
      });
  }

  public _urlForward: string = 'ProcessFlow/processforwardonly';
  submitForward(model) {
      debugger;
      var dModel = this.appModel.commentList.filter(x => x.processFlowDetailId == model.processFlowDetailId && x.processTypeId == model.processTypeId && x.sequences == model.currentSequence && x.userId == model.userId)[0];
      var pModel = { transactionId: dModel.transactionId, transactionDetailId: dModel.transactionDetailId, quotationId: dModel.quotationId, categoryId: dModel.categoryId, processFlowId: dModel.processFlowId, processFlowDetailId: dModel.processFlowDetailId, processTypeId: dModel.processTypeId, sequences: dModel.sequences, fromUserId: dModel.fromUserId, toUserId: dModel.toUserId, userId: dModel.userId };
      var param = { loggedUserId: this.LoggedUserId, strId: model.quotationId, strId2: model.categoryId, values: this.appModel.comments };
      var ModelsArray = [param, pModel];
      var apiUrl = this._urlForward;
      this._dataservice.postMultipleModel(apiUrl, ModelsArray)
          .subscribe(response => {
              var res = response;
              var resmessage = res.resdata.message;
              if (res.resdata.resstate) {                  
                  this._msg.success(resmessage);                  
              } else {
                  this._msg.warning(resmessage);
              }
          }, error => {
              console.log(error);
          });
  }

  public _urlBackwar: string = 'ProcessFlow/processbackwardonly';
  submitBackward(model) {
      debugger;
      var dModel = this.appModel.commentList.filter(x => x.processFlowDetailId == model.processFlowDetailId && x.processTypeId == model.processTypeId && x.sequences == model.currentSequence && x.userId == model.userId)[0];
      var pModel = { transactionId: dModel.transactionId, transactionDetailId: dModel.transactionDetailId, quotationId: dModel.quotationId, categoryId: dModel.categoryId, processFlowId: dModel.processFlowId, processFlowDetailId: dModel.processFlowDetailId, processTypeId: dModel.processTypeId, sequences: dModel.sequences, fromUserId: dModel.fromUserId, toUserId: dModel.toUserId, userId: dModel.userId };
      var param = { loggedUserId: this.LoggedUserId, strId: model.quotationId, strId2: model.categoryId, values: this.appModel.comments };
      var ModelsArray = [param, pModel];
      var apiUrl = this._urlBackwar;
      this._dataservice.postMultipleModel(apiUrl, ModelsArray)
          .subscribe(response => {
              var res = response;
              var resmessage = res.resdata.message;
              if (res.resdata.resstate) {
                  this._msg.success(resmessage);
              } else {
                  this._msg.warning(resmessage);
              }
          }, error => {
              console.log(error);
          });
  }
  //Aproval Process

}
