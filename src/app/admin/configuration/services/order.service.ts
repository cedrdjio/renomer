import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/response/api-response';
import { ApiResponsePage } from 'src/app/shared/models/response/api-response-page';
import { BaseService } from 'src/app/shared/services/base.service';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Order> {
    constructor(http: HttpClient) {
        super(http);
    }

    isLoading$: Observable<boolean>;
    base_url = environment.baseUrl;

    getUri(): string {
        return 'orders';
    }
}
