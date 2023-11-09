import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponsePage } from '../../../shared/models/response/api-response-page';
import { ApiResponse } from '../../../shared/models/response/api-response';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseService<Category> {
    constructor(http: HttpClient) {
        super(http);
    }

    isLoading$: Observable<boolean>;
    base_url = environment.baseUrl;

    getUri(): string {
        return 'categories';
    }

    getCategories(id: string, page: number, size: number): Observable<ApiResponsePage<Category>> {
        let params = new HttpParams();

        params = params.set('page', page);
        params = params.set('size', size);

        return this.http
            .get<ApiResponse<ApiResponsePage<Category>>>(
                environment.baseUrl + this.getUri() + '/' + id + '/categories?' + params
            ).pipe(map((response) => response.data));
    }
    
    override create(t: Category): Observable<ApiResponse<Category>> {
        return this.http.post<ApiResponse<Category>>(this.base_url + this.getUri(), t);
    }
}
