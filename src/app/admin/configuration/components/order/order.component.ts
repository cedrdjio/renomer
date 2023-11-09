import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponsePage } from 'src/app/shared/models/response/api-response-page';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Order } from '../../models/order';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent extends AbstractComponent<Order> implements OnInit{

    order$: Observable<ApiResponsePage<Order>>;

    constructor(private loaderService: LoaderService,
                private orderService: OrderService) {
        super();
    }

    ngOnInit(): void {
        this.reloadOrders();
    }


    reloadOrders() {
        const order$ = this.orderService.getAllPaginated(this.term, this.page, this.limit);
        this.order$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Order>>(order$);
    }
}
