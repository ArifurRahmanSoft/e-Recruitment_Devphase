import { Component, OnInit } from '@angular/core';
import { LcDutyService } from 'src/app/api/lc-duty/lc-duty.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-duty-admin',
  templateUrl: './duty-admin.component.html',
  styleUrls: ['./duty-admin.component.scss']
})
export class DutyAdminComponent implements OnInit {
  private userID = sessionStorage.getItem("userID");
  public dtOptions: DataTables.Settings = {};
  public displayStart = 0;
  public isLoaded: Object = true;
  public favouringList : any;
  public isAddBtnDisabled = false;
  public isUpdateBtnDisabled = true;
  public isDeleteBtnDisabled = false;
 
  public favouringOID = "xxx001";
  public favouringName;
  public favouringAddress;
  public favouringContact;
  public favouringEmail;
  public checkboxFlag = true;
  public status = true;
  public roleId;
  


  constructor(private api: LcDutyService, private toastr: ToastrService) { 

  }

  ngOnInit(): void {

    this.dtOptions = {
      order: [[0, 'null']],
      "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
      'displayStart': this.displayStart,
      "paging":   false,
      "ordering": false,
      "info":     false,
      "searching" : false
    };

    this.getFavouring();



  }


  public getFavouring(){
      this.api.getAllFavouring()
       .subscribe((data: Response) => {
        this.favouringList = data;
        this.isLoaded = true;
       });
    
   }


  public addFavouring(){

   if(this.checkValidity()){
     var oid = "xxx001";
     var status = this.getStatus();
     var currentDate = this.getCurrentDate();
     var mode = "save";

     this.api.insertFavouring(oid, this.favouringName, this.favouringAddress, this.favouringContact, this.favouringEmail, currentDate, status,  this.userID , mode)
      .subscribe((data: Response) => {
        var message = data.toString();
        if(message == "1"){
          this.toastr.success("Favouring created successfully !!!", 'SUCCESS!'); // message , title     error, info, warning, success
          this.clearData();
          this.emptyData();
          this.getFavouring();
        }else {
          this.toastr.error(message, 'OPPS!'); // message , title     error, info, warning, success
        }
      });
   }

   
  }

  public cancel(){
    this.clearData();
  }




  public updateFavouring(){

    if(this.checkValidity()){
     
      var oid = this.favouringOID;
      var status = this.getStatus();
      var currentDate = this.getCurrentDate();
      var mode = "edit";
 
      this.api.insertFavouring(oid, this.favouringName, this.favouringAddress, this.favouringContact, this.favouringEmail, currentDate, status,  this.userID , mode)
       .subscribe((data: Response) => {
         var message = data.toString();
         if(message == "1"){
           this.toastr.success("Favouring update successfully !!!", 'SUCCESS!'); // message , title     error, info, warning, success
           this.clearData();
           this.emptyData();
           this.getFavouring();
         }else {
           this.toastr.error(message, 'OPPS!'); // message , title     error, info, warning, success
         }
       });
    }
  }


  public deleteFavouring(roleId: string){

    // if (confirm("Are you sure to delete this role? ")) {
    //   this.api.deleteRole(roleId, this.userID)
    //     .subscribe((data: Response) => {
    //       var message = data.toString();
    //       if (message == "The Role cancelled successfully") {
    //         this.toastr.success(message, 'SUCCESS!'); // message , title     error, info, warning, success
    //         this.clearData();
    //         this.emptyData();
    //         this.getFavouring();
    //       } else {
    //         this.toastr.error(message, 'OPPS!'); // message , title     error, info, warning, success
    //       }
    //     });
    // }

    
  }



  public setUpdateData(FAV_NAME, FAV_ADDRESS, CONTACT_NUMBER, FAV_EMAIL, FAV_OID, IS_ACTIVE){

    this.favouringName = FAV_NAME;
    this.favouringAddress = FAV_ADDRESS;
    this.favouringContact = CONTACT_NUMBER;
    this.favouringEmail = FAV_EMAIL;
    this.favouringOID = FAV_OID;
    var isActive = IS_ACTIVE;

    if(isActive.toString() == "1"){
      this.checkboxFlag = true;
    }else {
      this.checkboxFlag = false;
    }

    this.isAddBtnDisabled = true;
    this.isUpdateBtnDisabled = false;
    this.isDeleteBtnDisabled = true;
  }








  public checkValidity(){
    if(this.favouringName == null || this.favouringName == ""){
      this.toastr.error("Please enter a valid role name", 'OPPS!'); // message , title     error, info, warning, success
      return false;

    }else if(this.favouringAddress == null || this.favouringAddress == ""){
      this.toastr.error("Please enter a valid address", 'OPPS!'); // message , title     error, info, warning, success
      return false;

    }else {
      return true;
    }
  }

  public getStatus(){
    if(this.checkboxFlag){
      return "1";

    }else {
      return "0";
    }
  }

  public clearData(){
    this.favouringName = "";
    this.favouringAddress = "";
    this.favouringContact = "";
    this.favouringEmail = "";
    this.checkboxFlag = true;
    this.isAddBtnDisabled = false;
    this.isUpdateBtnDisabled = true;
    this.isDeleteBtnDisabled = false;
    
  }

  public emptyData(){
    this.favouringList = [];
    this.isLoaded = false;
  }


  public getCurrentDate(){

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    var retDate = dd + '/' + mm + '/' + yyyy;
    return retDate;
    }

}
