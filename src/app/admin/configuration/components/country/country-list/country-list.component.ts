import {Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef} from "@angular/core";
import {Country} from "../../../models/country";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {ToastrService} from "ngx-toastr";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {ApiResponsePage} from "../../../../../shared/models/response/api-response-page";
import {CountryService} from "../../../services/country.service";
import {LoaderService} from "../../../../../shared/services/loader.service";





@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent
  extends AbstractComponent<Country>
  implements OnInit {

  mode:string;
  id:string;

  country: Country = {} as Country;

  country$: Observable<Country>;

  columns = [
    { name: 'Nom', propertyName: 'name' },
    { name: 'Devise', propertyName: 'currency' },
    { name: 'ISO2', propertyName: 'iso2' },
    { name: 'ISO3', propertyName: 'iso3' },
    { name: 'Langue', propertyName: 'lang' }

  ];


  @Input()
  datas: Observable<ApiResponsePage<Country>>;

  @Output()
  private countriesChanged = new EventEmitter();



  constructor(
    private toast: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private countryService: CountryService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService
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


  override onPageChange(current: number) {
    this.datas = this.countryService.getAllPaginated(this.term,current - 1, this.limit);
  }


    search(content: any): void {
        this.modalService.open(content, { centered: true, size: 'lg' });
    }

    override hideModal() {
        this.modalService.dismissAll();
    }

    searchCountry(){
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
            const countries$ = this.countryService.getAllPaginated(term,this.page, this.limit);
            this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Country>>(countries$);
        }

    }

    reset(){
        this.isFilter = false
        const countries$ = this.countryService.getAllPaginated(this.term,this.page, this.limit);
        this.datas = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Country>>(countries$);
        this.searchForm.reset();
    }









}
