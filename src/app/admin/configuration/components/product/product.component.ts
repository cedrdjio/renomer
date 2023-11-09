import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponsePage } from 'src/app/shared/models/response/api-response-page';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends AbstractComponent<Product> implements OnInit {
    product$: Observable<ApiResponsePage<Product>>;


    constructor(private loaderService: LoaderService,
                private productService: ProductService) {
        super();
    }

    ngOnInit(): void {
        this.reloadProduits();
    }


    reloadProduits() {
        const product$ = this.productService.getAllPaginated(this.term, this.page, this.limit);
        this.product$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Product>>(product$);
    }
}
