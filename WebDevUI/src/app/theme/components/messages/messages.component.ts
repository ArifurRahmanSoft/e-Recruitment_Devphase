import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MessagesService } from './messages.service';
import { DataService } from '../../../api/api.dataservice.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../../theme/components/commonservice/commonservice.component';
import { toDate } from 'date-fns/esm';
import { isToday } from 'date-fns';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None//,
  //providers: [MessagesService]
})

// export interface AppNotification {
//   id: number;
//   category: string;
//   title: string;
//   message: string;
//   fullMessage: string;
//   createdAt: Date;
//   attaendAt: Date | null;
//   isRead: boolean;
// }
export class MessagesComponent implements OnInit {
  @ViewChild('cmnsrv', { static: false }) _msg: CommonService;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @ViewChild('notificationDialog')
  notificationDialog!: TemplateRef<any>;



  public selectedTab: number = 1;
  public messages: Array<Object>;
  public files: Array<Object>;
  public meetings: Array<Object>;
  private LoggedUserId = sessionStorage.getItem("userID");



  //add
  id: number;
  category: string;
  title: string;
  message: string;
  fullMessage: string;
  createdAt: Date;
  attaendAt: Date;
  isRead: boolean;
  //end 











  constructor(private _dataservice: DataService,
    public dialog: MatDialog//,
    //private messagesService: MessagesService
  ) {
    //this.messages = messagesService.getMessages();
    //this.files = messagesService.getFiles();
    //this.meetings = messagesService.getMeetings();
    this.updateNotificationCount();
  }

  ngOnInit() {
    this.getNotification();
  }

  openMessagesMenu() {
    debugger
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

  public notiCount: number = 0;
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







  // public notificationUrl: string = 'candidateinfo/getnotificationbyid';
  // getNotification() {
  //   debugger
  //   var param = { LoggedUserId: this.LoggedUserId };
  //   var apiUrl = this.notificationUrl;
  //   this._dataservice.getWithMultipleModel(apiUrl, param)
  //     .subscribe(
  //       response => {
  //         var res = response;
  //         console.log("notificaton list is ",res)
  //         debugger;
  //         if (res.resdata.notificationList.length > 0) {
  //           var messageList = JSON.parse(res.resdata.notificationList);
  //            console.log("notificaton list is messageList",messageList)
  //           messageList.forEach(element => {

  //           })
  //           ;
  //           this.notiCount=messageList.length;

  //         }
  //       }, error => {
  //         console.log(error);
  //       });
  // }

  public AppNotification: any[] = []; 
  public notifications: any[] = [];

  public notificationUrl: string = 'candidateinfo/getnotificationbyid';

  //notifications: AppNotification[] = [];
  
 



  getNotification() {
    const param = {
      LoggedUserId: this.LoggedUserId
    };
     

    this._dataservice
      .getWithMultipleModel(this.notificationUrl, param)
      .subscribe({
        next: (response: any) => {
          console.log('Notification API response:', response);

          const notificationData = response?.resdata?.notificationList;
          

          // Handle JSON string or an already parsed array
          let messageList: any[] = [];

          if (typeof notificationData === 'string') {
            messageList = JSON.parse(notificationData || '[]');
             console.log('Notification API response notificationData:', messageList);
          } else if (Array.isArray(notificationData)) {
            messageList = notificationData;
          }

          // Convert API data to AppNotification[]
          this.notifications = messageList.map((item: any) => {
            const emailBody = item.emailBody || '';

            return {
              id: Number(item.oid),
              category: item.mailType || 'Email Notification',
              title: item.emailTitle || '',
              message:
                emailBody.length > 50
                  ? emailBody.substring(0, 200) + '...'
                  : emailBody,
              fullMessage: emailBody,
              createdAt: item.sentDate
                ? new Date(item.sentDate)
                : new Date(), 

                  attaendAt: item.attandDate
                ? new Date(item.attandDate)
                : null,  
              isRead:
                item.isView === true ||
                item.isView === 1 ||
                item.isView === '1' ||
                item.isView === 'true'
            };
          });

          //this.notiCount = this.notifications.length;
          this.notiCount = messageList.filter(
            (item: any) =>
              item.isView === 0 || item.isView === '0'
          ).length;

          console.log('Mapped notifications:', this.notifications);
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
  }





  public updateNotnUrl: string = 'candidateinfo/updatenotifacationid';
  updateNotification(notificationid: string) {
    const param = {
      strId: notificationid
    };

    this._dataservice
      .getWithMultipleModel(this.updateNotnUrl, param)
      .subscribe({
        next: (response: any) => {
          console.log('Notification API response:', response);
          const notificationData = response?.resdata?.notificationList;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
  }






  // notifications11: AppNotification[] = [
  //   {
  //     id: 1,
  //     category: 'প্রতিদিনের টিপস',
  //     title: '৮ মাস ১০ দিন চলছে',
  //     message:
  //       'গর্ভে শিশুর অবস্থানের কারণে যখন মূত্রথলিতে চাপ পড়ে, তখন প্রস্রাব ধরে রাখার জায়গা কমে যায়। একারণে এই সময়টায় ঘন ঘন প্রস্রাবের সমস্যা বেড়ে যেতে পারে...',
  //     fullMessage:
  //       'গর্ভে শিশুর অবস্থানের কারণে যখন মূত্রথলিতে চাপ পড়ে, তখন প্রস্রাব ধরে রাখার জায়গা কমে যায়। একারণে এই সময়টায় আপনার ঘন ঘন প্রস্রাবের সমস্যা বেড়ে যেতে পারে। রাতে ঘন ঘন প্রস্রাবের চাপ লাগাটা অস্বস্তির কারণ হতে পারে। রাতে ঘুমানোর কয়েক ঘণ্টা আগে পানি পান করা থেকে বিরত থাকতে পারেন। তবে দিনের বাকি সময়ে যেন পর্যাপ্ত পরিমাণে পানি পান করেন। এটি একটি ডেমো নোটিফিকেশন।',
  //     createdAt: new Date(Date.now() - 60 * 60 * 1000),
  //     isRead: false
  //   },
  //   {
  //     id: 2,
  //     category: 'প্রতিদিনের টিপস',
  //     title: '৮ মাস ৯ দিন চলছে',
  //     message:
  //       'মানসিক চাপ, পানিশূন্যতা ও হরমোনের প্রভাবে মাথাব্যথা হতে পারে। চিন্তা না করে নিজেকে একটু বিশ্রাম দিন...',
  //     fullMessage:
  //       'মানসিক চাপ, পানিশূন্যতা ও হরমোনের প্রভাবে মাথাব্যথা হতে পারে। নিজেকে একটু বিশ্রাম দিন এবং পর্যাপ্ত পানি পান করুন। মাথাব্যথা তীব্র হলে বা অন্য কোনো উদ্বেগজনক উপসর্গ দেখা দিলে চিকিৎসকের পরামর্শ নিন। এটি একটি ডেমো নোটিফিকেশন।',
  //     createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  //     isRead: false
  //   },
  //   {
  //     id: 3,
  //     category: 'প্রতিদিনের টিপস',
  //     title: '৮ মাস ৮ দিন চলছে',
  //     message:
  //       'প্রি-এক্লাম্পসিয়া গর্ভকালীন উচ্চ রক্তচাপজনিত একটি জটিলতা...',
  //     fullMessage:
  //       'প্রি-এক্লাম্পসিয়া গর্ভকালীন উচ্চ রক্তচাপজনিত একটি গুরুতর জটিলতা। এর লক্ষণগুলোর মধ্যে উচ্চ রক্তচাপ ও প্রস্রাবে প্রোটিন থাকা অন্তর্ভুক্ত হতে পারে। গর্ভাবস্থায় নিয়মিত চিকিৎসকের পরামর্শ ও পরীক্ষা গুরুত্বপূর্ণ। এটি একটি ডেমো নোটিফিকেশন।',
  //     createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  //     isRead: false
  //   },
  //   {
  //     id: 4,
  //     category: 'প্রতিদিনের টিপস',
  //     title: '৮ মাস ৭ দিন চলছে',
  //     message:
  //       'গর্ভাবস্থায় সিঁড়ি দিয়ে ওঠানামা করা যাবে কি? কিছু সতর্কতা মেনে চলুন...',
  //     fullMessage:
  //       'গর্ভাবস্থায় সিঁড়ি দিয়ে ওঠানামা করা অনেকের জন্য সম্ভব। তবে ভারসাম্য বজায় রাখুন, রেলিং ধরুন এবং মাথা ঘোরা বা অন্য কোনো সমস্যা থাকলে সতর্ক থাকুন। আপনার ব্যক্তিগত শারীরিক অবস্থার জন্য চিকিৎসকের পরামর্শ অনুসরণ করুন। এটি একটি ডেমো নোটিফিকেশন।',
  //     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  //     isRead: true
  //   },
  //   {
  //     id: 5,
  //     category: 'অ্যাকাউন্ট আপডেট',
  //     title: 'আপনার প্রোফাইল আপডেট করুন',
  //     message:
  //       'আপনার প্রোফাইলের প্রয়োজনীয় তথ্যগুলো যাচাই করে আপডেট করুন...',
  //     fullMessage:
  //       'আপনার প্রোফাইলের প্রয়োজনীয় তথ্যগুলো যাচাই করে আপডেট করুন। সঠিক তথ্য থাকলে আপনার অ্যাকাউন্ট ব্যবহার আরও সহজ হবে। এটি একটি ডেমো নোটিফিকেশন।',
  //     createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  //     isRead: true
  //   }
  // ];

  //selectedNotification: AppNotification | null = null;
  public selectedNotification: any = null;

  currentNotificationIndex = 0;
  //notiCount = 0;

  private dialogRef?: MatDialogRef<any>;


  updateNotificationCount(): void {
    this.notiCount = this.notifications.filter(
      item => !item.isRead
    ).length;
  }

  onNotificationMenuOpened(): void {
    this.updateNotificationCount();
  }


  openNotification(item: any): void {
    debugger
    const index = this.notifications.findIndex(
      notification => notification.id === item.id
    );
    this.updateNotification(item.id)

    if (index === -1) {
      return;
    }

    this.currentNotificationIndex = index;
    this.selectedNotification = this.notifications[index];


    this.markAsRead(this.selectedNotification);

    this.dialogRef = this.dialog.open(
      this.notificationDialog,
      {
        width: '640px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'notification-dialog-panel',
        autoFocus: false,
        restoreFocus: true
      }
    );
  }


  markAsRead(item: any): void {
    item.isRead = true;
    this.updateNotificationCount();
  }


  markAllAsRead(): void {
    this.notifications.forEach(item => {
      item.isRead = true;
    });

    this.updateNotificationCount();
  }


  showPreviousNotification(): void {
    if (this.currentNotificationIndex <= 0) {
      return;
    }

    this.currentNotificationIndex--;

    this.setSelectedNotification();
  }


  showNextNotification(): void {
    if (
      this.currentNotificationIndex >=
      this.notifications.length - 1
    ) {
      return;
    }

    this.currentNotificationIndex++;

    this.setSelectedNotification();
  }

  private setSelectedNotification(): void {
    const item = this.notifications[
      this.currentNotificationIndex
    ];

    this.selectedNotification = item;
    this.markAsRead(item);
  }

  closeNotification(): void {
    this.dialogRef?.close();
  }


  getRelativeTime(date: Date): string {
    const diff = Math.max(
      0,
      Date.now() - new Date(date).getTime()
    );

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }

    if (hours < 24) {
      return `${hours} hours ago`;
    }

    return `${days} days ago`;
  }

  trackByNotificationId(
    index: number,
    item: any
  ): number {
    return item.id;
  }























}


































