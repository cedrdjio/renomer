import {Injectable} from "@angular/core";
import {BaseService} from "../../../shared/services/base.service";
import {User} from "../models/user";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {BehaviorSubject} from "rxjs";
import {ApiResponsePage} from "../../../shared/models/response/api-response-page";
import {ApiResponse} from "../../../shared/models/response/api-response";
import {map, shareReplay, switchMap, take} from "rxjs/operators";
import {Role} from "../../../shared/models/misc/role.enum";
import {of, throwError} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {

  constructor(http: HttpClient) {
    super(http);
  }

    isLoadingSubject: BehaviorSubject<boolean>;
  base_url = environment.baseUrl;

  getUri(): string {
    return 'admins';
  }

    recoverPassword(email: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('email', email);

        return this.http.patch<any>(this.base_url + this.getUri() + '/recover-password' +
            '?' + params, null);
    }


    resendLink(email: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('email', email);

        return this.http.patch(this.base_url + this.getUri() + '/resend-link' +
            '?' + params, null);
    }

    // get T paginated
    getUsersAllPaginated(term: string, page: number, size: number): Observable<ApiResponsePage<User>> {

        let params = new HttpParams();

        if (term) {
            params = params.set('searchTerm', term);
        }

        params = params.set('page', page);
        params = params.set('size', size);

        return this.http
            .get<ApiResponse<ApiResponsePage<User>>>(
                environment.baseUrl + this.getUri() +
                '?' + params
            ).pipe(
                map((response) => response.data),
                map(res => {
                    res.datas =  res.datas.filter(user => (user.role === Role.ADMIN_USER || user.role === Role.ADMIN_ROOT));
                    res.totalElements = (res.datas.length);
                    return res;
                }),
                shareReplay()
            );
    }


    users$ = this.getUsersAllPaginated('',0, 100000).pipe(
        map(res => res['datas']),
        shareReplay()
    );


    getUsersByid(id: string): Observable<any> {
        return this.users$.pipe(
            take(1),
            map((users) => {
                if (users !== undefined) {
                    return users.find((item) => item.id === id) || null;
                }

            }),
            switchMap((user) => {
                if ( !user )
                {
                    const err = new Error('Could not found user with id of ' + id + '!');
                    return throwError(() => err);

                }

                return of(user);
            })
        );

    }

    getAdminInfos(): Observable<User> {
        return this.http.get<User>(
            this.base_url + this.getUri() + '/infos'
        ).pipe(
            map(res =>  res['data'])
        );

    }



}
