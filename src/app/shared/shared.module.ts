import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import {LoaderComponent} from "./components/loader/loader.component";
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {DefaultTableComponent} from "./components/default-table/default-table.component";
import {InlineSVGModule} from "ng-inline-svg-2";
import {StatsWidget5Component} from "./components/stats-widget5/stats-widget5.component";
import {FeatherIconsComponent} from "./components/feather-icons/feather-icons.component";
import {BreadcrumbComponent} from "./components/breadcrumb/breadcrumb.component";
import {RouterModule} from "@angular/router";
import {TapToTopComponent} from "./components/tap-to-top/tap-to-top.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";


@NgModule({
    declarations: [ LoaderComponent,DefaultTableComponent,TapToTopComponent,SidebarComponent, FeatherIconsComponent,BreadcrumbComponent, FooterComponent,StatsWidget5Component, HeaderComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
      RouterModule,
        FormsModule,
        NgbModule,
      InlineSVGModule,
        HttpClientModule
    ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    LoaderComponent,
    HeaderComponent,
    InlineSVGModule,
    StatsWidget5Component,
      SidebarComponent,
    FeatherIconsComponent,BreadcrumbComponent,TapToTopComponent,
    FooterComponent,
    DefaultTableComponent
  ]
})
export class SharedModule {}
