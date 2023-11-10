import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
import { ApiResponsePage } from 'src/app/shared/models/response/api-response-page';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { AbstractComponent } from 'src/app/shared/components/abstract-component';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { Pos } from '../../../models/pos';
import { PosService } from '../../../services/pos.service';
import { productImages } from '../../../models/productImages';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent
    extends AbstractComponent<Product>
    implements OnInit
{
    product: Product = {} as Product;

    product$: Observable<Product>;

    productId!: string;

    categories: Category[] = [];

    pos: Pos[] = [];

    editing : boolean = false

    @Output()
    private ProductsChanged = new EventEmitter();

    @Input()
    datas: Observable<ApiResponsePage<Product>>;

    columns = [
        { name: 'Nom', propertyName: 'name' },
        { name: 'Prix', propertyName: 'price' },
        { name: 'Description', propertyName: 'description' },
        { name: 'Quantité', propertyName: 'quantity' },
        { name: 'Taux de Réduction', propertyName: 'reductionRate' },
        { name: 'Catégorie', propertyName: 'reference' },
    ];
    sameName: boolean = false;

    constructor(
        private toast: ToastrService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private loaderService: LoaderService,
        private productService: ProductService,
        private categoryService: CategoryService,
        private posService: PosService
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
        this.getProducts();
        this.getCategories();
        this.getPos();
        this.addForm = this.fb.group({
            name: new FormControl(null, [Validators.required]),
            price: new FormControl(null, [Validators.required]),
            reductionRate: new FormControl(null, [Validators.required]),
            image: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
            category: new FormControl(null, [Validators.required]),
            quantity: new FormControl(null, [Validators.required]),
            pos: new FormControl(null, [Validators.required]),
            id: new FormControl(null),
        });
    }

    override activateOrDeactivate(item: any) {
        this.productService.activate(item).subscribe({
            next: (il) => {
                this.toast.success(`Status modifié avec succèss`, `Product`, {
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
                this.ProductsChanged.emit();
            },
        });
    }

    override delete(id: string) {
        this.productService.delete(id).subscribe({
            next: (il) => {
                this.toast.success(`Produit supprimé avec succèss`, `Product`, {
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
                this.ProductsChanged.emit();
            },
        });
    }

    override openModal(content: any) {
        this.mode = 'SAVE';
        this.productId = null;
        this.sameName = false;
        this.submitted = false;
        this.editing = false
        this.modalService.open(content, { centered: true });
        this.addForm.reset();
    }

    override openEditModal(content: any, item: any) {
        this.editing = true;
        this.submitted = false;
        this.sameName = false;
        this.mode = 'EDIT';
        this.productId = item.id;
        this.product$ = this.productService.getById(this.productId).pipe(map((response) => response.data));
        this.product$.subscribe((res) => {
            this.product = res;
            this.addForm.get('name').setValue(this.product.name);
            this.addForm.get('description').setValue(this.product.description);
            this.addForm.get('price').setValue(this.product.price);
            this.addForm.get('reductionRate').setValue(this.product.reductionRate);
            this.addForm.get('quantity').setValue(this.product.quantity);
            console.log(this.addForm.controls)
        });
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    override hideModal() {
        this.modalService.dismissAll();
    }

    override onPageChange(current: number) {
        this.datas = this.productService.getAllPaginated(
            this.term,
            current - 1,
            this.limit
        );
    }

    search(content: any): void {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    searchProduct() {
        this.isFilter = true;
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        });

        const term: string = this.searchForm.get('term')?.value;

        if (term) {
            this.hideModal();
            this.searchForm.reset();
            const products$ = this.productService.getAllPaginated(term, this.page, this.limit);
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Product>>(products$);
        }
    }

    reset() {
        this.isFilter = false;
        const products$ = this.productService.getAllPaginated(
            this.term,
            this.page,
            this.limit
        );
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Product>>(products$);
        this.searchForm.reset();
    }

    override add() {
        this.sameName = false;
        this.submitted = true;
        this.isLoading$.next(true);
        setTimeout(() => {
            this.isLoading$.next(false);
            this.cdr.detectChanges();
        }, 1500);
        if (!this.addForm.invalid) {
            let t: Product = {} as Product;
            t.name = this.addForm.get('name')?.value;
            t.price = this.addForm.get('price')?.value;
            t.reductionRate = this.addForm.get('reductionRate')?.value;
            t.description = this.addForm.get('description')?.value;
            t.categoryId = this.addForm.get('category')?.value;
            t.pointOfSaleId = this.addForm.get('pos')?.value;
            t.quantity = this.addForm.get('quantity')?.value;
            if (this.productId) {
                this.productService.getAllPaginated(this.term, this.page, this.limit).subscribe((result) => {
                    let alreadyExist: boolean = false;
                    result.datas.forEach(p => {
                        if (p.name == t.name) {
                            alreadyExist = true
                        }
                     });
                        if (alreadyExist) {
                            this.sameName = true;
                        } else {
                            this.productService.edit(this.productId, t).subscribe({
                                    next: () => {
                                        this.toast.success(
                                            `Produit modifié avec succès`,
                                            `Enseigne`,
                                            {
                                                timeOut: 5000,
                                            }
                                        );
                                        // let productImage = new productImages()
                                        // productImage.image = this.addForm.get('image')?.value;
                                        // console.log(productImage);
                                        // this.productService.addProductImage(this.productId, productImage).subscribe(
                                        //     {next: (productImage) => {
                                        //         console.log(productImage);
                                        //         console.log("Ca a marché")
                                        //     },
                                        //     error : (err) => {
                                        //         console.log(err);
                                        //         this.toast.error(
                                        //             `Erreur lors de l'enregistrement de l'image, veuillez contacter votre administrateur`,
                                        //             `Une erreur est survenue`,
                                        //             {
                                        //                 timeOut: 5000,
                                        //             }
                                        //         );
                                        //     },
                                        //     complete: () => {
                                        //         console.log('Appelle complété');
                                        //         this.hideModal();
                                        //         this.getDatas();
                                        //     }}
                                        // )
                                    },
                                    error: (err) => {
                                        console.log(err)
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
                    });
            } else {
                this.productService.getAllPaginated(this.term, this.page, this.limit).subscribe((result) => {
                    let alreadyExist: boolean = false;
                    result.datas.forEach(p => {
                        if (p.name == t.name) {
                            alreadyExist = true
                        }
                     });
                        if (alreadyExist) {
                            this.sameName = true;
                        } else {
                            this.productService.create(t).subscribe({
                                next: (res) => {
                                    this.toast.success(
                                        `Produit ajoutée avec succèss`,
                                        `Enseigne`,
                                        {
                                            timeOut: 5000,
                                        }
                                    );
                                    // this.productService.getAllPaginated(this.term, this.page, this.limit).subscribe((resultList) => { 
                                    //     resultList.datas.forEach((p) => {
                                    //         if (p.name == t.name) {
                                    //             let productImage = new productImages()
                                    //             productImage.image = this.addForm.get('image')?.value;
                                    //             console.log(productImage);
                                    //             this.productService.addProductImage(this.productId, productImage).subscribe(
                                    //                 {next: (productImage) => {
                                    //                     console.log(productImage);
                                    //                     console.log("Ca a marché")
                                    //                 },
                                    //                 error : (err) => {
                                    //                     console.log(err);
                                    //                     this.toast.error(
                                    //                         `Erreur lors de l'enregistrement de l'image, veuillez contacter votre administrateur`,
                                    //                         `Une erreur est survenue`,
                                    //                         {
                                    //                             timeOut: 5000,
                                    //                         }
                                    //                     );
                                    //                 },
                                    //                 complete: () => {
                                    //                     console.log('Appelle complété');
                                    //                     this.hideModal();
                                    //                     this.getDatas();
                                    //                 }}
                                    //             )
                                    //         }
                                    //     });
                                    // })
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
                    });
            }
        } else {
            console.log("le formulaire a un problème")
        }   
    }

    getDatas() {
        const product$ = this.productService.getAllPaginated(this.term, this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Product>>(product$);
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

    getCategories() {
        this.categoryService.getAllPaginated(this.term, this.page, this.limit).
            subscribe((resCategories) => {
                this.categories = resCategories.datas;
            });
    }

    getPos() {
        this.posService.getAllPaginated(this.term, this.page, this.limit).subscribe((resPos) => {
                this.pos = resPos.datas;
            });
    }

    getProducts() {
        this.productService.getAllPaginated(this.term, this.page, this.limit).subscribe((resCategories) => {
            console.log(resCategories);
        });
    }

    publishProduct(produit : Product) {
        console.log(produit)
        console.log("Activation")
        this.productService.publishProduct(produit.id).subscribe({
            next: ()=> {
                console.log("reussite")
                this.toast.success(
                    `Produit débloqué avec succès`,
                    `Product`,
                    {
                        timeOut: 5000,
                    }
                );
            },
            error: () => {
                console.log("échec")
                this.toast.error(
                    `Veuillez contacter votre administrateur`,
                    `Une erreur est survenue`,
                    {
                        timeOut: 5000,
                    }
                );
            },
            complete() {
                console.log("Complété")
            },
        })
    }
    
    unPublishProduct(produit : Product) {
        console.log(produit)
        console.log("Désactivation")
        this.productService.unpublishProduct(produit.id).subscribe({
            next: ()=> {
                console.log("reussite")
                this.toast.success(
                    `Produit bloqué avec succès`,
                    `Product`,
                    {
                        timeOut: 5000,
                    }
                );
            },
            error: () => {
                console.log("échec")
                this.toast.error(
                    `Veuillez contacter votre administrateur`,
                    `Une erreur est survenue`,
                    {
                        timeOut: 5000,
                    }
                );
            },
            complete() {
                console.log("Complété")
            },
        })
    }
}
