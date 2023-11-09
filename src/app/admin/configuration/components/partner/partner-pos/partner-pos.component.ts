import {Component, OnInit} from "@angular/core";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {Pos} from "../../../models/pos";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {LoaderService} from "../../../../../shared/services/loader.service";
import {PartnerService} from "../../../services/partner.service";
import {Observable} from "rxjs";
import {ApiResponsePage} from "../../../../../shared/models/response/api-response-page";
import {Partner} from "../../../models/partner";
import {map} from "rxjs/operators";


@Component({
    selector: 'app-partner-pos',
    templateUrl: './partner-pos.component.html',
    styleUrls: ['./partner-pos.component.scss']
})
export class PartnerPosComponent extends AbstractComponent<Pos>
    implements OnInit {

    datas: Observable<ApiResponsePage<Pos>>;

    partner$!: Observable<Partner>;

    columns = [
        { name: 'Nom', propertyName: 'name' },
        { name: 'Partenaire', propertyName: 'partnerLabel' },
        { name: 'Ville', propertyName: 'townName' },
        { name: 'Address', propertyName: 'address' },
        { name: 'Long', propertyName: 'longitude' },
        { name: 'Lat', propertyName: 'latitude' },
        { name: 'Ouverture', propertyName: 'openAt' },
        { name: 'Fermeture', propertyName: 'closeAt' },
        { name: 'Status', propertyName: 'status' }


    ];


    constructor(private route: ActivatedRoute,
                private loaderService: LoaderService,
                private partnerService: PartnerService) {
        super();
    }


    ngOnInit(): void {
        this.route.paramMap.subscribe((paraMap: ParamMap) => {
            if(paraMap.has('id')){
                this.id = this.route.snapshot.params['id'];
                console.log(this.id);
                this.loadPosPartners(this.id);

            }
        });
    }


    loadPosPartners(id: string){
        console.log(this.id);
        console.log(id);
        this.partner$ = this.partnerService.getById(id).pipe(
            map(res => res.data)
        );
        const datas$ = this.partnerService.getAllPosPaginated(id, this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Pos>>(datas$);
    }

    override onPageChange(current: number) {
        this.datas = this.partnerService.getAllPosPaginated(this.id,current - 1, this.limit);
    }

}
