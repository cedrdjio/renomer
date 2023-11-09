import {Component, OnInit} from "@angular/core";
import {AbstractComponent} from "../../../../shared/components/abstract-component";
import {ApiResponsePage} from "../../../../shared/models/response/api-response-page";
import {LoaderService} from "../../../../shared/services/loader.service";
import {Client} from "../../models/client";
import {Observable} from "rxjs";
import {ClientService} from "../../services/client.service";


@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})
export class ClientComponent extends AbstractComponent<Client> implements OnInit {

    clients$: Observable<ApiResponsePage<Client>>;


    constructor(private loaderService: LoaderService,
                private clientService: ClientService) {
        super();
    }

    ngOnInit(): void {
        this.reloadClients();
    }


    reloadClients() {
        const clients$ = this.clientService.getAllPaginated(this.term, this.page, this.limit);
        this.clients$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Client>>(clients$);
    }

}
