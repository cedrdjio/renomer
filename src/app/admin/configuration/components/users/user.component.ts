import {Component, OnInit} from "@angular/core";
import {AbstractComponent} from "../../../../shared/components/abstract-component";
import {ApiResponsePage} from "../../../../shared/models/response/api-response-page";
import {LoaderService} from "../../../../shared/services/loader.service";
import {User} from "../../models/user";
import {Observable} from "rxjs";
import {UserService} from "../../services/user.service";



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends AbstractComponent<User> implements OnInit {

  users$: Observable<ApiResponsePage<User>>;


  constructor(private loaderService: LoaderService,
              private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.reloadUsers();
  }


  reloadUsers() {
    const users$ = this.userService.getUsersAllPaginated(this.term, this.page, this.limit);
    this.users$ = this.loaderService.showLoaderUntilCompleted<ApiResponsePage<User>>(users$);
  }

}
