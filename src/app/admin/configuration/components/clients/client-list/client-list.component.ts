import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {Client} from "../../../models/client";
import {FormBuilder, Validators} from "@angular/forms";
import {ApiResponsePage} from "../../../../../shared/models/response/api-response-page";
import {Observable} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClientService} from "../../../services/client.service";
import {HttpErrorResponse} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Town} from "../../../models/town";
import {Country} from "../../../models/country";
import {LoaderService} from "../../../../../shared/services/loader.service";


@Component({
    selector: 'app-client-list',
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent
    extends AbstractComponent<Client>
    implements OnInit {

    client: Client = {} as Client;


    client$: Observable<Client>;

    towns$: Observable<Town[]>;

    countries$: Observable<Country[]>;



    @Output()
    private clientsChanged = new EventEmitter();


    @Input()
    datas: Observable<ApiResponsePage<Client>>;


    columns = [
        { name: 'Nom', propertyName: 'firstname' },
        { name: 'Prenom', propertyName: 'lastname' },
        { name: 'Email', propertyName: 'email' },
        { name: 'Télephone', propertyName: 'phoneNumber' },
        { name: 'Ville', propertyName: 'townName' },
        { name: 'status', propertyName: 'status' },
        { name: 'Role', propertyName: 'role' },
        { name: 'Date de naissance', propertyName: 'BirthDate' },


    ];


    constructor(
        private toast: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private loaderService: LoaderService,
        private clientService: ClientService
    ) {
        super();
        const loadingSubscr = this.isLoading$.asObservable()
            .subscribe((res) => (this.isLoading = res));
        this.unsubscribe.push(loadingSubscr);
    }

    ngOnInit(): void {

        this.searchForm = this.fb.group({
            term: ['']
        });

    }

    override activateOrDeactivate(item: any) {

        this.clientService.activate(item).subscribe({
            next: (il) => {
                this.toast.success(
                    `Status modifié avec succèss`,
                    `Client`,
                    {
                        timeOut: 5000
                    }
                );
            },
            error: (err: HttpErrorResponse) => {
                this.toast.error('Une erreur a été rencontrée', '', {
                    timeOut: 5000,
                });
            },
            complete: () => {
                this.hideModal();
                this.clientsChanged.emit();
            },
        });
    }

    override openModal(content: any) {
        this.modalService.open(content, { centered: true });
        this.addForm.reset();
    }

    override openEditModal(content: any, item: any) {
        this.mode = 'EDIT';
        this.id = item.id;
        this.client$ =  this.clientService.getClientByid(this.id);
        this.client$.subscribe(res => {
            this.client = res;
            this.addForm.get('firstname').setValue(this.client.firstname);
            this.addForm.get('lastname').setValue(this.client.lastname);
            this.addForm.get('email').setValue(this.client.email);
            this.addForm.get('phoneNumber').setValue(this.client.phoneNumber);
            this.addForm.get('townId').setValue(this.client.townId);
        });
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    override hideModal() {
        this.modalService.dismissAll();
    }


    override onPageChange(current: number) {
        this.datas = this.clientService.getAllPaginated(this.term,current - 1, this.limit);
    }

    search(content: any): void {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }


    searchClient(){
        this.isFilter = true
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        });

        const term: string = this.searchForm.get('term')?.value;

        if (term) {
            this.hideModal();
            this.searchForm.reset();
            const clients$ = this.clientService.getAllPaginated(term,this.page, this.limit);
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Client>>(clients$);
        }

    }

    reset(){
        this.isFilter = false
        const clients$ = this.clientService.getAllPaginated(this.term,this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Client>>(clients$);
        this.searchForm.reset();
    }


}
