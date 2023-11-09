import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from '../../../models/order';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { ApiResponsePage } from 'src/app/shared/models/response/api-response-page';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Category } from '../../../models/category';
import { Pos } from '../../../models/pos';
import { CategoryService } from '../../../services/category.service';
import { PosService } from '../../../services/pos.service';
import { OrderService } from '../../../services/order.service';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent extends AbstractComponent<Order>
    implements OnInit {
    order: Order = {} as Order;

    order$: Observable<Order>;

    orderId!: string;

    @Output()
    private ordersChanged = new EventEmitter();

    @Input()
    datas: Observable<ApiResponsePage<Order>>;

    columns = [
        { name: 'Reference', propertyName: 'Reference' },
        { name: 'Nombre de produit ', propertyName: 'nbProduct' },
    ];

    constructor(
        private toast: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private loaderService: LoaderService,
        private orderService: OrderService,
    ) {
        super();
        const loadingSubscr = this.isLoading$
            .asObservable()
            .subscribe((res) => (this.isLoading = res));
        this.unsubscribe.push(loadingSubscr);
    }

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            term: [''],
        });
    }

    override activateOrDeactivate(item: any) {
        this.orderService.activate(item).subscribe({
            next: (il) => {
                this.toast.success(`Status modifié avec succèss`, `Commande`, {
                    timeOut: 5000,
                });
            },
            error: (err: HttpErrorResponse) => {
                this.toast.error('Une erreur a été rencontrée', '', {
                    timeOut: 5000,
                });
            },
            complete: () => {
                this.hideModal();
                this.ordersChanged.emit();
            },
        });
    }

    override delete(id: string) {
        this.orderService.delete(id).subscribe({
            next: (il) => {
                this.toast.success(`Commande supprimé avec succèss`, `Commande`, {
                    timeOut: 5000,
                });
            },
            error: (err: HttpErrorResponse) => {
                this.toast.error('Une erreur a été rencontrée', '', {
                    timeOut: 5000,
                });
            },
            complete: () => {
                this.hideModal();
                this.getDatas();
                this.ordersChanged.emit();
            },
        });
    }



    override hideModal() {
        this.modalService.dismissAll();
    }

    override onPageChange(current: number) {
        this.datas = this.orderService.getAllPaginated(
            this.term,
            current - 1,
            this.limit
        );
    }

    search(content: any): void {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    searchOrder() {
        this.isFilter = true;
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        });

        const term: string = this.searchForm.get('term')?.value;

        if (term) {
            this.hideModal();
            this.searchForm.reset();
            const orders$ = this.orderService.getAllPaginated(
                term,
                this.page,
                this.limit
            );
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Order>>(orders$);
        }
    }

    reset() {
        this.isFilter = false;
        const orders$ = this.orderService.getAllPaginated(
            this.term,
            this.page,
            this.limit
        );
        this.datas =
            this.loaderService.showLoaderUntilCompleted<
                ApiResponsePage<Order>
            >(orders$);
        this.searchForm.reset();
    }


    getDatas() {
        const order$ = this.orderService.getAllPaginated(
            this.term,
            this.page,
            this.limit
        );
        this.datas =
            this.loaderService.showLoaderUntilCompleted<
                ApiResponsePage<Order>
            >(order$);
    }
    exportToCSV(): void {
        this.datas.subscribe((orderResult) => {
            const csvContent = this.convertToCSV(orderResult.datas);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'orderData.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }

    private convertToCSV(data: Order[]): string {
        const header = Object.keys(data).join(',') + '\n';
        const values = Object.values(data).join(',') + '\n';
        return header + values;
    }
}


