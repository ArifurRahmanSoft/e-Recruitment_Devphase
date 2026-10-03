import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
// import { LoginComponent } from './login.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgSelect2Module } from 'ng-select2';
import {  ChangePasswordComponent } from './changepassword.component';









export const routes = [
  { path: '', component: ChangePasswordComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,

    ReactiveFormsModule,
    HttpClientModule,
    NgSelect2Module
  ],
  declarations: [
    ChangePasswordComponent
  ]
})

export class ChangePasswordModule { } 