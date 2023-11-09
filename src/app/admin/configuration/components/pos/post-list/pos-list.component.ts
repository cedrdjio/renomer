import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {ApiResponsePage} from "../../../../../shared/models/response/api-response-page";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {LoaderService} from "../../../../../shared/services/loader.service";
import {map} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {Pos} from "../../../models/pos";
import {Observable} from "rxjs";
import {PosService} from "../../../services/pos.service";
import {PartnerService} from "../../../services/partner.service";
import {Town} from "../../../models/town";
import {CountryService} from "../../../services/country.service";
import {Country} from "../../../models/country";
import {Role} from "../../../../../shared/models/misc/role.enum";
import {AuthService} from "../../../../../auth/services/auth.service";
import {User} from "../../../models/user";
import {PartnerUserService} from "../../../services/partner-user.service";



@Component({
    selector: 'app-pos-list',
    templateUrl: './pos-list.component.html',
    styleUrls: ['./pos-list.component.scss']
})
export class PosListComponent
    extends AbstractComponent<Pos>
    implements OnInit {

    pos: Pos = {} as Pos;


    pos$: Observable<Pos>;

    user$: Observable<User>;

    partnerId: string = '';

    towns$: Observable<Town[]>;
    countries$: Observable<Country[]>;

    @Input()
    datas: Observable<ApiResponsePage<Pos>>;


    @Output()
    private posChanged = new EventEmitter();

    columns = [
        { name: 'Nom', propertyName: 'name'},
        { name: 'Partenaire', propertyName: 'partnerLabel' },
        { name: 'Ville', propertyName: 'townName' },
        { name: 'Address', propertyName: 'address' },
        { name: 'Long', propertyName: 'longitude' },
        { name: 'Lat', propertyName: 'latitude' },
        { name: 'Ouverture', propertyName: 'openAt' },
        { name: 'Fermeture', propertyName: 'closeAt' },
        { name: 'Status', propertyName: 'status' }


    ];

    constructor(
        private toast: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private loader: LoaderService,
        private cdr: ChangeDetectorRef,
        private posService: PosService,
        private partnerService: PartnerService,
        private authService: AuthService,
        private loaderService: LoaderService,
        private partnerUserService: PartnerUserService,
        private countryService: CountryService
    ) {
        super();
        const loadingSubscr = this.isLoading$.asObservable()
            .subscribe((res) => (this.isLoading = res));
        this.unsubscribe.push(loadingSubscr);

        if (this.isPartner){
            this.user$ = partnerUserService.getPartnerUserInfos();
            this.user$.subscribe(res => {
                this.partnerId = res.partnerId;
                this.term = res.partnerId;
            })
        }
    }

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            term: ['']
        });

        this.addForm = this.fb.group({
            name: ['', Validators.required],
            address: ['',Validators.required],
            longitude: [0],
            latitude: [0],
            openAt: ['', Validators.required],
            closeAt: ['', Validators.required],
            partnerId: [''],
            countryId: [''],
            townId: ['', Validators.required]

        });

        this.getCountries();

    }


    override add() {
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        }, 1500);


        let t : Pos = {} as Pos;

        t.name = this.addForm.get('name')?.value;
        t.address = this.addForm.get('address')?.value;
        t.longitude = this.addForm.get('longitude')?.value;
        t.latitude = this.addForm.get('latitude')?.value;
        if (this.isPartner){
            t.partnerId = this.partnerId;
        }
        if(this.isAdmin){
            t.partnerId = this.addForm.get('partnerId')?.value;
        }

        t.openAt = this.addForm.get('openAt')?.value;
        t.closeAt = this.addForm.get('closeAt')?.value;
        t.townId = this.addForm.get('townId')?.value;


        if(this.id) {
            t.id = this.id
                this.posService.edit(this.id, t).subscribe({
                next: () => {
                    this.toast.success(
                        `Point de vente modifié avec succèss`,
                        `Point de vente`,
                        {
                            timeOut: 5000
                        }
                    );
                },
                error: (err) => {
                    this.hideModal();
                    this.toast.error(
                        `Veuillez contacter votre administrateur`,
                        `Une erreur est survenue`,
                        {
                            timeOut: 5000
                        }
                    );
                },
                complete: () => {
                    this.hideModal();
                    this.posChanged.emit();
                }
            });

        } else {
            this.posService.createPos(t).subscribe({
                next: () => {
                    this.toast.success(
                        `Point de vente ajouté avec succèss`,
                        `Point de vente`,
                        {
                            timeOut: 5000
                        }
                    );
                },
                error: (err) => {
                    this.hideModal();
                    this.toast.error(
                        `Veuillez contacter votre administrateur`,
                        `Une erreur est survenue`,
                        {
                            timeOut: 5000
                        }
                    );
                },
                complete: () => {
                    this.hideModal();
                    this.posChanged.emit();
                }
            });
        }


    }


    partners$ = this.partnerService.getAllPaginated(this.term, this.page, this.limit).pipe(
        map((response) => response.datas)
    );

    getCountries(){
       this.countries$ = this.countryService.getAllPaginated(this.term, 0, 100000).pipe(
           map((response) => response.datas)
       );
    }

    override onPageChange(current: number) {
        this.datas = this.posService.getAllPaginated(this.term,current - 1, this.limit);
    }

    override openModal(content: any) {
        this.modalService.open(content, { centered: true, size: 'lg' });
        this.addForm.reset();
    }

    override openEditModal(content: any, item: any) {
        this.mode = 'EDIT';
        this.id = item.id;
        this.pos$ =  this.posService.getById(this.id).pipe(
            map((response) => response.data)
        );
        this.pos$.subscribe(res => {
            this.pos = res;
            this.addForm.get('name').setValue(this.pos.name);
            this.addForm.get('address').setValue(this.pos.address);
            this.addForm.get('longitude').setValue(this.pos.longitude);
            this.addForm.get('latitude').setValue(this.pos.latitude);
            this.addForm.get('partnerId').setValue(this.pos.partnerId);
            this.addForm.get('openAt').setValue(this.pos.openAt);
            this.addForm.get('closeAt').setValue(this.pos.closeAt);
            this.addForm.get('townId').setValue(this.pos.townId);

        });
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    override hideModal() {
        this.modalService.dismissAll();
        this.addForm.reset();
        this.mode = 'CREATE';
    }


    override activateOrDeactivate(id: string) {

        this.posService.activate(id).subscribe({
            next: (il) => {
                this.toast.success(
                    `Status modifié avec succèss`,
                    `Point de vente`,
                    {
                        timeOut: 5000
                    }
                );
            },
            error: (err: HttpErrorResponse) => {
                console.log(err.status);
                this.toast.error('Une erreur a été rencontrée', '', {
                    timeOut: 5000,
                });
            },
            complete: () => {
                this.hideModal();
                this.posChanged.emit();
            },
        });
    }



    search(content: any): void {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }



    searchP(){
        this.isFilter = true
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        });

        const term: string = this.searchForm.get('term')?.value;

        if (term) {
            this.hideModal();
            const pos$ = this.posService.getAllPaginated(term,this.page, this.limit);
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Pos>>(pos$);
            this.searchForm.reset();
        }

    }

    reset(){
        this.isFilter = false
        const pos$ = this.posService.getAllPaginated(this.term,this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Pos>>(pos$);
        this.searchForm.reset();
    }

    onChange(value: any) {
        const id: string = value.target.value;
        this.towns$ = this.countryService.getTowns(id, 0, 10000).pipe(
            map((response) => response.datas)
        );

    }


    public get isAdmin(): boolean {
        return this.getUserRole() === Role.ADMIN_ROOT || this.getUserRole() === Role.ADMIN_USER;
    }

    public get isPartner(): boolean {
        return  this.getUserRole() === Role.PARTNER_MANAGER;
    }

    private getUserRole(): string {
        return this.authService.getRoleByTokens();
    }


}
