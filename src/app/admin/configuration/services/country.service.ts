import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BaseService} from "../../../shared/services/base.service";
import {Country} from "../models/country";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {ApiResponsePage} from "../../../shared/models/response/api-response-page";
import {ApiResponse} from "../../../shared/models/response/api-response";
import {map} from "rxjs/operators";
import {Town} from "../models/town";


@Injectable({
  providedIn: 'root',
})
export class CountryService extends BaseService<Country> {
  constructor(http: HttpClient) {
    super(http);
  }

  isLoading$: Observable<boolean>;
  base_url = environment.baseUrl;

  getUri(): string {
    return 'countries';
  }


  download(fileName:string): string {
    return environment.baseUrl + fileName;
  }


  getTowns(id: string, page: number, size: number): Observable<ApiResponsePage<Town>> {

      let params = new HttpParams();

      params = params.set('page', page);
      params = params.set('size', size);

      return this.http
          .get<ApiResponse<ApiResponsePage<Town>>>(
              environment.baseUrl + this.getUri() + '/' + id + '/towns?' + params
          ).pipe(
              map((response) => response.data)
          );
  }
}
