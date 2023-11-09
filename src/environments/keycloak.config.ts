/**
 * Here you can add the configuration related to keycloak
 * So we can use this common config for diffrent environment
 */
import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'https://auth-douns.clicdev-consulting.com/',
  realm: 'master',
  clientId: 'douns-web-admin'
};

export default keycloakConfig;
