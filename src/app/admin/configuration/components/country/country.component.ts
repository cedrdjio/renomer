import {Component, OnInit} from "@angular/core";
import {Country} from "../../models/country";
import {Observable} from "rxjs";
import {LoaderService} from "../../../../shared/services/loader.service";
import {CountryService} from "../../services/country.service";
import {ApiResponsePage} from "../../../../shared/models/response/api-response-page";
import {AbstractComponent} from "../../../../shared/components/abstract-component";


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent extends AbstractComponent<Country> implements OnInit {

  countries$: Observable<ApiResponsePage<Country>>;


  constructor(private loaderService: LoaderService,
              private countryService: CountryService) {
    super();
  }

  ngOnInit(): void {
    this.reloadCountries();
  }


  reloadCountries() {
    const countries$ = this.countryService.getAllPaginated(this.term,this.page, this.limit);
    this.countries$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<Country>>(countries$);
  }

}
