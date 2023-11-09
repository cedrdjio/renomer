import {Injectable} from "@angular/core";
import {BaseService} from "../../../shared/services/base.service";
import {User} from "../models/user";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {finalize, map, shareReplay, switchMap, take, tap} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {ApiResponsePage} from "../../../shared/models/response/api-response-page";
import {of, throwError} from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class PartnerUserService extends BaseService<User> {

    constructor(http: HttpClient) {
        super(http);
    }

    isLoadingSubject: BehaviorSubject<boolean>;
    base_url = environment.baseUrl;

    getUri(): string {
        return 'partners/users';
    }

    recoverPassword(email: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('email', email);
        this.isLoadingSubject.next(true);
        return this.http.patch<any>(this.base_url + this.getUri() + '/recover-password' +
            '?' + params, null)
            .pipe(
                finalize(() => this.isLoadingSubject.next(false)),
            );
    }


    resendLink(email: string): Observable<any> {
        let params = new HttpParams();
        params = params.set('email', email);
        this.isLoadingSubject.next(true);
        return this.http.patch(this.base_url + this.getUri() + '/resend-link' +
            '?' + params, null)
            .pipe(
                finalize(() => this.isLoadingSubject.next(false)),
            );
    }


    // get T paginated
    getPartnerUsersAllPaginated(term: string, page: number, size: number): Observable<ApiResponsePage<User>> {

        let params = new HttpParams();

        if (term) {
            params = params.set('searchTerm', term);
        }

        params = params.set('page', page);
        params = params.set('size', size);

        return this.http
            .get<ApiResponsePage<User>>(
                environment.baseUrl + this.getUri() +
                '?' + params
            ).pipe(
                map(res =>  res['data'])
            );
    }



    getPartnerUserByid(id: string, partnerId: string): Observable<any> {
        return this.getPartnerUsersAllPaginated(partnerId,0, 100000).pipe(
            map(res => res['datas']),
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



    getPartnerUserInfos(): Observable<User> {
        return this.http.get<User>(
            this.base_url + this.getUri() + '/infos'
        ).pipe(
            map(res =>  res['data'])
        );

    }


}
