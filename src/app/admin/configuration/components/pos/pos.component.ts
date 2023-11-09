import {Component, OnInit} from "@angular/core";
import {AbstractComponent} from "../../../../shared/components/abstract-component";

import {ApiResponsePage} from "../../../../shared/models/response/api-response-page";
import {LoaderService} from "../../../../shared/services/loader.service";

import {Pos} from "../../models/pos";
import {Observable} from "rxjs";
import {PosService} from "../../services/pos.service";


@Component({
    selector: 'app-pos',
    templateUrl: './pos.component.html',
    styleUrls: ['./pos.component.scss']
})
export class PosComponent extends AbstractComponent<Pos> implements OnInit {

    pos$: Observable<ApiResponsePage<Pos>>;

    constructor(private loaderService: LoaderService,
                private posService: PosService) {
        super();
    }

    ngOnInit(): void {
        this.reloadPos();
    }


    reloadPos() {
        const pos$ = this.posService.getAllPaginated(this.term, this.page, this.limit);
        this.pos$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Pos>>(pos$);
    }

}
