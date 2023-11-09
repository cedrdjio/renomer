import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {combineLatest} from "rxjs";
import {UserService} from "../../../services/user.service";
import {LoaderService} from "../../../../../shared/services/loader.service";
import {map, shareReplay, tap} from "rxjs/operators";
import {AbstractComponent} from "../../../../../shared/components/abstract-component";
import {CountryService} from "../../../services/country.service";
import {PosService} from "../../../services/pos.service";
import {Role} from "../../../../../shared/models/misc/role.enum";
import {AuthService} from "../../../../../auth/services/auth.service";
import {PartnerService} from "../../../services/partner.service";
import {ClientService} from "../../../services/client.service";




@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent extends AbstractComponent<any> implements OnInit
{

  constructor( private router:Router,
               private modalService:NgbModal,
               private countryService: CountryService,
               private loaderService: LoaderService,
               private posService: PosService,
               private partnerService: PartnerService,
               private clientService: ClientService,
               private authService: AuthService,
               private userService: UserService,) {
    super();

  }


  ngOnInit(): void {

  }

  users$ = this.userService.getAllPaginated(this.term,this.page, this.limit).pipe(
      map(res => {
          res.datas =  res.datas.filter(user => (user.role === Role.ADMIN_USER || user.role === Role.ADMIN_ROOT));
          res.totalElements = (res.datas.length);
          return res;
      }),
      shareReplay()
  )

  countries$ = this.countryService.getAllPaginated(this.term,this.page, this.limit);

  partners$ = this.partnerService.getAllPaginated(this.term,this.page, this.limit);

  clients$ = this.clientService.getAllPaginated(this.term,this.page, this.limit);

  pos$ = this.posService.getAllPaginated(this.term,this.page, this.limit);


  datas$ = this.loaderService.showLoaderUntilCompleted<any>(combineLatest([
    this.users$, this.countries$, this.partners$,
      this.clients$
  ]).pipe(
    map(([users,countries, partners, clients]) => ({
        users, countries, partners, clients}))
  ));



    datasPartners$ = this.loaderService.showLoaderUntilCompleted<any>(combineLatest([
        this.pos$
    ]).pipe(
        map(([pos]) => ({
            pos}))
    ));

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
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
