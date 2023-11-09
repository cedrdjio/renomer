import {Injectable} from "@angular/core";
import {BaseService} from "../../../shared/services/base.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Client} from "../models/client";
import {map, shareReplay, switchMap, take} from "rxjs/operators";
import {of, throwError,Observable} from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class ClientService extends BaseService<Client> {
    constructor(http: HttpClient) {
        super(http);
    }

    isLoading$: Observable<boolean>;
    base_url = environment.baseUrl;

    getUri(): string {
        return 'users';
    }



    clients$ = this.getAllPaginated('',0, 100000).pipe(
        map(res => res['datas']),
        shareReplay()
    );


    getClientByid(id: string): Observable<any> {
        return this.clients$.pipe(
            take(1),
            map((clients) => {
                if (clients !== undefined) {
                    return clients.find((item) => item.id === id) || null;
                }

            }),
            switchMap((client) => {
                if ( !client )
                {
                    const err = new Error('Could not found customer with id of ' + id + '!');
                    return throwError(() => err);

                }

                return of(client);
            })
        );

    }


}
