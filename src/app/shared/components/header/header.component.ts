import {Component, Input, OnInit, Output,EventEmitter} from "@angular/core";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {KeycloakService} from "keycloak-angular";
import {UserKeycloackModel} from "../../../admin/configuration/models/userKeycloack";
import {KeycloakProfile} from "keycloak-js";
import {AbstractComponent} from "../abstract-component";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss']
})
export class HeaderComponent extends AbstractComponent<any> implements OnInit {

  user = new UserKeycloackModel();

  public isLoggedIn = false;
  public userProfile!: KeycloakProfile;

  firsname: string = "";
  lastname: string = "";

  auth!: any;




  constructor( private router:Router,
               private modalService:NgbModal,
               private readonly keycloakService: KeycloakService) {
    super();
  }


  async ngOnInit() {
    this.loadScript('../../../../assets/js/jquery-3.5.1.min.js');
    this.loadScript('../../../../assets/js/bootstrap/bootstrap.bundle.min.js');
    this.loadScript('../../../../assets/js/icons/feather-icon/feather.min.js');
    this.loadScript('../../../../assets/js/icons/feather-icon/feather-icon.js');
    this.loadScript('../../../../assets/js/scrollbar/simplebar.js');
    this.loadScript('../../../../assets/js/scrollbar/custom.js');
    this.loadScript('../../../../assets/js/config.js');
    //this.loadScript('../../../../assets/js/sidebar-menu.js');
    this.loadScript('../../../../assets/js/chart/chartist/chartist.js');

    this.loadScript('../../../../assets/js/chart/knob/knob.min.js');
    this.loadScript('../../../../assets/js/chart/knob/knob-chart.js');
    this.loadScript('../../../../assets/js/chart/apex-chart/apex-chart.js');
    this.loadScript('../../../../assets/js/chart/apex-chart/stock-prices.js');
    this.loadScript('../../../../assets/js/notify/bootstrap-notify.min.js');

    this.loadScript('../../../../assets/js/datepicker/date-picker/datepicker.js');
    this.loadScript('../../../../assets/js/datepicker/date-picker/datepicker.en.js');
    this.loadScript('../../../../assets/js/datepicker/date-picker/datepicker.custom.js');
    this.loadScript('../../../../assets/js/typeahead/handlebars.js');
    this.loadScript('../../../../assets/js/typeahead/typeahead.bundle.js');
    this.loadScript('../../../../assets/js/typeahead/typeahead.custom.js');
    this.loadScript('../../../../assets/js/typeahead-search/handlebars.js');
    this.loadScript('../../../../assets/js/typeahead-search/typeahead-custom.js');
    this.loadScript('../../../../assets/js/tooltip-init.js');
    this.loadScript('../../../../assets/js/script.js');
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
      if(this.userProfile){
          console.log(this.userProfile);

          this.firsname = this.userProfile.firstName;
        this.lastname = this.userProfile.lastName;
      }
      //this.user.name = this.userProfile.firstName;
      window.sessionStorage.setItem('userdetails', JSON.stringify(this.user));
    }

  }

  logout() {
    this.keycloakService.logout();
  }




}
