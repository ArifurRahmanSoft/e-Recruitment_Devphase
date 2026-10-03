import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';

import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true               
};

import { CalendarModule, DateAdapter } from 'angular-calendar';
import * as tslib_1 from 'tslib';
import * as date_fns_2 from 'date-fns'; 
export const adFactory= (adapterFactory)=> {
  return tslib_1.__assign(tslib_1.__assign({}),date_fns_2);
}

import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { AppRoutingModule } from './app.routing';

import { AppSettings } from './app.settings';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';

import { TopInfoContentComponent } from './theme/components/top-info-content/top-info-content.component';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { ReportViewer } from './project_component/reportviewer/reportviewer';
import {CommonService, CommonButtonOption} from './theme/components/commonservice/commonservice.component';
import {CommonPager, PagerSize} from './theme/components/commonpager/commonpager';
import {CmnDocModal, DocUpload} from './theme/components/documentupload/documentupload';
import {ConfirmModal} from './theme/components/modalconfirm/confirmmodal.component';
import { pathValidation } from './api/api.pathvlidation.service';
import { ApiService } from './api/api.service';
import { DataService } from './api/api.dataservice.service';


import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { UpdatePasswordComponent } from './project_component/update-password/update-password.component';

import { NgSelect2Module } from 'ng-select2';
import { DataTablesModule } from 'angular-datatables';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { HomeComponent } from './project_component/home/home.component';

import { NgxDocViewerModule } from  'ngx-doc-viewer';
import { DashboardComponent } from './project_component/dashboard/dashboard.component';

import { ClientTypeComponent } from './project_component/businessSetup/clientType/clienttype.component';
import { ClientComponent } from './project_component/businessSetup/client/client.component';
import { WorkOrderComponent } from './project_component/businessSetup/workorder/workorder.component';
import { DatePipe } from '@angular/common';
import {UtilService} from '../app/util/util.service'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import {AuthGuard} from './guard/auth.guard';
import {RoleGuard} from './guard/role.guard';
import {AdminGuard} from './guard/admin.guard';
import {AuthService} from './service/auth.service';
import {RoleService} from './service/role.service';
import {AdminService} from './service/admin.service';
import { RoleComponent } from './project_component/security/role/role.component';
import { MenuComponent } from './project_component/security/menu/menu.component';

import { UserRoleComponent } from './project_component/security/user-role/user-role.component';


//import { Select2Module } from "ng-select2-component";


import { NgxUiLoaderModule } from "ngx-ui-loader";

import { NgxSpinnerModule } from "ngx-spinner";
import { ChartsModule } from 'ng2-charts';
import { UserSetupComponent } from './project_component/security/userSetup/userSetup.component';
import { JobPostComponent } from './project_component/jobpost/jobpost.component';
import { ApplyComponent } from './project_component/apply/apply.component';
import { ApplicantFormsComponent } from './project_component/applicantforms/applicantforms.component';
import { candidateComponent } from './project_component/candidate/candidate.component';
import { ProfileComponent } from './project_component/profile/profile.component';
import { ApplicationComponent } from './project_component/ApplicationInfo/application.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ApplicanttrackerComponent } from './project_component/Applicanttracker/applicanttracker.component';
import { BusinessTypeComponent } from './project_component/businesstype/businesstype.component';
import { ApprovalRoleComponent } from './project_component/security/approval-roleSetup/approval-role.component';
import { ExaminerSetupComponent } from './project_component/examinerSetup/examinerSetup.component';
import { ApprovalprocessComponent } from './project_component/Approvalprocess/approvalprocess.component'; 
import { EnrollmentComponent } from './project_component/enrollment/enrollment.component';
import { VivaBoardSetupComponent } from './project_component/vivaboardsetup/vivaboardsetup.component';
import { VivaEvaluationComponent } from './project_component/vivaevaluation/vivaevaluation.component';
import { VivaDimensionSetupComponent } from './project_component/vivadimension/vivadimensionsetup.component';
import { ApprovalHedofBusinessUnitComponent } from './project_component/ApprovalHofBUnit/ApprovalHofBUnit.component';
import { ApprovalHrLeadComponent } from './project_component/ApprovalHrLead/ApprovalHrLead.component';
import { ApprovalHrDirectorComponent } from './project_component/ApprovalHrDirector/ApprovalHrDirector.component';
import { AppoinmentComponent } from './project_component/appointment/appoinment.component';


//import { ApplicantFormsComponent } from './project_component/applicant/applicant/applicantforms.component';

//import { HomesComponent } from './pages/homes/homes.component';








@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA1rF9bttCxRmsNdZYjW7FzIoyrul5jb-s'
    }), 
    PerfectScrollbarModule,     
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adFactory
    }),
    SharedModule,
    PipesModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgSelect2Module,
   
    DataTablesModule,
    NgxChartsModule,
    NgxPaginationModule,
    NgxDocViewerModule
    //,GeocoderModule
    ,NgxUiLoaderModule
    ,NgxSpinnerModule
    ,ChartsModule

    
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
    
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    ErrorComponent,
    TopInfoContentComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UpdatePasswordComponent,
    UserMenuComponent,
    HomeComponent,
    //HomesComponent,
    DashboardComponent,
    RoleComponent,
    MenuComponent,
    UserRoleComponent,
    ApprovalRoleComponent,
    VivaDimensionSetupComponent
   
//,ApplicantFormsComponent

    ,ReportViewer
    ,ConfirmModal
    ,CommonService
    ,CommonButtonOption
    ,PagerSize
    ,CommonPager
    ,CmnDocModal
    ,DocUpload 
   
    ,UserSetupComponent
 
   

   



    ,ClientTypeComponent
    ,ClientComponent
    ,WorkOrderComponent
    ,JobPostComponent
    ,BusinessTypeComponent
    ,candidateComponent
    ,ApplyComponent
    ,ProfileComponent
    ,ApplicantFormsComponent
    ,ApplicationComponent
    ,ApplicanttrackerComponent
    ,ApprovalprocessComponent
    ,ApprovalHedofBusinessUnitComponent
    ,ApprovalHrDirectorComponent
    ,ApprovalHrLeadComponent
    ,ExaminerSetupComponent
    ,EnrollmentComponent
    ,VivaBoardSetupComponent
    ,VivaEvaluationComponent
    ,AppoinmentComponent
    


   

 
  ],
  exports: [
    
  ],
  entryComponents: [
    CmnDocModal,
    VerticalMenuComponent,
    ConfirmModal//,
    // ModalJournal,
    // ModalExpense
  ],
  providers: [
    AppSettings,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    pathValidation,
    ApiService,
    DataService,
    //LcDutyService,
    DatePipe,
    UtilService,
    AuthGuard, RoleGuard, AdminGuard, AuthService, RoleService, AdminService
  ],
  bootstrap: [
    AppComponent
  ]
})


export class AppModule {
  
}




