import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { IndexComponent } from './template/components/index/index.component';
import {BoardComponent} from "./configuration/components/board/components/board.component";
import {AuthKeyClockGuard} from "../auth/guards/auth-guard.service";
import {UserComponent} from "./configuration/components/users/user.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {UserListComponent} from "./configuration/components/users/user-list/user-list.component";
import {CountryComponent} from "./configuration/components/country/country.component";
import {CountryListComponent} from "./configuration/components/country/country-list/country-list.component";
import {ClientComponent} from "./configuration/components/clients/client.component";
import {ClientListComponent} from "./configuration/components/clients/client-list/client-list.component";
import {PartnerComponent} from "./configuration/components/partner/partner.component";
import {PartnerListComponent} from "./configuration/components/partner/partner-list/partner-list.component";
import {PosComponent} from "./configuration/components/pos/pos.component";
import {PosListComponent} from "./configuration/components/pos/post-list/pos-list.component";
import {PartnerUserComponent} from "./configuration/components/partner/partner-users/partner-user.component";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PartnerPosComponent} from "./configuration/components/partner/partner-pos/partner-pos.component";
import { CategoryComponent } from './configuration/components/category/category.component';
import { CategoryListComponent } from './configuration/components/category/category-list/category-list.component';
import { ProductComponent } from './configuration/components/product/product.component';
import { ProductListComponent } from './configuration/components/product/product-list/product-list.component';





@NgModule({
  declarations: [
    IndexComponent,
    BoardComponent,
    CountryComponent,
    CountryListComponent,
    UserComponent,
    UserListComponent,
      ClientComponent,
      ClientListComponent,
      PartnerComponent,
      PartnerListComponent,
      PosComponent,
      PosListComponent,
      PartnerUserComponent,
      PartnerPosComponent,
      CategoryComponent,
      CategoryListComponent,
      ProductComponent,
      ProductListComponent


  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MatStepperModule,
      FormsModule,
      ReactiveFormsModule,
    MatInputModule,
    NgbModule,
    MatButtonModule, RouterModule,


  ],
  providers : [
    AuthKeyClockGuard
  ]
})
export class AdminModule {}
