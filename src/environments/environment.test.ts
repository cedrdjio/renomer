// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import keycloakConfig from "./keycloak.config";

export const environment = {
  baseUrl: 'https://api-douns.clicdev-consulting.com/',
  keycloak: keycloakConfig,
  production: true,
};

