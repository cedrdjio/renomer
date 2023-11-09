import { KeycloakOptions, KeycloakService } from 'keycloak-angular';
import {environment} from "../../../environments/environment";

export function initializer(keycloak: KeycloakService): () => Promise<void> {

  return (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: {
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId
          },
            loadUserProfileAtStartUp: false,
            initOptions: {
                pkceMethod: 'S256',
                onLoad: 'login-required',
                checkLoginIframe: false
            },
            bearerExcludedUrls: []
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}


