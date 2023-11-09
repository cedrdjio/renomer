import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {KeycloakService} from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  getToken: string;

  constructor(private key: KeycloakService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {

    if(!this.key.isLoggedIn()) return httpHandler.handle(httpRequest);
    this.key.getToken().then(token => {
      this.getToken = token;
      console.log(token);
    });

    const request = !this.getToken ? httpRequest : httpRequest.clone({
      setHeaders: { Authorization: `Bearer ${this.getToken}` }
    });

    return httpHandler.handle(request);
  }
}
