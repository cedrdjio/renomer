import {
    Component,
    ViewEncapsulation,
    HostListener,
    OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { Role } from '../../models/misc/role.enum';
import { AuthService } from '../../../auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { AbstractComponent } from '../abstract-component';
import { Menu } from '../../models/menu';
import { PartnerUserService } from '../../../admin/configuration/services/partner-user.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent extends AbstractComponent<any> implements OnInit {
    public iconSidebar;
    public menuItems: Menu[];
    public url: any;
    public fileurl: any;

    MENUIPARTNERSTEMS: Menu[];

    itemsPartners = new BehaviorSubject<Menu[]>([]);

    newid: string;

    // For Horizontal Menu
    public margin: any = 0;
    public width: any = window.innerWidth;
    public leftArrowNone: boolean = true;
    public rightArrowNone: boolean = false;

    constructor(
        private router: Router,
        public navServices: NavService,
        private partnerUserService: PartnerUserService,
        public layout: LayoutService,
        private authService: AuthService
    ) {
        super();
    }

    MENUITEMS: Menu[] = [
        {
            headTitle1: 'Configuration',
            headTitle2: 'Administration Douns',
        },
        {
            path: '/admin/dashboard',
            title: 'Tableau de bord',
            icon: 'home',
            type: 'link',
            bookmark: true,
            active: false,
        },
        {
            path: '/admin/countries',
            title: 'Pays',
            icon: 'globe',
            type: 'link',
            bookmark: true,
            active: false,
        },
        {
            path: '/admin/pos',
            title: 'Points de vente',
            icon: 'truck',
            type: 'link',
            bookmark: true,
            active: false,
        },
        {
            title: 'Enseignes',
            icon: 'clipboard',
            type: 'sub',
            active: false,
            children: [
                {
                    path: '/admin/partners',
                    title: 'Enseignes',
                    type: 'link',
                    bookmark: true,
                },
            ],
        },
        {
            path: '/admin/categories',
            title: 'Catégories',
            icon: 'cast',
            type: 'link',
            bookmark: true,
            active: false,
        },
        {
            path: '/admin/produits',
            title: 'Produits',
            icon: 'shopping-bag',
            type: 'link',
            bookmark: true,
            active: false,
        },
        {
            path: '/admin/clients',
            title: 'Clients',
            icon: 'user',
            type: 'link',
            bookmark: true,
            active: false,
        },
        {
            path: '/admin/users',
            title: 'Administrateurs',
            icon: 'users',
            type: 'link',
            bookmark: true,
            active: false,
        },
    ];

    // Array
    items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

    ngOnInit(): void {
        console.log(1);

        console.log(2);
        this.items.subscribe((menuItems) => {
            this.menuItems = menuItems;
            console.log(this.menuItems);
            this.activateMenuItemByUrl(menuItems);
        });
        if (this.isPartner) {
            this.partnerUserService
                .getPartnerUserInfos()
                .pipe(map((res) => res.partnerId))
                .subscribe((res: string) => {
                    this.id = res;
                    this.MENUIPARTNERSTEMS = [
                        {
                            headTitle1: 'Configuration',
                            headTitle2: 'Administration Douns',
                        },
                        {
                            path: '/admin/dashboard',
                            title: 'Tableau de bord',
                            icon: 'home',
                            type: 'link',
                            bookmark: true,
                            active: false,
                        },
                        {
                            path: '/admin/countries',
                            title: 'Pays',
                            icon: 'globe',
                            type: 'link',
                            bookmark: true,
                            active: false,
                        },
                        {
                            path: '/admin/pos',
                            title: 'Points de vente',
                            icon: 'truck',
                            type: 'link',
                            bookmark: true,
                            active: false,
                        },
                        {
                            path: '#',
                            title: 'Produits',
                            icon: 'shopping-bag',
                            type: 'link',
                            bookmark: true,
                            active: false,
                        },
                        {
                            path: '#',
                            title: 'Catégories',
                            icon: 'cast',
                            type: 'link',
                            bookmark: true,
                            active: false,
                        },
                        {
                            path: '#',
                            title: 'Commandes',
                            icon: 'shopping-cart',
                            type: 'link',
                            bookmark: true,
                            active: false,
                        },
                        {
                            path: `/admin/partners/${this.id}`,
                            title: 'Utilisateurs',
                            icon: 'user',
                            type: 'link',
                            bookmark: true,
                            active: false,
                        },
                    ];

                    this.itemsPartners.next(this.MENUIPARTNERSTEMS);

                    this.itemsPartners.subscribe((menuItems) => {
                        this.menuItems = menuItems;
                        this.activateMenuItemByUrl(menuItems);
                    });
                });
        }
    }
    activateMenuItemByUrl(menuItems: Menu[]) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.activateMenuItems(menuItems, event.url);
            }
        });
    }

    private activateMenuItems(items: Menu[], url: string) {
        items.forEach((item) => {
            if (item.path === url) {
                this.setNavActive(item);
            }
            if (item.children) {
                this.activateMenuItems(item.children, url);
            }
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.width = event.target.innerWidth - 500;
    }

    sidebarToggle() {
        this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
    }

    // Active Nave state
    setNavActive(item) {
        this.menuItems.filter((menuItem) => {
            if (menuItem !== item) {
                menuItem.active = false;
            }
            if (menuItem.children && menuItem.children.includes(item)) {
                menuItem.active = true;
            }
            if (menuItem.children) {
                menuItem.children.filter((submenuItems) => {
                    if (
                        submenuItems.children &&
                        submenuItems.children.includes(item)
                    ) {
                        menuItem.active = true;
                        submenuItems.active = true;
                    }
                });
            }
        });
    }

    // Click Toggle menu
    toggletNavActive(item) {
        if (!item.active) {
            this.menuItems.forEach((a) => {
                if (this.menuItems.includes(item)) {
                    a.active = false;
                }
                if (!a.children) {
                    return false;
                }
                a.children.forEach((b) => {
                    if (a.children.includes(item)) {
                        b.active = false;
                    }
                });
            });
        }
        item.active = !item.active;
    }

    // For Horizontal Menu
    scrollToLeft() {
        if (this.margin >= -this.width) {
            this.margin = 0;
            this.leftArrowNone = true;
            this.rightArrowNone = false;
        } else {
            this.margin += this.width;
            this.rightArrowNone = false;
        }
    }

    scrollToRight() {
        if (this.margin <= -3051) {
            this.margin = -3464;
            this.leftArrowNone = false;
            this.rightArrowNone = true;
        } else {
            this.margin += -this.width;
            this.leftArrowNone = false;
        }
    }

    public get isAdmin(): boolean {
        return (
            this.getUserRole() === Role.ADMIN_ROOT ||
            this.getUserRole() === Role.ADMIN_USER
        );
    }

    public get isPartner(): boolean {
        return this.getUserRole() === Role.PARTNER_MANAGER;
    }

    private getUserRole(): string {
        return this.authService.getRoleByTokens();
    }
}
