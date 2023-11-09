import {ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {LoaderService} from "../../../../../shared/services/loader.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, Validators} from "@angular/forms";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PartnerService} from "../../../services/partner.service";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {User} from "../../../models/user";
import {PartnerUserService} from "../../../services/partner-user.service";
import {Role} from "../../../../../shared/models/misc/role.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {ApiResponsePage} from "../../../../../shared/models/response/api-response-page";
import {Observable} from "rxjs";
import {UserService} from "../../../services/user.service";


@Component({
    selector: 'app-partner-user',
    templateUrl: './partner-user.component.html',
    styleUrls: ['./partner-user.component.scss']
})
export class PartnerUserComponent extends AbstractComponent<User> implements OnInit{

    rolesEnum = Role;
    roles!: string[];

    user: User = {} as User;

    user$: Observable<User>;

    datas: Observable<ApiResponsePage<User>>;

    userId!: string;

    columns = [
        { name: 'Nom', propertyName: 'firstname' },
        { name: 'Prenom', propertyName: 'lastname' },
        { name: 'Email', propertyName: 'email' },
        { name: 'Status', propertyName: 'status'},
        { name: 'Role', propertyName: 'role' },
        { name: 'Partenaire', propertyName: 'partnerName' }
    ];

    constructor(
                private fb: FormBuilder,
                private toast: ToastrService,
                private loaderService: LoaderService,
                private cdr: ChangeDetectorRef,
                private modalService: NgbModal,
                private route: ActivatedRoute,
                private router: Router,
                private partnerService: PartnerService,
                private userService: UserService,
                private partneruserService: PartnerUserService) {
        super();

        const loadingSubscr = this.isLoading$
            .asObservable()
            .subscribe((res) => (this.isLoading = res));
        this.unsubscribe.push(loadingSubscr);

    }


    ngOnInit(): void {
        this.route.paramMap.subscribe((paraMap: ParamMap) => {
            if(paraMap.has('id')){
                this.term = this.route.snapshot.params['id'];
                this.id = this.route.snapshot.params['id'];
                this.getDatas();
            }
        });

        this.roles = Object.keys(this.rolesEnum);
        this.addForm = this.fb.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', [Validators.required]],
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


        let t : User = {} as User;
        t.firstname = this.addForm.get('firstname')?.value;
        t.lastname = this.addForm.get('lastname')?.value;
        t.email = this.addForm.get('email')?.value;
        t.role = this.addForm.get('role')?.value;
        t.partnerId = this.id;

        if(this.userId) {
            this.partneruserService.edit(this.userId, t).subscribe({
                next: () => {
                    this.toast.success(
                        `Utilisateur modifié avec succèss`,
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
                    this.getDatas();
                }
            });

        } else {
            this.partneruserService.create(t).subscribe({
                next: () => {
                    this.toast.success(
                        `Utilisateur ajouté avec succèss`,
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
                    this.getDatas();
                }
            });
        }

    }

    getDatas(){
        const users$ = this.partneruserService.getPartnerUsersAllPaginated(this.term, this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<User>>(users$);
    }

    override onPageChange(current: number) {
        this.datas = this.partneruserService.getPartnerUsersAllPaginated(this.term,current - 1, this.limit);
    }

    override openModal(content: any) {
        this.modalService.open(content, { centered: true });
        this.addForm.reset();
    }

    override openEditModal(content: any, item: any) {
        this.mode = 'EDIT';
        this.userId = item.id;
        this.user$ =  this.partneruserService.getPartnerUserInfos();
        this.user$.subscribe(res => {
            this.user = res;
            this.addForm.get('firstname').setValue(this.user.firstname);
            this.addForm.get('lastname').setValue(this.user.lastname);
            this.addForm.get('email').setValue(this.user.email);
            this.addForm.get('role').setValue(this.user.role);
            this.addForm.get('partnerId').setValue(this.user.partnerId);
        });
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    override hideModal() {
        this.modalService.dismissAll();
    }


    override activateOrDeactivate(id: string) {

        this.partneruserService.activate(id).subscribe({
            next: (il) => {
                this.toast.success(
                    `Status modifié avec succèss`,
                    `Utilisateur`,
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
                this.getDatas();
            },
        });
    }



    reSendLink(email: string) {
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        }, 1500);

        this.partneruserService.resendLink(email).subscribe({
            next: () => {
                this.hideModal();
                this.toast.success(
                    `Lien d'activation renvoyé avec succès`,
                    `Utilisateur`,
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
            }
        });

    }


    search(content: any): void {
        this.modalService.open(content, { centered: true});
    }



    searchUser(){
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
            const users$ = this.partneruserService.getPartnerUsersAllPaginated(term,this.page, this.limit);
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<User>>(users$);
        }

    }

    reset(){
        this.isFilter = false
        const users$ = this.partneruserService.getPartnerUsersAllPaginated(this.term,this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<User>>(users$);
        this.searchForm.reset();
    }



}
