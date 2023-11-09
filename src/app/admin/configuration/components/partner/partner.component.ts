import {Component, OnInit} from "@angular/core";
import {AbstractComponent} from "../../../../shared/components/abstract-component";
import {ApiResponsePage} from "../../../../shared/models/response/api-response-page";
import {LoaderService} from "../../../../shared/services/loader.service";
import {Partner} from "../../models/partner";
import {PartnerService} from "../../services/partner.service";
import {Observable} from "rxjs";


@Component({
    selector: 'app-partner',
    templateUrl: './partner.component.html',
    styleUrls: ['./partner.component.scss']
})
export class PartnerComponent extends AbstractComponent<Partner> implements OnInit {

    partners$: Observable<ApiResponsePage<Partner>>;

    constructor(private loaderService: LoaderService,
                private partnerService: PartnerService) {
        super();
    }

    ngOnInit(): void {
        this.reloadPartners();
    }


    reloadPartners() {
        const partners$ = this.partnerService.getAllPaginated(this.term, this.page, this.limit);
        this.partners$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Partner>>(partners$);
    }

}
