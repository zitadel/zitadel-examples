import { createOidcAuth, LogLevel, SignInType } from 'vue-oidc-client/vue3';

const VUE_APP_ZITADEL_AUTHORITY = "https://bringmos-jv1jqo.zitadel.app/";
const VUE_APP_ZITADEL_CLIENT_ID = "169824185969869057@vue";
// note the ending '/'
const appUrl = "http://localhost:3000/";

const idsrvAuth = createOidcAuth(
  "main",
  SignInType.Window,
  appUrl,
  {
    authority: VUE_APP_ZITADEL_AUTHORITY,
    client_id: VUE_APP_ZITADEL_CLIENT_ID,
    response_type: "code",
    scope: "openid profile email",
    prompt: "login",
    // stateStore: new WebStorageStateStore({ store: window.localStorage })
  },
  console,
  LogLevel.Debug
);

// SignInType could be Window or Popup
export const mainOidc = createOidcAuth("main", SignInType.Window, appUrl, {
  authority: "https://demo.identityserver.io/",
  client_id: "implicit",
  response_type: "id_token token",
  scope: "openid profile email api",
});

// handle events
idsrvAuth.events.addAccessTokenExpiring(function () {
  // eslint-disable-next-line no-console
  console.log("access token expiring");
});

idsrvAuth.events.addAccessTokenExpired(function () {
  // eslint-disable-next-line no-console
  console.log("access token expired");
});

idsrvAuth.events.addSilentRenewError(function (err: Error) {
  // eslint-disable-next-line no-console
  console.error("silent renew error", err);
});

idsrvAuth.events.addUserLoaded(function (user: User) {
  // eslint-disable-next-line no-console
  console.log("user loaded", user);
});

idsrvAuth.events.addUserUnloaded(function () {
  // eslint-disable-next-line no-console
  console.log("user unloaded");
});

idsrvAuth.events.addUserSignedOut(function () {
  // eslint-disable-next-line no-console
  console.log("user signed out");
});

idsrvAuth.events.addUserSessionChanged(function () {
  // eslint-disable-next-line no-console
  console.log("user session changed");
});

export default idsrvAuth;
