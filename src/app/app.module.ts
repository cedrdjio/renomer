import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {RouterModule} from "@angular/router";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {LoaderService} from "./shared/services/loader.service";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ErrorInterceptor} from "./shared/interceptors/error-interceptor";
import { NgChartsModule } from 'ng2-charts';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializer} from "./admin/configuration/keycloak-initializer";
import {AuthService} from "./auth/services/auth.service";
import {AuthInterceptor} from "./shared/interceptors/auth-interceptor";
import {NgSelectModule} from "@ng-select/ng-select";
import { AgmCoreModule } from '@agm/core';
import {LoadingBarHttpClientModule} from "@ngx-loading-bar/http-client";
import {LoadingBarRouterModule} from "@ngx-loading-bar/router";
import {LoadingBarModule} from "@ngx-loading-bar/core";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    RouterModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    KeycloakAngularModule,
    NgSelectModule,
    NgChartsModule,
    NgSelectModule,
    NgbModule,
      // for HttpClient use:
      LoadingBarHttpClientModule,
      // for Router use:
      LoadingBarRouterModule,
      // for Core use:
      LoadingBarModule

  ],
  providers: [
    LoaderService,
    ToastrService,
    AuthService,
    {provide:
      HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [ KeycloakService ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
