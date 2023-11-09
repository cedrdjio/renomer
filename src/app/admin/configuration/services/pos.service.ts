import {Injectable} from "@angular/core";
import {BaseService} from "../../../shared/services/base.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Pos} from "../models/pos";
import {Observable} from "rxjs";
import {ApiResponse} from "../../../shared/models/response/api-response";


@Injectable({
    providedIn: 'root',
})
export class PosService extends BaseService<Pos> {
    constructor(http: HttpClient) {
        super(http);
    }

    isLoading$: Observable<boolean>;
    base_url = environment.baseUrl;

    getUri(): string {
        return 'point-of-sale';
    }


    createPos(t: Pos): Observable<ApiResponse<Pos>> {
        return this.http.post<ApiResponse<Pos>>(environment.baseUrl + this.getUri() , t);
    }


}
