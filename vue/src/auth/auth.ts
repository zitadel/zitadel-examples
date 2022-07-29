import { createOidcAuth, LogLevel, SignInType } from 'vue-oidc-client/vue3';

const ZITADEL_ISSUER = "https://example-jv1jqo.zitadel.cloud/";
const ZITADEL_CLIENT_ID = "169824185969869057@vue";
const appUrl = "http://localhost:3000/";

const mainOidc = createOidcAuth(
  "main",
  SignInType.Window,
  appUrl,
  {
    authority: ZITADEL_ISSUER,
    client_id: ZITADEL_CLIENT_ID,
    response_type: "code",
    scope: "openid profile email",
  },
  console,
  LogLevel.Debug
);

// handle events
mainOidc.events.addAccessTokenExpiring(function () {
  // eslint-disable-next-line no-console
  console.log("access token expiring");
});

mainOidc.events.addAccessTokenExpired(function () {
  // eslint-disable-next-line no-console
  console.log("access token expired");
});

mainOidc.events.addSilentRenewError(function (err: Error) {
  // eslint-disable-next-line no-console
  console.error("silent renew error", err);
});

mainOidc.events.addUserLoaded((user: any) => {
  // eslint-disable-next-line no-console
  //   router.push("/about");
  console.log("user loaded", user);
});

mainOidc.events.addUserUnloaded(function () {
  // eslint-disable-next-line no-console
  console.log("user unloaded");
});

mainOidc.events.addUserSignedOut(function () {
  // eslint-disable-next-line no-console
  console.log("user signed out");
});

mainOidc.events.addUserSessionChanged(function () {
  // eslint-disable-next-line no-console
  console.log("user session changed");
});

export default mainOidc;
