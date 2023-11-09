import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {AuthService} from "../../auth/services/auth.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor( private auth: AuthService, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/admins/auth')) {
      return next.handle(req);
    }
    return next.handle(req).pipe(
      catchError((err:HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403 ) {
        //   this.auth.logout();
          const error = err.error.message || err.statusText;
          return throwError(() => new Error(err.error.message));
        } else {
          this.toastr.error(
            `Veuillez contacter votre administrateur`,
            `Une erreur est survenue`,
            {
              timeOut: 5000
            }
          );
          return throwError(() => err);
        }
      })
    );
  }
}
