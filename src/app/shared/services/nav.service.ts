import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import {takeUntil, debounceTime, map, switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';
import {Role} from "../models/misc/role.enum";
import {AuthService} from "../../auth/services/auth.service";
import {Observable} from "rxjs";
import {User} from "../../admin/configuration/models/user";
import {PartnerUserService} from "../../admin/configuration/services/partner-user.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Menu} from "../models/menu";



@Injectable({
	providedIn: 'root'
})

export class NavService implements OnDestroy, OnInit {



	private unsubscriber: Subject<any> = new Subject();
	public  screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

	// Search Box
	public search: boolean = false;

	id: string = '';

	user$: Observable<User>;

	// Language
	public language: boolean = false;

	// Mega Menu
	public megaMenu: boolean = false;
	public levelMenu: boolean = false;
	public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

	// Collapse Sidebar
	public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

	// For Horizontal Layout Mobile
	public horizontal: boolean = window.innerWidth < 991 ? false : true;

	// Full screen
	public fullScreen: boolean = false;

	constructor(private router: Router,private authService: AuthService,private partnerUserService: PartnerUserService, private http: HttpClient) {
		this.setScreenWidth(window.innerWidth);
		fromEvent(window, 'resize').pipe(
			debounceTime(1000),
			takeUntil(this.unsubscriber)
		).subscribe((evt: any) => {
			this.setScreenWidth(evt.target.innerWidth);
			if (evt.target.innerWidth < 991) {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			}
			if(evt.target.innerWidth < 1199) {
				this.megaMenuColapse = true;
			}
		});
		if(window.innerWidth < 991) { // Detect Route change sidebar close
			this.router.events.subscribe(event => {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			});
		}






	}


    ngOnInit(): void {

    }

	ngOnDestroy() {
		this.unsubscriber.next(false);
		this.unsubscriber.complete();

	}

	private setScreenWidth(width: number): void {
		this.screenWidth.next(width);
	}

    getPartnerId(): string {
        let partId: string = '';
        this.http.get<User>(
            environment.baseUrl + 'partners/users/infos'
        ).pipe(
            map(res =>  res['data']),
            switchMap((partner:User) => {
                if (partner !== undefined) {
                    partId = partner.partnerId;
                    console.log("parnerId  " + partId);
                    return partId;
                }

            }),
        );
        console.log("parnerId  " + partId);
        return partId;

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
