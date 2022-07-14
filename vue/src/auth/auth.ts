import { createOidcAuth, LogLevel, SignInType } from 'vue-oidc-client/vue3';

const VUE_APP_ZITADEL_AUTHORITY = "https://bringmos-jv1jqo.zitadel.app/";
const VUE_APP_ZITADEL_CLIENT_ID = "169824185969869057@vue";
// note the ending '/'
const appUrl = "http://localhost:3000/";

const mainOidc = createOidcAuth(
  "main",
  SignInType.Window,
  appUrl,
  {
    authority: VUE_APP_ZITADEL_AUTHORITY,
    client_id: VUE_APP_ZITADEL_CLIENT_ID,
    response_type: "code",
    scope: "openid profile email",
    // prompt: "login",
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
