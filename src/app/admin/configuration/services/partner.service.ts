import {Injectable} from "@angular/core";
import {BaseService} from "../../../shared/services/base.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Partner} from "../models/partner";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";
import {ApiResponse} from "../../../shared/models/response/api-response";
import {ApiResponsePage} from "../../../shared/models/response/api-response-page";
import {Pos} from "../models/pos";


@Injectable({
    providedIn: 'root',
})
export class PartnerService extends BaseService<Partner> {
    constructor(http: HttpClient) {
        super(http);
    }
    createPartner(t: Partner): Observable<ApiResponse<Partner>> {
        return this.http.post<ApiResponse<Partner>>(environment.baseUrl + this.getUri() , t);
    }

    isLoading$: Observable<boolean>;
    base_url = environment.baseUrl;

    getUri(): string {
        return 'partners';
    }

    partners$ = this.getAllPaginated(null,0, 10000).pipe(
        map(res => res['data']),
        shareReplay()
    );


    getAllPosPaginated(id: string, page: number, size: number): Observable<ApiResponsePage<Pos>> {

        let params = new HttpParams();

        params = params.set('page', page);
        params = params.set('size', size);

        return this.http
            .get<ApiResponse<ApiResponsePage<Pos>>>(
                environment.baseUrl + this.getUri() + '/' + id + '/' +'point-of-sales?'
                 + params
            ).pipe(
                map((response) => response.data)
            );
    }





}
