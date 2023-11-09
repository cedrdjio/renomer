import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AuthenticationRoutingModule } from './authentication-routing.module';
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {ForgetPasswordComponent} from "./components/forget-password/forget-password.component";
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";



@NgModule({
  imports: [
    CommonModule,
      RouterModule,
    SharedModule,
    AuthenticationRoutingModule
  ],
  declarations: [
    ForgetPasswordComponent,
    ResetPasswordComponent
  ]
})
export class AuthenticationModule { }
