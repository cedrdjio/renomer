import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {ApiResponsePage} from "../../../../../shared/models/response/api-response-page";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {LoaderService} from "../../../../../shared/services/loader.service";
import {HttpErrorResponse} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Partner} from "../../../models/partner";
import {Observable} from "rxjs";
import {PartnerService} from "../../../services/partner.service";
import {Router} from "@angular/router";



@Component({
    selector: 'app-partner-list',
    templateUrl: './partner-list.component.html',
    styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent
    extends AbstractComponent<Partner>
    implements OnInit {

    partner: Partner = {} as Partner;


    partner$: Observable<Partner>;

    @Input()
    datas: Observable<ApiResponsePage<Partner>>;

    @ViewChild("deleteM",{static:true}) del:ElementRef;


    @Output()
    private partnersChanged = new EventEmitter();

    columns = [
        { name: 'Label', propertyName: 'label' },
        { name: 'Description', propertyName: 'description' },
        { name: 'Status', propertyName: 'status' },


    ];

    constructor(
        private toast: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private loader: LoaderService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private partnerService: PartnerService,
        private loaderService: LoaderService,
    ) {
        super();
        const loadingSubscr = this.isLoading$.asObservable()
            .subscribe((res) => (this.isLoading = res));
        this.unsubscribe.push(loadingSubscr);
    }

    ngOnInit(): void {
        this.addForm = this.fb.group({
            label: ['', Validators.required],
            description: ['', Validators.required]
        });

        this.searchForm = this.fb.group({
            term: ['']
        });

    }


    override add() {
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        }, 1500);


        let t : Partner = {} as Partner;

        t.label = this.addForm.get('label')?.value;
        t.description = this.addForm.get('description')?.value;


        if(this.id) {
                t.id = this.id
                this.partnerService.edit(this.id, t).subscribe({
                next: () => {
                    this.toast.success(
                        `Enseigne modifié avec succèss`,
                        `Enseigne`,
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
                    this.partnersChanged.emit();
                    this.mode = 'CREATE';
                }
            });

        } else {
            this.partnerService.createPartner(t).subscribe({
                next: () => {
                    this.toast.success(
                        `Enseigne ajouté avec succèss`,
                        `Enseigne`,
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
                    this.partnersChanged.emit();
                }
            });
        }




    }



    override onPageChange(current: number) {
        this.datas = this.partnerService.getAllPaginated(this.term,current - 1, this.limit);
    }

    override openModal(content: any) {
        this.modalService.open(content, { centered: true });
        this.addForm.reset();
    }

    override openEditModal(content: any, item: any) {
        this.mode = 'EDIT';
        this.id = item.id;
        this.partner$ =  this.partnerService.getById(this.id).pipe(
            map((response) => response.data)
        );
        this.partner$.subscribe(res => {
            this.partner = res;
            this.addForm.get('label').setValue(this.partner.label);
            this.addForm.get('description').setValue(this.partner.description);
        });
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    openStatusModal(item: any) {
        this.partner$ =  this.partnerService.getById(item).pipe(
            map((response) => response.data)
        );
        this.partner$.subscribe(res => {
            this.partner = res;
        });
        this.modalService.open(this.del, { centered: true, size: 'lg' });
    }

    override hideModal() {
        this.modalService.dismissAll();
    }

    override showDetails(item: any){
        this.router.navigate(['/admin/partners', item.id]);
    }

    override showPos(item: any){
        this.router.navigate(['/admin/partners-pos', item.id]);
    }


    override activateOrDeactivate(id: string) {
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        }, 1500);

        this.partnerService.activate(id).subscribe({
            next: (il) => {
                this.toast.success(
                    `Status modifié avec succèss`,
                    `Enseigne`,
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
                this.partnersChanged.emit();
            },
        });
    }

    search(content: any): void {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }



    searchPartner(){
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
            const countries$ = this.partnerService.getAllPaginated(term,this.page, this.limit);
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Partner>>(countries$);
        }

    }

    reset(){
        this.isFilter = false
        const countries$ = this.partnerService.getAllPaginated(this.term,this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Partner>>(countries$);
        this.searchForm.reset();
    }
}
