import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/response/api-response';
import { productImages } from '../models/productImages';

@Injectable({
    providedIn: 'root',
})
export class ProductService extends BaseService<Product> {
  base_url = environment.baseUrl;
  

    constructor(http: HttpClient) {
        super(http);
    }
    getUri(): string {
        return 'products';
    }

    override create(t: Product): Observable<ApiResponse<Product>> {
        return this.http.post<ApiResponse<Product>>(this.base_url + this.getUri(), t);
    }
  
    addProductImage(productId: string, imageData: string): Observable<ApiResponse<productImages>> {
        return this.http.post<ApiResponse<productImages>>(`${this.base_url}/images?idProduct=${productId}`, imageData);
    }
}

