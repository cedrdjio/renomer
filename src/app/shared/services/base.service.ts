import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {ApiResponse} from "../models/response/api-response";
import {map, tap} from "rxjs/operators";
import {ApiResponsePage} from "../models/response/api-response-page";


const AUTH_API = environment.baseUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService<T> {
  constructor(protected http: HttpClient) {}

  abstract getUri(): string;



    create(t: T): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(AUTH_API + this.getUri() + '/create' , t);
    }

    // get T Id
    getById(id: string): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(
            AUTH_API + this.getUri() + '/'+ id,
            httpOptions
        );
    }



    // get T paginated
    getAllPaginated(term: string, page: number, size: number): Observable<ApiResponsePage<T>> {

        let params = new HttpParams();

        if (term) {
            params = params.set('searchTerm', term);
        }

        params = params.set('page', page);
        params = params.set('size', size);

        return this.http
            .get<ApiResponse<ApiResponsePage<T>>>(
                AUTH_API + this.getUri() +
                '?' + params
            ).pipe(
                map((response) => response.data),

            );
    }

  // delete T by Id
  delete(id: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(
      AUTH_API + this.getUri() + '/' + id,
      httpOptions
    );
  }

  edit(id: string, t: T): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(
      AUTH_API + this.getUri() + '/' + id,
      t
    );
  }

    // activate/deactivate T by Id
    activate(id: string): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(
            AUTH_API + this.getUri() + '/' + id + '/update-status',
            httpOptions
        );
    }
}
