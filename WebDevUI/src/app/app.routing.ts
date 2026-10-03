import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { UpdatePasswordComponent } from './project_component/update-password/update-password.component';
import { HomeComponent } from './project_component/home/home.component';
import { DashboardComponent } from './project_component/dashboard/dashboard.component';








import { ClientTypeComponent } from './project_component/businessSetup/clientType/clienttype.component';
import { ClientComponent } from './project_component/businessSetup/client/client.component';
import { WorkOrderComponent } from './project_component/businessSetup/workorder/workorder.component';
import { JobPostComponent } from './project_component/jobpost/jobpost.component';
import { candidateComponent } from './project_component/candidate/candidate.component';
import { ApplyComponent } from './project_component/apply/apply.component';
import { ProfileComponent } from './project_component/profile/profile.component';
import { ApplicantFormsComponent } from './project_component/applicantforms/applicantforms.component';







import { AuthGuard } from '../app/guard/auth.guard';
import { RoleGuard } from '../app/guard/role.guard';
import { RoleComponent } from './project_component/security/role/role.component';
import { MenuComponent } from './project_component/security/menu/menu.component';
//import { RoleMenuComponent } from './project_component/security/role-menu/role-menu.component';
import { UserRoleComponent } from './project_component/security/user-role/user-role.component';
import { UserSetupComponent } from './project_component/security/userSetup/userSetup.component';
import { ApplicationComponent } from './project_component/ApplicationInfo/application.component';
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

 
export const routes: Routes = [
    // { path: 'updatePassword', component: UpdatePasswordComponent },
    // { path: 'home', component: HomeComponent  },
    // { path: 'dashboard', component: DashboardComponent},
    // { path: 'security/role', component: RoleComponent },
    // { path: 'security/menu', component: MenuComponent},
    // { path: 'security/userSetup', component: UserSetupComponent},
    // { path: 'security/userRoleAssign', component: UserRoleComponent},

    { 
        path: '',  
        component: PagesComponent, children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: '', redirectTo: '/register', pathMatch: 'full' },
            { path: '', redirectTo: '/forgotpassword', pathMatch: 'full' },
            { path: '', redirectTo: '/verifyotp', pathMatch: 'full' },
            { path: '', redirectTo: '/changepass', pathMatch: 'full' },
            { path: '', redirectTo: '/requirement', pathMatch: 'full' },
    
            

            { path: 'icons', loadChildren: () => import('./pages/icons/icons.module').then(m => m.IconsModule), data: { breadcrumb: 'Material Icons' } },
            { path: 'updatePassword', component: UpdatePasswordComponent, canActivate: [AuthGuard] },
            { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
            { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
            { path: 'security/role', component: RoleComponent, canActivate: [AuthGuard] },
            { path: 'security/menu', component: MenuComponent, canActivate: [AuthGuard]},
            { path: 'security/userSetup', component: UserSetupComponent, canActivate: [AuthGuard]},
            { path: 'security/userRoleAssign', component: UserRoleComponent, canActivate: [AuthGuard]},
             { path: 'security/approvalRoleAssign', component: ApprovalRoleComponent, canActivate: [AuthGuard]},
           // { path: 'businessSetup/workorder', component: WorkOrderComponent, canActivate: [AuthGuard]},
           // { path: 'applicant/applicantforms',component: ApplicantFormsComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/applicant/applicantforms']} },//, RoleGuard






        
           { path: 'businessSetup/clienttype', component: ClientTypeComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/businessSetup/clienttype']} },//, RoleGuard
           { path: 'businessSetup/client', component: ClientComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/businessSetup/client']} },//, RoleGuard
           { path: 'businessSetup/workorder', component: WorkOrderComponent, canActivate: [AuthGuard], data: {roles: ['/businessSetup/workorders']} },
           { path: 'jobPost', component: JobPostComponent, canActivate: [AuthGuard], data: {roles: ['/jobPost']} },
           { path: 'businessConfiguraton/businessSetup', component: BusinessTypeComponent, canActivate: [AuthGuard], data: {roles: ['/businessConfiguraton/businessSetup']} },
           { path: 'businessConfiguraton/examinerSetup', component: ExaminerSetupComponent, canActivate: [AuthGuard], data: {roles: ['/businessConfiguraton/examinerSetup']} },
           { path: 'businessConfiguraton/vivaboardsetup', component: VivaBoardSetupComponent, canActivate: [AuthGuard], data: {roles: ['/businessConfiguraton/vivaboardsetup']} },
           { path: 'businessConfiguraton/vivadimensionsetup', component: VivaDimensionSetupComponent, canActivate: [AuthGuard], data: {roles: ['/businessConfiguraton/vivadimensionsetup']} },

           { path: 'candidate', component: candidateComponent, canActivate: [AuthGuard], data: {roles: ['/candidate']} },
           { path: 'apply', component: ApplyComponent, canActivate: [AuthGuard], data: {roles: ['/apply']} },
           { path: 'applicationInfo', component: ApplicationComponent, canActivate: [AuthGuard], data: {roles: ['/applicationInfo']} },
           { path: 'applicantTracker', component: ApplicanttrackerComponent, canActivate: [AuthGuard], data: {roles: ['/applicantTracker']} },
           { path: 'approvalprocess', component: ApprovalprocessComponent, canActivate: [AuthGuard], data: {roles: ['/approvalprocess']} },
            { path: 'ApprovalHofBUnit', component: ApprovalHedofBusinessUnitComponent, canActivate: [AuthGuard], data: {roles: ['/ApprovalHofBUnit']} },
             { path: 'ApprovalHrLead', component: ApprovalHrLeadComponent, canActivate: [AuthGuard], data: {roles: ['/ApprovalHrLead']} },
              { path: 'ApprovalHrDirector', component: ApprovalHrDirectorComponent, canActivate: [AuthGuard], data: {roles: ['/ApprovalHrDirector']} },

               { path: 'appoinment', component: AppoinmentComponent, canActivate: [AuthGuard], data: {roles: ['/appoinment']} },

            { path: 'enrollment', component: EnrollmentComponent, canActivate: [AuthGuard], data: {roles: ['/enrollment']} },

           { path: 'profile/addProfile', component: ProfileComponent, canActivate: [AuthGuard], data: {roles: ['/profile/addProfile']} },
           { path: 'applicantforms', component: ApplicantFormsComponent, canActivate: [AuthGuard], data: {roles: ['/applicantforms']} },
           { path: 'vivaevaluation', component: VivaEvaluationComponent, canActivate: [AuthGuard], data: {roles: ['/vivaevaluation']} }
           //{ path: 'businessSetup/workorder', component: WorkOrderComponent, canActivate: [AuthGuard, RoleGuard], data: {roles: ['/businessSetup/workorder']} },//, RoleGuard
          
          
           
         
        ]
    },  
    { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
    { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) },
      { path: 'forgotpassword', loadChildren: () => import('./pages/forgotpass/forgotpass.module').then(m => m.ForgotPassModule) },
       { path: 'verifyotp', loadChildren: () => import('./pages/verifyotp/verifyotp.module').then(m => m.VerifyOtpModule) },
        { path: 'changepass', loadChildren: () => import('./pages/changepassword/changepassword.module').then(m => m.ChangePasswordModule) },
    { path: 'requirement', loadChildren: () => import('./pages/applicantform/applicantform.module').then(m => m.ApplicantFormModule) }, 
   
   
   
    { path: '**', component: NotFoundComponent }
];
 

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
            useHash: true
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }