import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgSelectOption, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ApplicantFormComponent } from './applicantform.component';
import { NgSelect2Module } from 'ng-select2';

export const routes = [
  { path: '', component: ApplicantFormComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    NgSelect2Module,
    
  ],
  declarations: [
    ApplicantFormComponent
  ]
})
export class ApplicantFormModule { } 