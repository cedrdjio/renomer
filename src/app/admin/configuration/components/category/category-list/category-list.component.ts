import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { Category } from '../../../models/category';
import { Observable, map } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponsePage } from 'src/app/shared/models/response/api-response-page';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { CategoryService } from '../../../services/category.service';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent
    extends AbstractComponent<Category>
    implements OnInit
{
    category: Category = {} as Category;

    category$: Observable<Category>;

    categoryId!: string;

    @Output()
    private CategorysChanged = new EventEmitter();

    @Input()
    datas: Observable<ApiResponsePage<Category>>;

    columns = [
        { name: 'code', propertyName: 'code' },
        { name: 'name', propertyName: 'name' },
        { name: 'status', propertyName: 'status' },
    ];
    sameName: boolean = false;
    invalidCode: boolean = false;
    invalidName: boolean = false;

    constructor(
        private toast: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private loaderService: LoaderService,
        private categoryService: CategoryService
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
        this.addForm = this.fb.group({
            code: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required])
        });
    }

    override activateOrDeactivate(item: any) {
        this.categoryService.activate(item).subscribe({
            next: (il) => {
                this.toast.success(`Status modifié avec succèss`, `Category`, {
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
                this.CategorysChanged.emit();
                this.getDatas();
            },
        });
    }

    override delete(id: string) {
        this.categoryService.delete(id).subscribe({
            next: (il) => {
                this.toast.success(`Catégorie supprimée avec succèss`, `Category`, {
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
                this.CategorysChanged.emit();
            },
        });
    }

    override openModal(content: any) {
        this.mode = 'SAVE';
        this.categoryId = null;
        this.invalidCode = false;
        this.invalidName = false;
        this.sameName = false;
        this.modalService.open(content, { centered: true });
        this.addForm.reset();
    }

    override openEditModal(content: any, item: any) {
        this.mode = 'EDIT';
        this.categoryId = item.id;
        this.invalidCode = false;
        this.invalidName = false;
        this.category$ = this.categoryService
            .getById(this.categoryId)
            .pipe(map((response) => response.data));
        this.category$.subscribe((res) => {
            this.category = res;
            this.addForm.get('code').setValue(this.category.code);
            this.addForm.get('name').setValue(this.category.name);
        });
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    override hideModal() {
        this.modalService.dismissAll();
    }

    override onPageChange(current: number) {
        this.datas = this.categoryService.getAllPaginated(
            this.term,
            current - 1,
            this.limit
        );
    }

    search(content: any): void {        
        this.invalidCode = false;
        this.invalidName = false;
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    searchCategory() {
        this.isFilter = true;
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        });

        const term: string = this.searchForm.get('term')?.value;

        if (term != null && term != "") {
            console.log('valide');
            this.hideModal();
            this.searchForm.reset();
            const categorys$ = this.categoryService.getAllPaginated(term, this.page, this.limit);
            this.datas =this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Category>>(categorys$);
        } else {
            console.log("Nom invalide")
            this.invalidName = true;
        }
    }

    reset() {
        this.isFilter = false;        
        this.invalidCode = false;
        this.invalidName = false;
        const categorys$ = this.categoryService.getAllPaginated(this.term, this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Category>>(categorys$);
        this.searchForm.reset();
    }

    override add() {
        this.sameName = false;
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        }, 1500);

        let t: Category = {} as Category;
        this.invalidCode = false;
        this.invalidName = false;
        if (this.addForm.get('code')?.value == null || this.addForm.get('code')?.value == '') {
            this.invalidCode = true
        }
        if (this.addForm.get('name')?.value == null || this.addForm.get('name')?.value == '') {
            this.invalidName = true;
        }
        if (!this.invalidCode && !this.invalidName) {
            t.code = this.addForm.get('code')?.value;
            t.name = this.addForm.get('name')?.value;
            if (this.categoryId) {
                t.id = this.categoryId;
                this.categoryService.getAllPaginated(t.name, 0, 25).subscribe(
                    (result) => {
                        if (result.datas.length != 0) {
                            this.sameName = true;
                        } else {
                            this.categoryService.edit(this.categoryId, t).subscribe({
                                next: () => {
                                    this.toast.success(
                                        `Catégorie modifié avec succès`,
                                        `Enseigne`,
                                        {
                                            timeOut: 5000,
                                        }
                                    );
                                },
                                error: (err) => {
                                    this.hideModal();
                                    this.toast.error(
                                        `Veuillez contacter votre administrateur`,
                                        `Une erreur est survenue`,
                                        {
                                            timeOut: 5000,
                                        }
                                    );
                                },
                                complete: () => {
                                    this.hideModal();
                                    this.getDatas();
                                },
                            });
                        }
                    })
            } else {
                this.categoryService.getAllPaginated(t.name, 0, 25).subscribe(
                    (result) => {
                        if (result.datas.length != 0) {
                            this.sameName = true;
                        } else {
                            this.categoryService.create(t).subscribe({
                                next: () => {
                                    this.toast.success(
                                        `Catégorie ajoutée avec succèss`,
                                        `Enseigne`,
                                        {
                                            timeOut: 5000,
                                        }
                                    );
                                },
                                error: (err) => {
                                    this.hideModal();
                                    this.toast.error(
                                        `Veuillez contacter votre administrateur`,
                                        `Une erreur est survenue`,
                                        {
                                            timeOut: 5000,
                                        }
                                    );
                                },
                                complete: () => {
                                    this.hideModal();
                                    this.getDatas();
                                },
                            });
                        }
                    }
                )
            }
        }
    }

    getDatas() {
        const category$ = this.categoryService.getAllPaginated(this.term, this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Category>>(category$);
    }

    checkInvalidFields() {
        const invalidFields = [];
        Object.keys(this.addForm.controls).forEach((controlName) => {
            const control = this.addForm.get(controlName);
            if (control.invalid) {
                invalidFields.push(controlName);
            }
        });
        if (invalidFields.length > 0) {
            console.log('Champs invalides :', invalidFields);
        } else {
            console.log('Le formulaire est valide.');
        }
    }
    
}
