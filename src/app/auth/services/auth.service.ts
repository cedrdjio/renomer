import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import {KeycloakLoginOptions, KeycloakProfile, KeycloakTokenParsed} from 'keycloak-js';
import {JwtHelperService} from "@auth0/angular-jwt";
import {Role} from "../../shared/models/misc/role.enum";
declare let Keycloak: any;

@Injectable()
export class AuthService {
  static auth: any = {};
  constructor(private keycloakService: KeycloakService) {}

    private jwtHelper = new JwtHelperService();
    getToken: string;

  public getLoggedUser(): KeycloakTokenParsed | undefined {
    try {
      const userDetails: KeycloakTokenParsed | undefined = this.keycloakService.getKeycloakInstance()
        .idTokenParsed;
      return userDetails;
    } catch (e) {
      console.error('Exception', e);
      return undefined;
    }
  }

    roles!: string[];
    private role: string;

  public isLoggedIn(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  public loadUserProfile(): Promise<KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }

  public login(): void {
    this.keycloakService.login();
  }


  public logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

  public redirectToProfile(): void {
    this.keycloakService.getKeycloakInstance().accountManagement();
  }

  public getRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  public async getAccessToken(): Promise<string> {
    return await this.keycloakService.getToken();
  }


    public getRoleByTokens(): string {
        if(this.getRoles().includes("douns-partner-manager") || this.getRoles().includes("douns-partner-user")){
            this.role = Role.PARTNER_MANAGER;
        }

        if(this.getRoles().includes("douns-admin-root") || this.getRoles().includes("douns-admin-user")|| this.getRoles().includes("admin")){
            this.role = Role.ADMIN_ROOT;
        }

        return this.role;

    }

}
