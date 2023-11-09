import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {ApiResponsePage} from "../../../../../shared/models/response/api-response-page";
import {Observable} from "rxjs";
import {User} from "../../../models/user";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, Validators} from "@angular/forms";
import {LoaderService} from "../../../../../shared/services/loader.service";
import {UserService} from "../../../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Role} from "../../../../../shared/models/misc/role.enum";


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent
  extends AbstractComponent<User>
  implements OnInit {

    rolesEnum = Role;
    roles!: string[];

  user: User = {} as User;


  user$: Observable<User>;

  @Input()
  datas: Observable<ApiResponsePage<User>>;


  @Output()
  private usersChanged = new EventEmitter();

  columns = [
    { name: 'Nom', propertyName: 'firstname' },
    { name: 'Prenom', propertyName: 'lastname' },
    { name: 'Email', propertyName: 'email' },
    { name: 'Role', propertyName: 'role' },
      { name: 'Status', propertyName: 'status' }
  ];

  constructor(
    private toast: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loader: LoaderService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private loaderService: LoaderService
  ) {
    super();
    const loadingSubscr = this.isLoading$.asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
      this.roles = Object.keys(this.rolesEnum);
      this.addForm = this.fb.group({
          firstname: ['', Validators.required],
          lastname: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          role: ['', [Validators.required]]
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


        if(this.id) {
            this.userService.edit(this.id, t).subscribe({
                next: () => {
                    this.toast.success(
                        `Administrateur modifié avec succèss`,
                        `Administrateur`,
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
                    this.usersChanged.emit();
                    this.mode = 'CREATE';
                }
            });

        } else {
            this.userService.create(t).subscribe({
                next: () => {
                    this.toast.success(
                        `Administrateur ajouté avec succèss`,
                        `Administrateur`,
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
                    this.usersChanged.emit();
                }
            });
        }
    }



  override onPageChange(current: number) {
    this.datas = this.userService.getUsersAllPaginated(this.term,current - 1, this.limit);
  }

  override openModal(content: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.addForm.reset();
  }

    override openEditModal(content: any, item: any) {
        this.mode = 'EDIT';
        this.id = item.id;
        this.user$ =  this.userService.getUsersByid(this.id);
        this.user$.subscribe(res => {
            this.user = res;
            this.addForm.get('firstname').setValue(this.user.firstname);
            this.addForm.get('lastname').setValue(this.user.lastname);
            this.addForm.get('email').setValue(this.user.email);
            this.addForm.get('role').setValue(this.user.role);
        });
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

  override hideModal() {
    this.modalService.dismissAll();
  }


    override activateOrDeactivate(item: any) {

        this.userService.activate(item).subscribe({
            next: (il) => {
                this.toast.success(
                    `Status modifié avec succèss`,
                    `Administrateur`,
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
                this.usersChanged.emit();
            },
        });
    }



    reSendLink(email: string) {
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        }, 1500);

        this.userService.resendLink(email).subscribe({
            next: () => {
                this.hideModal();
                this.toast.success(
                    `Lien d'activation renvoyé avec succès`,
                    `Administrateur`,
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
        this.modalService.open(content, { centered: true, size: 'lg' });
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
            const users$ = this.userService.getUsersAllPaginated(term,this.page, this.limit);
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<User>>(users$);
        }

    }

    reset(){
        this.isFilter = false
        const users$ = this.userService.getUsersAllPaginated(this.term,this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<User>>(users$);
        this.searchForm.reset();
    }
}
