// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  redirectUri: '/',
  azureAd: {
    tenantId: 'f610c0b7-bd24-4b39-810b-3dc280afb590',
    clientId: '335d2143-c040-43aa-bee3-1df633287cd8',

  },

};
